import { useQuery } from '@apollo/client';
import {
    json,
    type DataFunctionArgs,
    type V2_MetaFunction,
} from '@remix-run/node';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { useIntersection } from 'react-use';
import { Spinner } from '#app/components/spinner.tsx';
import { blogEnabled } from '#app/features/blog/blog-config.tsx';
import { ArticleSummary } from '#app/features/blog/components/article-summary.tsx';
import { startOfCareer } from '#app/features/experience/constants.ts';
import { gql } from '#app/graphql/__generated__/gql.ts';
import { getUser } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';

export const loader = async ({ request }: DataFunctionArgs) => {
    if (!blogEnabled) {
        throw new Response('Not Found', { status: 404 });
    }

    const user = await getUser(request);
    const showDrafts = user?.roles?.some((role) => role.name == 'admin');

    const page = Number(new URL(request.url).searchParams.get('page')) || 1;
    const articlesPerPage = 20;

    const articles = await prisma.article.findMany({
        where: {
            draft: showDrafts ? undefined : false,
        },
        select: {
            id: true,
            title: true,
            images: {
                select: {
                    id: true,
                    altText: true,
                },
            },
            slug: true,
            publishedAt: true,
            description: true,
            tags: true,
        },
        orderBy: {
            publishedAt: 'desc',
        },
        skip: (page - 1) * articlesPerPage,
        take: articlesPerPage,
    });

    return json({ articles });
};

export const meta: V2_MetaFunction<typeof loader> = () => {
    return [
        {
            title: 'Blog | Matt Winfield',
            description: "Matt Winfield's blog",
        },
    ];
};

const ARTICLES_QUERY = gql(`#graphql
    query Articles($after: String, $limit: Int!) {
        viewer {
            articlesConnection(after: $after, limit: $limit) {
                edges {
                    node {
                        id
                        ...ArticleSummaryFragment
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }
`);

export default function Blog() {
    const intersectionRef = useRef(null);
    const intersection = useIntersection(intersectionRef, {
        root: null,
        rootMargin: '100px', // Start fetching slightly before reaching end of screen
    });

    const { data, fetchMore } = useQuery(ARTICLES_QUERY, {
        variables: {
            limit: 20,
        },
    });
    const [loadingMore, setLoadingMore] = useState(false);

    const pageInfo = data?.viewer.articlesConnection?.pageInfo;
    const edges = data?.viewer.articlesConnection?.edges ?? [];

    useEffect(() => {
        if (
            intersection &&
            intersection.isIntersecting &&
            pageInfo?.hasNextPage &&
            !loadingMore
        ) {
            setLoadingMore(true);
            fetchMore({
                variables: {
                    after: pageInfo?.endCursor,
                },
            }).then(() => {
                setLoadingMore(false);
            });
        }
    }, [intersection, fetchMore, pageInfo, loadingMore]);

    const now = new Date();
    const experienceDuration = DateTime.fromJSDate(now).diff(
        DateTime.fromJSDate(startOfCareer),
        'years',
    );
    const yearsOfExperience = Math.floor(experienceDuration.years);

    return (
        <div className="container flex flex-col items-center">
            <div className="flex w-full flex-col items-center justify-center gap-2">
                <h1 className="flex w-full flex-col gap-2 text-center text-5xl sm:flex-row sm:justify-center">
                    <span>Matt Winfield</span>
                    <span className="hidden sm:block"> - </span>
                    <span className="text-3xl text-muted-foreground sm:text-5xl sm:text-foreground">
                        Blog
                    </span>
                </h1>
                <p className="my-1 max-w-2xl text-center text-2xl text-muted-foreground">
                    I'm a software engineer with over {yearsOfExperience} years
                    of experience. I'm passionate about building high quality
                    software and always improving. This blog is where I share
                    the things I've learnt.
                </p>
            </div>
            <div className="my-3 flex w-full max-w-3xl flex-col gap-2">
                {edges.map((edge) => (
                    <ArticleSummary key={edge.node.id} article={edge.node} />
                ))}
                <div ref={intersectionRef} />
                <div className="flex justify-center">
                    <Spinner showSpinner={loadingMore} className="static" />
                </div>
            </div>
        </div>
    );
}
