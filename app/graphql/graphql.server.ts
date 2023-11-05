import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

export const graphqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: {
            hello: {
                type: GraphQLString,
                resolve: () => 'Hello World',
            },
        },
    }),
});
