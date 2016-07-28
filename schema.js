const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require('graphql');

const {
  nodeDefinitions,
  globalIdField,
  fromGlobalId,
  connectionDefinitions,
  connectionArgs,
  connectionFromPromisedArray
} = require('graphql-relay');

const db = require('./database');

const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId, { loaders }) => {
    const { type, id } = fromGlobalId(globalId);
    return type === 'person'? loaders.usersByIds.load(id) : null;
  },
  (obj) => {
    return obj.type === 'Person'? personType : null;
  }
);

const personType = new GraphQLObjectType({
  name: 'Person',
  interfaces: [nodeInterface],

  fields: () => {
    return {
      id: globalIdField("Person"),
      firstName: {
        type: GraphQLString,
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
        resolve: (obj, args, { loaders }) => loaders.usersByIds.load(obj.spouseId)
      }
    }
  }
});

const { connectionType:  personConnectionType } = connectionDefinitions({ name: 'Person', nodeType: personType });

const queryType = new GraphQLObjectType({
  name: 'RootQuery',

  fields: {
    node: nodeField,

    personConnection: {
      type: personConnectionType, // { first: ..., after: ... }
      args: connectionArgs,
      resolve: (obj, args, { pool }) => connectionFromPromisedArray(db(pool).getAllUsers(), args)
    },

    people: {
      type: new GraphQLList(personType),
      resolve: (obj, args, { pool }) => db(pool).getAllUsers()
    },
    person: {
      type: personType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (obj, args, { loaders }) => loaders.usersByIds.load(args.id)
    }
  }
});

const mySchema = new GraphQLSchema({
  query: queryType
});

module.exports = mySchema;
