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

const humps = require('humps');


const person = humps.camelizeKeys({
  id: 1,
  first_name: 'Derek',
  last_name: 'Ahn',
  email: 'derek@webmocha.com',
  spouse_id: 8
});

const personType = new GraphQLObjectType({
  name: 'Person',

  fields: {
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
    spouseId: {
      type: GraphQLInt
    }
  }
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

      resolve: (obj, args, { pool }) => pool
                    .query('select * from spouses where id = $1', [args.id])
                    .then(result => humps.camelizeKeys(result.rows[0]))
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType,
});

module.exports = mySchema;
