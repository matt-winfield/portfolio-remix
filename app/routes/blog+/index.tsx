import { useQuery } from '@apollo/client';
import { type V2_MetaFunction } from '@remix-run/node';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { useIntersection } from 'react-use';
import { Spinner } from '#app/components/spinner.tsx';
import { blogEnabled } from '#app/features/blog/blog-config.tsx';
import { ArticleSummary } from '#app/features/blog/components/article-summary.tsx';
import { startOfCareer } from '#app/features/experience/constants.ts';
import { gql } from '#app/graphql/__generated__/gql.ts';

export const loader = async () => {
    if (!blogEnabled) {
        throw new Response('Not Found', { status: 404 });
    }
    return null;
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
