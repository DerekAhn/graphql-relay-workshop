'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID

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
      resolve: (obj, args, { pool }) => pool
                    .query('select * from spouses where id = 1', [])
                    .then(result => humps.camelizeKeys(result.rows[0]))
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType,
});

module.exports = mySchema;
