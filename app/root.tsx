import { parse } from '@conform-to/zod';
import { cssBundleHref } from '@remix-run/css-bundle';
import {
    json,
    type DataFunctionArgs,
    type HeadersFunction,
    type LinksFunction,
    type V2_MetaFunction,
} from '@remix-run/node';
import {
    Links,
    LiveReload,
    Meta,
    Scripts,
    ScrollRestoration,
    useFetchers,
    useLoaderData,
    useMatches,
    useOutlet,
} from '@remix-run/react';
import { withSentry } from '@sentry/remix';
import { z } from 'zod';
import { Confetti } from './components/confetti.tsx';
import { GeneralErrorBoundary } from './components/error-boundary.tsx';
import { EpicToaster } from './components/toaster.tsx';
import { href as iconsHref } from './components/ui/icon.tsx';
import { Footer } from './features/footer/footer.tsx';
import { NavMenu } from './features/nav-menu/components/nav-menu.tsx';
import { ThemeSwitch } from './features/theme-switch/theme-switch.tsx';
import fontStylestylesheetUrl from './styles/font.css';
import tailwindStylesheetUrl from './styles/tailwind.css';
import { authenticator, getUserId } from './utils/auth.server.ts';
import { ClientHintCheck, getHints, useHints } from './utils/client-hints.tsx';
import { getConfetti } from './utils/confetti.server.ts';
import { prisma } from './utils/db.server.ts';
import { getEnv } from './utils/env.server.ts';
import {
    cn,
    combineHeaders,
    getDomainUrl,
    invariantResponse,
} from './utils/misc.tsx';
import { useNonce } from './utils/nonce-provider.ts';
import { useRequestInfo } from './utils/request-info.ts';
import { getTheme, setTheme, type Theme } from './utils/theme.server.ts';
import { makeTimings, time } from './utils/timing.server.ts';
import { getToast } from './utils/toast.server.ts';
import { useOptionalUser } from './utils/user.ts';

export const links: LinksFunction = () => {
    return [
        // Preload svg sprite as a resource to avoid render blocking
        { rel: 'preload', href: iconsHref, as: 'image' },
        // Preload CSS as a resource to avoid render blocking
        { rel: 'preload', href: fontStylestylesheetUrl, as: 'style' },
        { rel: 'preload', href: tailwindStylesheetUrl, as: 'style' },
        cssBundleHref
            ? { rel: 'preload', href: cssBundleHref, as: 'style' }
            : null,
        { rel: 'mask-icon', href: '/favicons/mask-icon.svg' },
        {
            rel: 'alternate icon',
            type: 'image/png',
            href: '/favicons/favicon-32x32.png',
        },
        { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon.png' },
        {
            rel: 'manifest',
            href: '/site.webmanifest',
            crossOrigin: 'use-credentials',
        } as const, // necessary to make typescript happy
        //These should match the css preloads above to avoid css as render blocking resource
        { rel: 'icon', type: 'image/svg+xml', href: '/favicons/favicon.svg' },
        { rel: 'stylesheet', href: fontStylestylesheetUrl },
        { rel: 'stylesheet', href: tailwindStylesheetUrl },
        cssBundleHref ? { rel: 'stylesheet', href: cssBundleHref } : null,
    ].filter(Boolean);
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
    return [
        {
            title: data
                ? 'Matt Winfield | Digital Portfolio'
                : 'Error | Matt Winfield',
        },
        { name: 'description', content: `Your own captain's log` },
    ];
};

export async function loader({ request }: DataFunctionArgs) {
    const timings = makeTimings('root loader');
    const userId = await time(() => getUserId(request), {
        timings,
        type: 'getUserId',
        desc: 'getUserId in root',
    });

    const user = userId
        ? await time(
              () =>
                  prisma.user.findUniqueOrThrow({
                      select: {
                          id: true,
                          name: true,
                          username: true,
                          image: { select: { id: true } },
                          roles: {
                              select: {
                                  name: true,
                                  permissions: {
                                      select: {
                                          entity: true,
                                          action: true,
                                          access: true,
                                      },
                                  },
                              },
                          },
                      },
                      where: { id: userId },
                  }),
              { timings, type: 'find user', desc: 'find user in root' },
          )
        : null;
    if (userId && !user) {
        console.info('something weird happened');
        // something weird happened... The user is authenticated but we can't find
        // them in the database. Maybe they were deleted? Let's log them out.
        await authenticator.logout(request, { redirectTo: '/' });
    }
    const { toast, headers: toastHeaders } = await getToast(request);
    const { confettiId, headers: confettiHeaders } = getConfetti(request);

    return json(
        {
            user,
            requestInfo: {
                hints: getHints(request),
                origin: getDomainUrl(request),
                path: new URL(request.url).pathname,
                userPrefs: {
                    theme: getTheme(request),
                },
            },
            ENV: getEnv(),
            toast,
            confettiId,
        },
        {
            headers: combineHeaders(
                { 'Server-Timing': timings.toString() },
                toastHeaders,
                confettiHeaders,
            ),
        },
    );
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    const headers = {
        'Server-Timing': loaderHeaders.get('Server-Timing') ?? '',
    };
    return headers;
};

export const ThemeFormSchema = z.object({
    theme: z.enum(['system', 'light', 'dark']),
});

export async function action({ request }: DataFunctionArgs) {
    const formData = await request.formData();
    invariantResponse(
        formData.get('intent') === 'update-theme',
        'Invalid intent',
        { status: 400 },
    );
    const submission = parse(formData, {
        schema: ThemeFormSchema,
    });
    if (submission.intent !== 'submit') {
        return json({ status: 'success', submission } as const);
    }
    if (!submission.value) {
        return json({ status: 'error', submission } as const, { status: 400 });
    }
    const { theme } = submission.value;

    const responseInit = {
        headers: { 'set-cookie': setTheme(theme) },
    };
    return json({ success: true, submission }, responseInit);
}

function Document({
    children,
    nonce,
    theme = 'dark',
    env = {},
}: {
    children: React.ReactNode;
    nonce: string;
    theme?: Theme;
    env?: Record<string, string>;
}) {
    return (
        <html lang="en" className={`${theme} h-full overflow-x-hidden`}>
            <head>
                <ClientHintCheck nonce={nonce} />
                <Meta />
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1"
                />
                <script
                    defer
                    data-domain="matt-winfield.com"
                    src="https://plausible.io/js/script.outbound-links.js"
                ></script>
                <Links />
            </head>
            <body className="bg-background text-foreground">
                {children}
                <script
                    nonce={nonce}
                    dangerouslySetInnerHTML={{
                        __html: `window.ENV = ${JSON.stringify(env)}`,
                    }}
                />
                <ScrollRestoration nonce={nonce} />
                <Scripts nonce={nonce} />
                <LiveReload nonce={nonce} />
            </body>
        </html>
    );
}

function App() {
    const data = useLoaderData<typeof loader>();
    const nonce = useNonce();
    const user = useOptionalUser();
    const theme = useTheme();
    const matches = useMatches();
    const outlet = useOutlet();
    const isOnCmsPage = matches.find((m) => m.id === 'routes/admin_.cms.$');
    const isOnIndexPage = matches.find((m) => m.id === 'routes/index');

    return (
        <Document nonce={nonce} theme={theme} env={data.ENV}>
            <div className="flex min-h-screen flex-col justify-between">
                {!isOnCmsPage && (
                    <header
                        className={cn(
                            isOnIndexPage && 'fixed',
                            'z-10 flex w-screen items-center py-6',
                        )}
                    >
                        <nav
                            className={cn(
                                'flex flex-1 items-center justify-between',
                                isOnIndexPage && 'container',
                            )}
                        >
                            {isOnIndexPage && (
                                <ThemeSwitch
                                    userPreference={
                                        data.requestInfo.userPrefs.theme
                                    }
                                />
                            )}
                            <div className="mx-3 min-w-0 flex-1">
                                {!isOnIndexPage && <NavMenu />}
                            </div>
                            <div></div>
                        </nav>
                    </header>
                )}

                <div className="flex-1">{outlet}</div>
                {!isOnIndexPage && !isOnCmsPage && (
                    <Footer
                        user={user}
                        theme={data.requestInfo.userPrefs.theme}
                    />
                )}
            </div>
            <Confetti id={data.confettiId} />
            <EpicToaster toast={data.toast} />
        </Document>
    );
}
export default withSentry(App);

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
    const hints = useHints();
    const requestInfo = useRequestInfo();
    const optimisticMode = useOptimisticThemeMode();
    if (optimisticMode) {
        return optimisticMode === 'system' ? hints.theme : optimisticMode;
    }
    return requestInfo.userPrefs.theme ?? hints.theme;
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
    const fetchers = useFetchers();

    const themeFetcher = fetchers.find(
        (f) => f.formData?.get('intent') === 'update-theme',
    );

    if (themeFetcher && themeFetcher.formData) {
        const submission = parse(themeFetcher.formData, {
            schema: ThemeFormSchema,
        });
        return submission.value?.theme;
    }
}

export function ErrorBoundary() {
    // the nonce doesn't rely on the loader so we can access that
    const nonce = useNonce();

    // NOTE: you cannot use useLoaderData in an ErrorBoundary because the loader
    // likely failed to run so we have to do the best we can.
    // We could probably do better than this (it's possible the loader did run).
    // This would require a change in Remix.

    // Just make sure your root route never errors out and you'll always be able
    // to give the user a better UX.

    return (
        <Document nonce={nonce}>
            <GeneralErrorBoundary />
        </Document>
    );
}
