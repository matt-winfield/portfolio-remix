import {
    ApolloClient,
    InMemoryCache,
    type QueryOptions,
    from,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getUser } from '#app/utils/auth.server.ts';
import { graphqlSchema } from './graphql.server.ts';
import { SchemaLink } from './schema-link.ts';
import { typePolicies } from './type-policies.ts';

export const loadQueries = async (
    request: Request,
    ...queries: QueryOptions[]
) => {
    const graphqlLink = new SchemaLink({
        schema: graphqlSchema,
        context: {
            user: await getUser(request),
        },
    });

    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            console.error('GraphQL Errors', graphQLErrors);
        }
        if (networkError) {
            console.error('GraphQL Network Error', networkError);
        }
    });

    const apolloClient = new ApolloClient({
        ssrMode: true,
        cache: new InMemoryCache({
            typePolicies,
        }),
        link: from([errorLink, graphqlLink]),
    });

    await Promise.all(queries.map((query) => apolloClient.query(query)));

    return apolloClient.extract();
};
