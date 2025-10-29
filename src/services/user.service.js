import repo from '../repositories/user.repository.js';
import createError from '../utils/app-error.js';
import hashPassword from '../utils/hash-password.js';
function ensureValidPayload({ name, email, password }) {
  if (!name?.trim()) throw createError('Nome é obrigatório.', 400);
  if (!email?.trim()) throw createError('E-mail é obrigatório.', 400);
  if (!email.includes('@')) throw createError('E-mail inválido.', 400);
  if (!password) throw createError('Senha é obrigatória.', 400);
}

export default {
  async createUser(data) {
    ensureValidPayload(data);
    const existing = await repo.findByEmail(data.email);
    if (existing) throw createError('E-mail já cadastrado.', 409);

    const hashedPassword = hashPassword(data.password);

    return repo.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
    });
  },

  async listUsers() {
    return repo.findAll();
  },

  async getUser(id) {
    const user = await repo.findById(id);
    if (!user) throw createError('Usuário não encontrado.', 404);
    return user;
  },

  async updateUser(id, data) {
    const payload = { ...data };

    if (payload.email) {
      if (!payload.email.includes('@')) {
        throw createError('E-mail inválido.', 400);
      }
      const existing = await repo.findByEmail(payload.email);
      if (existing && existing.id !== id) {
        throw createError('E-mail já cadastrado.', 409);
      }
      payload.email = payload.email.trim().toLowerCase();
    }

    if (payload.name) {
      payload.name = payload.name.trim();
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    if (Object.keys(payload).length === 0) {
      throw createError('Nenhum campo informado para atualização.', 400);
    }

    const updated = await repo.updateById(id, payload);
    if (!updated) throw createError('Usuário não encontrado.', 404);
    return updated;
  },

  async removeUser(id) {
    const deleted = await repo.deleteById(id);
    if (!deleted) throw createError('Usuário não encontrado.', 404);
  },
};
