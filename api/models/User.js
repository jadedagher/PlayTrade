/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  schema: true, // important à mettre "securité"


  attributes: {

    firstname: {
      type: "string",
      required: true
    },

    lastname: {
      type: "string",
      required: true

    },

    pseudo: {
      type: "string",
      required: true,
      unique: true
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },

    admin: {
      type: 'boolean',
      defaultsTo: false
    },

    encryptedPassword: {
      type: 'string'
    },


    online: {
      type: "boolean",
      defaultsTo: false
    },

    wallet: {
      type: 'float',
      defaultsTo: 10000
    },

    team: {
      type: "string",
      defaultsTo: 'NoTeam'
    }

    //marche aussi bien avec le toJSON

    // toJSON: function(){
    //   var obj = this.toObject();
    //   delete obj.password;
    //   delete obj.confirmation;
    //   delete obj.encryptedPassword;
    //   delete obj._csrf;
    //   return obj;
    // }

  },



  //this is to make sure the password and the passwordconfirmation are the same before creating the user
  beforeCreate: function(values, next) {
    if (!values.password || values.password != values.confirmation) {
      return next({
        err: ["password doesn\'t match password confirmation"]
      });
    }

    //hash -> specifique a bcrypt (a voir absolument)
    //pour utliser bcrypt toujours faire require('brcypt').
    require('bcrypt').hash(values.password, 10, function passwordEncrypted(err, encryptedPassword) {
      if (err) return next(err);
      values.encryptedPassword = encryptedPassword;
      // values.online = true;
      next();
    });

  }



};
