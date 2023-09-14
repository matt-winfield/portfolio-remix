import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { Button } from '#app/components/ui/button.tsx';
import App from '#app/features/cms/components/admin-page.tsx';
import { requireUserWithRole } from '#app/utils/permissions.ts';
import { Form } from '@remix-run/react';
import { type DataFunctionArgs } from '@remix-run/server-runtime';

export const loader = async ({ request }: DataFunctionArgs) => {
    await requireUserWithRole(request, 'admin');
    return null;
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
