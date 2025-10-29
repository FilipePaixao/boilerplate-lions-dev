import mongoose from 'mongoose';
import createError from '../utils/app-error.js';

export function ensureValidId(req, _res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError('ID inválido.', 400);
  }
  next();
}
