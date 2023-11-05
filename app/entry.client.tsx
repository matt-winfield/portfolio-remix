import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { RemixBrowser } from '@remix-run/react';
import { startTransition, useMemo } from 'react';
import { hydrateRoot } from 'react-dom/client';

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
    import('./utils/monitoring.client.tsx').then(({ init }) => init());
}

const App = () => {
    const client = useMemo(() => {
        return new ApolloClient({
            uri: '/api/graphql',
            cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
        });
    }, []);

    return (
        <ApolloProvider client={client}>
            <RemixBrowser />
        </ApolloProvider>
    );
};

startTransition(() => {
    hydrateRoot(document, <App />);
});
