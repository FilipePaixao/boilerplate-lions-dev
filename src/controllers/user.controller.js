const service = require('../services/user.service');

module.exports = {
  async create(req, res, next) {
    try { 
      res.status(201).json(
      await service.createUser(req.body)); 
    
    }
    catch (err) { next(err); }
  },
  async list(req, res, next) {
    try { res.json(await service.listUsers()); }
    catch (err) { next(err); }
  },
  async get(req, res, next) {
    try {
      const user = await service.getUser(req.params.id);
      if (!user) return res.status(404).json({ message: 'Not found' });
      res.json(user);
    } catch (err) { next(err); }
  },
  async update(req, res, next) {
    try { res.json(await service.updateUser(req.params.id, req.body)); }
    catch (err) { next(err); }
  },
  async remove(req, res, next) {
    try { await service.removeUser(req.params.id); res.status(204).end(); }
    catch (err) { next(err); }
  }
};
