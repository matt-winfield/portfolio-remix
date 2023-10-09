import { type V2_MetaDescriptor } from '@remix-run/node';
import { type V2_MetaFunction, useLoaderData } from '@remix-run/react';
import { redirect } from '@remix-run/router';
import {
    json,
    type DataFunctionArgs,
    type LinksFunction,
} from '@remix-run/server-runtime';
import { format } from 'date-fns';
import { FormattedArticle } from '#app/features/blog/components/formatted-article.tsx';
import { TagList } from '#app/features/blog/components/tag-list.tsx';
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
            updatedAt: true,
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

    return json({ article, url: request.url });
};

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
    if (!data) return;
    const url = new URL(data.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    const urlWithoutQuery = `${baseUrl}${url.pathname}`;

    const metadata: V2_MetaDescriptor[] = [
        { title: `${data.article.title} | Matt Winfield` },
        {
            property: 'og:title',
            content: `${data.article.title}`,
        },
        {
            property: 'og:description',
            content: data.article.description ?? 'An article by Matt Winfield',
        },
    ];
    if (data.article.images.length > 0) {
        metadata.push({
            property: 'og:image',
            content: `${baseUrl}/resources/images/${data.article.images[0].id}`,
        });
    }
    metadata.push(
        {
            property: 'og:url',
            content: urlWithoutQuery,
        },
        {
            property: 'og:type',
            content: 'article',
        },
        {
            property: 'article:published_time',
            content: data.article.publishedAt,
        },
        {
            property: 'article:modified_time',
            content: data.article.updatedAt,
        },
        {
            property: 'article:author',
            content: 'Matt Winfield',
        },
        {
            property: 'article:section',
            content: 'Technology',
        },
        {
            property: 'article:tag',
            content: data.article.tags?.split(' ') ?? [],
        },
    );
    return metadata;
};

const wordsPerMinute = 200;

export default function Article() {
    const data = useLoaderData<typeof loader>();

    const publicationDate = data.article.publishedAt
        ? format(new Date(data.article.publishedAt), 'd MMM yyyy')
        : null;
    const updateDate = format(new Date(data.article.updatedAt), 'd MMM yyyy');

    const wordCount = data.article.content.split(/\s+/).length;
    const minutesToRead = Math.ceil(wordCount / wordsPerMinute);

    return (
        <div className="container">
            <div className="mb-2 flex flex-col items-center gap-3">
                <h1 className="text-center text-5xl">{data.article.title}</h1>
                <div className="flex items-center justify-center">
                    {data.article.tags && <TagList tags={data.article.tags} />}
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-full sm:w-4/5">
                    <div className="mb-3 text-sm text-muted-foreground">
                        {publicationDate && (
                            <div>Published {publicationDate}</div>
                        )}
                        {publicationDate !== updateDate && (
                            <div>Updated {updateDate}</div>
                        )}
                        <div>{minutesToRead} minute read</div>
                    </div>
                    {data.article.images.length > 0 && (
                        <div className="my-3">
                            <img
                                className="max-h-[50vh] w-full object-contain"
                                src={`/resources/images/${data.article.images[0].id}`}
                                alt={
                                    data.article.images[0].altText ??
                                    'Article cover image'
                                }
                            />
                        </div>
                    )}
                    <FormattedArticle
                        className="rich-text text-lg"
                        html={data.article.content}
                    />
                </div>
            </div>
        </div>
    );
}
