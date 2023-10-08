import { useLoaderData } from '@remix-run/react';
import { redirect } from '@remix-run/router';
import {
    json,
    type DataFunctionArgs,
    type LinksFunction,
} from '@remix-run/server-runtime';
import { HtmlWithCodeBlock } from '#app/features/code-block/html-with-code-block.tsx';
import richtextStylesUrl from '#app/styles/richtext.css';
import syntaxHighlightingStylesUrl from '#app/styles/syntax-highlighting.css';
import { getUser } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';
import { invariantResponse } from '#app/utils/misc.tsx';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: richtextStylesUrl },
    { rel: 'stylesheet', href: syntaxHighlightingStylesUrl },
];

export const loader = async ({ request, params }: DataFunctionArgs) => {
    invariantResponse(params.articleId, 'Missing articleId');

    const { articleId } = params;

    const article = await prisma.article.findFirst({
        where: {
            OR: [{ id: articleId }, { slug: articleId }],
        },
        select: {
            id: true,
            title: true,
            content: true,
            images: true,
            slug: true,
            draft: true,
            publishedAt: true,
            description: true,
            tags: true,
        },
    });

    invariantResponse(article, 'Article not found');

    if (article.draft) {
        const user = await getUser(request);
        const showDrafts = user?.roles?.some((role) => role.name == 'admin');
        if (!showDrafts) {
            throw new Response('Not Found', { status: 404 });
        }
    }

    if (article.id == articleId && article.slug !== null) {
        throw redirect(`/blog/${article.slug}`);
    }

    return json({ article });
};

export default function Article() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <h1 className="mb-3 text-center text-5xl">{data.article.title}</h1>
            <div className="flex flex-col items-center">
                <div className="w-4/5">
                    <HtmlWithCodeBlock
                        className="rich-text text-lg"
                        html={data.article.content}
                    />
                </div>
            </div>
        </div>
    );
}
