import {
    type LoaderFunction,
    type ActionFunction,
    json,
} from '@remix-run/server-runtime';
import { graphql } from 'graphql';
import { graphqlSchema } from '#app/graphql/graphql.server.ts';
import { getUser } from '#app/utils/auth.server.ts';
import { invariantResponse } from '#app/utils/misc.tsx';

export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    const params = new URL(request.url).searchParams;

    const query = params.get('query');
    const variablesString = params.get('variables');

    invariantResponse(query, 'Missing query');
    const variables = variablesString
        ? (JSON.parse(variablesString) as Record<string, unknown>)
        : {};

    const result = await graphql({
        schema: graphqlSchema,
        source: query,
        variableValues: variables,
        contextValue: { user },
    });
    return json(result);
};

type GraphqlRequest = {
    query?: string;
    variables?: Record<string, unknown>;
    operationName?: string;
};

export const action: ActionFunction = async ({ request }) => {
    const user = await getUser(request);
    const {
        query,
        variables: variablesOriginal,
        operationName,
    } = (await request.json()) as GraphqlRequest;

    invariantResponse(query, 'Missing query');
    const variables = variablesOriginal ?? {};

    const result = await graphql({
        schema: graphqlSchema,
        source: query,
        variableValues: variables,
        operationName,
        contextValue: { user },
    });
    return json(result);
};
