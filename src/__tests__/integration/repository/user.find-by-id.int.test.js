///Ex: Crie testes de integração para o método `findById` do repositório de usuários, garantindo que ele retorne o usuário correto com base no ID fornecido
// lide adequadamente com casos em que o usuário não é encontrado.
import userModel from '../../../models/user.model.js';
import userRepository from '../../../repositories/user.repository.js';



describe('when we try to find a user by a valid id', () => {
  it('returns the correct user', async () => {
    const userData = {
      name: 'Find By ID User',
      email: `findbyid-${Date.now()}@example.com`,
      password: 'strongpasswordforfindbyid123',
    };

    const createdUser = await userModel.create(userData); 
    //sempre utilize o model para criar dados de teste diretamente no banco
    // não utilize o repositório para criar dados de teste para evitar dependências circulares nos testes. 

    const foundUser = await userRepository.findById(createdUser._id);

        expect(foundUser).toBeDefined();

    expect(foundUser._id.toString()).toBe(createdUser._id.toString());
    expect(foundUser.email).toBe(userData.email.toLowerCase());
  });
});