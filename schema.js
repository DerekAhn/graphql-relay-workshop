'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull

} = require('graphql');

const db = require('./database');

const personType = new GraphQLObjectType({
  name: 'Person',

  fields: () => ({
    id: {
      type: GraphQLID
    },
    firstName: {
      type: GraphQLString
    },
    lastName: {
      type: GraphQLString
    },
    fullName: {
      type: GraphQLString,
      resolve: obj => `${obj.firstName} ${obj.lastName}`
    },
    email: {
      type: GraphQLString
    },
    spouse: {
      type: personType,
      resolve: (obj, args, { pool }) => db(pool).getUserById(obj.spouseId)
    }
  })
});

const queryType = new GraphQLObjectType({
  name: 'RootQuery',

  fields: {
    person: {
      type: personType,
      args:  {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },

      resolve: (obj, args, { pool }) => db(pool).getUserById(args.id)
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType,
});

module.exports = mySchema;
