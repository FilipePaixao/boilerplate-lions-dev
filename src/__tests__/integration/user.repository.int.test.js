import userRepository from '../../repositories/user.repository.js';
import User from '../../models/user.model.js';

describe('UserRepository.create', () => {
  it('creates a user in the database', async () => {
    const userData = {
      name: 'Integration User',
      email: `integration-${Date.now()}@example.com`,
      password: 'strongpassword123',
    };

    const createdUser = await userRepository.create(userData);

    expect(createdUser).toEqual(
      expect.objectContaining({
        name: userData.name,
        email: userData.email,
      }),
    );

    const storedUser = await User.findOne({ email: userData.email }).lean();

    expect(storedUser).not.toBeNull();
    expect(storedUser.name).toBe(userData.name);
    expect(storedUser.email).toBe(userData.email);
  });
});
