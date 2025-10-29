const repo = require('../repositories/user.repository');

module.exports = {

  async findUserByEmail(data) {
    try{
      const user = repo.findUserByEmail(data);
      return user;
    }catch(error){
      throw new Error('Error in service while finding user by email: ' + error.message);
    }
  },

  async loginUser(data) {
    const user = await this.findUserByEmail(data);
    if (!user) {
      throw new Error('User not found');
    }
  const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }
    
     const token = jwt.sign({ userId: user._id , roles: user.Role}, secret,
   { expiresIn: '1h' });

    return token;
  },



  async createUser(data) {
    if (!data.email?.includes('@')) {
      throw new Error('Invalid email');
    }
    const existEmail = repo.findUserByEmail(data.email)

    if (existEmail) {
      throw new Error('Email already in use');
    }
    return repo.create(data);
  },
  listUsers() { return repo.findAll(); },
  getUser(id) { return repo.findById(id); },
  updateUser(id, data) { return repo.updateById(id, data); },
  removeUser(id) { return repo.deleteById(id); },


};
