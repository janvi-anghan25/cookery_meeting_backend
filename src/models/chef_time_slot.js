import DBOperation from '../services/database/database_operation';
import { v4 as uuidv4 } from 'uuid';
import SchemaModel from '../services/database/schema_model';

/**
 * ? Order
 * * 0 Inactive
 * * 1 Created
 * * 2 Pending
 * * 3 Approve
 * * 4 Rejected
 * * 5 Complete
 * * 6 Incomplete
 * * 7 Canceled
 * * 8 Deleted
 * * 9 Live
 */

const schema = {
  time_slot_id: {
    type: String,
    default: uuidv4,
  },
  chef_id: {
    type: String,
  },
  working_days: {
    type: [String],
    enum: [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ],
    default: 'monday',
  },
  not_working_dates: {
    _id: false,
    unavailable_on: { type: [String], default: [] },
    booked_dates: {
      type: [
        {
          _id: false,
          status: {
            type: Number,
            enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            default: 1,
          },
          portfolio_id: String,
          user_id: String,
          date: String,
          people: Number,
          google_meet_link: String,
        },
      ],
      default: [],
    },
  },
};

const modelName = 'chef_time_slot';
export let chefTimeSlot = DBOperation.createModel(modelName, schema);

let chefTimeSlotModel = new SchemaModel(chefTimeSlot);

export default chefTimeSlotModel;
