import request from 'supertest';
import { app } from '../../configApp.js';

describe('User Controller - POST /api/users', () => {
  describe('when creating a user with valid payload', () => {
    it('should return status 201 and create user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: `john-${Date.now()}@example.com`,
        password: 'securepassword123',
      }; 

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', userData.name);
      expect(response.body).toHaveProperty('email', userData.email.toLowerCase());
      expect(response.body).not.toHaveProperty('password');
    });
  });

  describe('when creating a user with invalid payload', () => {
    it('should return status 400 when name is missing', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Nome é obrigatório.');
    });

    it('should return status 400 when email is missing', async () => {
      const invalidData = {
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('E-mail é obrigatório.');
    });

    it('should return status 400 when email is invalid', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('E-mail inválido.');
    });

    it('should return status 400 when password is missing', async () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/users')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Senha é obrigatória.');
    });

    it('should return status 409 when email already exists', async () => {
      const userData = {
        name: 'First User',
        email: `duplicate-${Date.now()}@example.com`,
        password: 'password123',
      };

      // Create first user
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Try to create user with same email
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('E-mail já cadastrado.');
    });
  });
});

