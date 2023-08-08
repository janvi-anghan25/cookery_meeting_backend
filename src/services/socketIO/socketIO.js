import SocketIO from 'socket.io';
import { logger, level } from '../../config/logger';
import { constants as APP_CONST } from '../../constant/application';
import messageModel from '../../models/messages';
import { uploadFile } from '../../services/aws/aws';
import { v4 as uuidv4 } from 'uuid';
import { constants as WASABI_BUCKET_CONST } from '../../constant/wasabi';

export default (server) => {
  const io = new SocketIO.Server(server, {
    cors: {
      origin: APP_CONST.CHEF_UI_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    logger.log(level.info, `User connected with socket io`);

    socket.on('disconnect', () => {
      logger.log(level.info, `User disconnected...`);
    });

    socket.on('joinRoom', async ({ room, name, user_id }) => {
      socket.join(room, name);

      name = name.trim().toLowerCase();
      room = room.trim().toLowerCase();

      let roomExist = await messageModel.get({ room: room });
      if (roomExist && roomExist.length > 0) {
        let userExist = await messageModel.get({
          users: { $elemMatch: { name: name } },
        });

        if (userExist && userExist.length > 0) {
          console.log('User already exist.');
        } else {
          await messageModel.update(
            { room: room },
            { $push: { users: { user_id, name: name } } }
          );
        }
      } else {
        await messageModel.add({
          room: room,
          users: [{ user_id, name: name }],
        });
      }
      // callback();
    });

    socket.on('leaveRoom', ({ room }) => {
      socket.leave(room);
      console.log('A user left chat room: ' + room);
    });

    socket.on(
      'chatroomMessage',
      async ({ room, message, name, file, file_name, mime_type, time }) => {
        if (message.trim().length > 0) {
          socket.on('sendNotification', (message) => {
            socket.broadcast.emit('sendNotification', message);
          });

          io.to(room).emit('newMessage', {
            message,
            user: name,
            time: time,
          });

          await messageModel.update(
            { room: room },
            { $push: { messages: { message, user: name, time } } }
          );
        }

        if (file) {
          let images = await uploadFile(
            file,
            `chat-image-${uuidv4()}-${file_name}`,
            mime_type,
            WASABI_BUCKET_CONST.COOKEY_MEETING_BUCKET
          );

          io.to(room).emit('newMessage', {
            images,
            user: name,
            time: time,
          });

          await messageModel.update(
            { room: room },
            { $push: { messages: { images, user: name, time } } }
          );
        }
      }
    );
  });
};
