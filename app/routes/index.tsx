import { type V2_MetaFunction } from '@remix-run/node';

export const meta: V2_MetaFunction = () => [{ title: 'Epic Notes' }];

export default function Index() {
    return (
        <main className="relative min-h-screen sm:flex sm:items-center sm:justify-center"></main>
    );
}
