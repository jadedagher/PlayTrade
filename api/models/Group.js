/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  schema: true, // important à mettre "securité"


  attributes: {

    GroupName: {
      type: 'string',
      required: true
    },

    GroupWallet: {
      type: 'float',
      required: true

    }

    // GroupPass: {
    //   type: 'string',
    //   required: true
    // }



    // UserOnline: {
    //   type: "boolean",
    //   defaultsTo: false
    // },



  }
};
/**
 * Created by rebai on 09/05/2016.
 */
