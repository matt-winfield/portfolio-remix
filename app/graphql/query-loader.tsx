import {
    type DocumentNode,
    type TypedDocumentNode,
    useApolloClient,
    useQuery,
    type NormalizedCacheObject,
    type QueryHookOptions,
    type OperationVariables,
} from '@apollo/client';
import { type SerializeFrom } from '@remix-run/server-runtime';

export const usePreloadedQuery = <
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
>(
    graphql: SerializeFrom<NormalizedCacheObject>,
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: QueryHookOptions<TData, TVariables>,
) => {
    const apolloClient = useApolloClient();

    if (Object.keys(apolloClient.extract()).length === 0) {
        apolloClient.restore(graphql);
    }

    return useQuery(query, options);
};
