import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { Button } from '#app/components/ui/button.tsx';
import App from '#app/features/cms/components/admin-page.tsx';
import richtextStylesUrl from '#app/styles/richtext.css';
import { requireUserWithRole } from '#app/utils/permissions.ts';
import { Form, type V2_MetaFunction } from '@remix-run/react';
import {
    type DataFunctionArgs,
    type LinksFunction,
} from '@remix-run/server-runtime';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: richtextStylesUrl },
];

export const loader = async ({ request }: DataFunctionArgs) => {
    await requireUserWithRole(request, 'admin');
    return null;
};

export const meta: V2_MetaFunction = () => {
    return [
        {
            title: 'CMS | Matt Winfield',
        },
    ];
};

export default App;

export function ErrorBoundary() {
    return (
        <GeneralErrorBoundary
            statusHandlers={{
                403: () => {
                    return (
                        <div>
                            <h1>Forbidden</h1>
                            <p>
                                You don't have permission to access this page.
                            </p>
                            <Form method="post" action="/logout">
                                <Button type="submit">Log out</Button>
                            </Form>
                        </div>
                    );
                },
            }}
        />
    );
}
