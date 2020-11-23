'use strict';
const bcrypt = require('bcrypt')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate:{
        len:{
          args: [1,99],
          msg: 'name must be between 1 and 99 characters'
        }
      }
    },
    email: {
      type:DataTypes.STRING,
      validate:{
        isEmail: {
          msg: 'invalid email'
        }
      }
    },
    password: {
      type:DataTypes.STRING,
      validate:{
        len:{
          args: [12,99],
          msg: 'Password must be between 12 and 99 characters'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'user',
  });

  user.addHook('beforeCreate', function(pendingUser){
    //bcrypt hash a password for us
    let hash = bcrypt.hashSync(pendingUser.password, 12)
    // set password to eqaul hash
    pendingUser.password = hash
  })
  user.prototype.validPassword = function(passwordTyped) {
    let correctPassword = bcrypt.compareSync(passwordTyped,this.password)
    return correctPassword
  }
  //remove the password before it gets serialized
  user.prototype.toJSON = function(){
    let userData = this.get()
    delete userData.password;
    return userData
  }
  
  return user;
}
