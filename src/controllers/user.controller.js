import userService from '../services/user.service.js';

export default {
  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body);

      const userObject = typeof user.toObject === 'function' ? user.toObject() : user;
      const { password, ...userWithoutPassword } = userObject;

      res.status(201).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const user = await userService.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await userService.removeUser(req.params.id);
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  },
};
