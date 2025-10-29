const router = require('express').Router();
const controller = require('../controllers/user.controller');
const { AuthMiddleware } = require('../middlewares/auth-middleware');


router.post('/users', controller.create);
router.get('/users', AuthMiddleware(), controller.list);
router.get('/users/:id', controller.get);
router.put('/users/:id', controller.update);
router.delete('/users/:id', controller.remove);

module.exports = router;
