'use strict';

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID
} = require('graphql');

const person = {
  id: 1,
  first_name: 'Derek',
  last_name: 'Ahn',
  email: 'derek@webmocha.com',
  spouse_id: 8
};

const personType = new GraphQLObjectType({
  name: 'Person',

  fields: {
    id: {
      type: GraphQLID
    },
    firstName: {
      type: GraphQLString,
      resolve: obj => obj.first_name
    },
    lastName: {
      type: GraphQLString,
      resolve: obj => obj.last_name
    },
    email: {
      type: GraphQLString
    },
    spouseId: {
      type: GraphQLInt,
      resolve: obj => obj.spouse_id
    }
  }
});

const queryType = new GraphQLObjectType({
  name: 'RootQuery',

  fields: {
    person: {
      type: personType,
      resolve: () => person
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType,
});

module.exports = mySchema;
