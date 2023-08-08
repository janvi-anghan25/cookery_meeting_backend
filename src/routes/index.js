/**
 * API Routes
 */

import { Router } from 'express';
import AdminUserRoutes from './admin/admin.routes';
import UserRoutes from './user/user.routes';
import chefRoutes from './chef/chef.routes';
import git from 'git-last-commit';
import HTTPStatus from 'http-status';
const status = 'backend service is running';
const routes = new Router();
const PATH = {
  ROOT: '/',
  USER: '/user',
  CHEF: '/chef',
  ADMIN_USER: '/admin',
};

routes.get(PATH.ROOT, (_req, res) => {
  try {
    git.getLastCommit((err, commit) => {
      if (err) {
        return res.status(HTTPStatus.OK).json({
          status,
        });
      }
      return res.status(HTTPStatus.OK).json({
        status,
        info: commit.hash,
      });
    });
  } catch (error) {
    return res.status(HTTPStatus.OK).json({
      status,
    });
  }
});

routes.use(PATH.ADMIN_USER, AdminUserRoutes);
routes.use(PATH.CHEF, chefRoutes);
routes.use(PATH.USER, UserRoutes);

export default routes;
