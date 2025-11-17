import userRepository from '../../repositories/user.repository.js';
import User from '../../models/user.model.js';


describe ('when we try to create a user with an email that already exists', () => {
  it ('throws a validation error', async () => {
    const userData = {
      name: 'Duplicate Email User',
      email: `duplicate-${Date.now()}@example.com`,
      password: 'anotherstrongpassword123',
    };

    await userRepository.create(userData);

    await expect(userRepository.create(userData)).rejects.toThrow();
  });
})



describe('when we try to create a valid user ', () => {
  it('the created user has an id', async () => {
    const userData = {
      name: 'User With ID',
      email: `withid-${Date.now()}@example.com`,
      password: 'yetanotherstrongpassword123',
    };

    const createdUser = await userRepository.create(userData);

    expect(createdUser).toHaveProperty('_id');
    expect(createdUser._id).toBeDefined();
    
  });
})
