const User = require('../models/user.model');

module.exports = {
  create(data) { 
    return User.create(data); 
  },
  findAll() { return User.find(); },

  findById(id) { return User.findById(id); },
  updateById(id, data) { return User.findByIdAndUpdate(id, data, { new: true }); },
  deleteById(id) { return User.findByIdAndDelete(id); },
  
  findUserByEmail(data){
    try {
      return User.findOne({ email: data.email });
    } catch (error) {
      throw new Error('Error finding user by email: ' + error.message);
    }
  }
};
