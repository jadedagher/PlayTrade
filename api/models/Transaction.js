/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  schema: true, // important à mettre "securité"


  attributes: {

    authorId: {
      type: "string",
      required: true
    },

    type: {
      type: "string",
      required: true

    },

    date: {
      type: 'string',
      required: true
    },

    symbol: {
      type: 'string',
      required: true
    },

    price: {
      type: 'float',
      required: true
    },


    volume: {
      type: 'float',
      required: true
    },

    total: {
      type: 'string',
      required: true
    },

    profit: {
      type: 'string',
      defaultsTo: "_"
    },

    perte: {
      type: 'string',
      defaultsTo: "_"
    }

  }
};
