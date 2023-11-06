import { PassThrough } from 'stream';
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { Response, type HandleDocumentRequestFunction } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { getInstanceInfo } from 'litefs-js';
import { renderToPipeableStream } from 'react-dom/server';
import { typePolicies } from './graphql/type-policies.ts';
import { getEnv, init } from './utils/env.server.ts';
import { NonceProvider } from './utils/nonce-provider.ts';
import { makeTimings } from './utils/timing.server.ts';

const ABORT_DELAY = 5000;

init();
global.ENV = getEnv();

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
    import('./utils/monitoring.server.ts').then(({ init }) => init());
}

type DocRequestArgs = Parameters<HandleDocumentRequestFunction>;

export default async function handleRequest(...args: DocRequestArgs) {
    const [
        request,
        responseStatusCode,
        responseHeaders,
        remixContext,
        loadContext,
    ] = args;
    const { currentInstance, primaryInstance } = await getInstanceInfo();
    responseHeaders.set('fly-region', process.env.FLY_REGION ?? 'unknown');
    responseHeaders.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown');
    responseHeaders.set('fly-primary-instance', primaryInstance);
    responseHeaders.set('fly-instance', currentInstance);

    const callbackName = isbot(request.headers.get('user-agent'))
        ? 'onAllReady'
        : 'onShellReady';

    const nonce = String(loadContext.cspNonce) ?? undefined;

    const apolloClient = new ApolloClient({
        ssrMode: true,
        cache: new InMemoryCache({
            typePolicies,
        }),
        // link: new SchemaLink({
        //     schema: graphqlSchema,
        //     context: {
        //         user: await getUser(request),
        //     },
        // }),
        // TODO: figure out why SchemaLink doesn't work
        // SchemaLink seems to not fetch any data, so we have to do it via network
        link: new HttpLink({
            uri: 'http://localhost:3000/api/graphql',
            headers: {
                cookie: request.headers.get('cookie') ?? '',
            },
        }),
    });

    const App = (
        <NonceProvider value={nonce}>
            <ApolloProvider client={apolloClient}>
                <RemixServer context={remixContext} url={request.url} />
            </ApolloProvider>
        </NonceProvider>
    );

    return new Promise(async (resolve, reject) => {
        let didError = false;
        // NOTE: this timing will only include things that are rendered in the shell
        // and will not include suspended components and deferred loaders
        const timings = makeTimings('render', 'renderToPipeableStream');

        try {
            await getDataFromTree(App);
        } catch (e) {
            console.error('Error while getting Apollo data', e);
        }
        const apolloState = apolloClient.extract();

        const { pipe, abort } = renderToPipeableStream(
            <>
                {App}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__APOLLO_STATE__=${JSON.stringify(
                            apolloState,
                        ).replace(/</g, '\\u003c')}`, // The replace call escapes the < character to prevent cross-site scripting attacks that are possible via the presence of </script> in a string literal
                    }}
                />
            </>,
            {
                [callbackName]: () => {
                    const body = new PassThrough();
                    responseHeaders.set('Content-Type', 'text/html');
                    responseHeaders.append('Server-Timing', timings.toString());
                    resolve(
                        new Response(body, {
                            headers: responseHeaders,
                            status: didError ? 500 : responseStatusCode,
                        }),
                    );
                    pipe(body);
                },
                onShellError: (err: unknown) => {
                    reject(err);
                },
                onError: (error: unknown) => {
                    didError = true;

                    console.error(error);
                },
            },
        );

        setTimeout(abort, ABORT_DELAY);
    });
}

export async function handleDataRequest(response: Response) {
    const { currentInstance, primaryInstance } = await getInstanceInfo();
    response.headers.set('fly-region', process.env.FLY_REGION ?? 'unknown');
    response.headers.set('fly-app', process.env.FLY_APP_NAME ?? 'unknown');
    response.headers.set('fly-primary-instance', primaryInstance);
    response.headers.set('fly-instance', currentInstance);

    return response;
}
