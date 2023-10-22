import {
    json,
    type DataFunctionArgs,
    type V2_MetaFunction,
} from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import { format } from 'date-fns';
import { DateTime } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { useIntersection } from 'react-use';
import { Spinner } from '#app/components/spinner.tsx';
import { blogEnabled } from '#app/features/blog/blog-config.tsx';
import { TagList } from '#app/features/blog/components/tag-list.tsx';
import { startOfCareer } from '#app/features/experience/constants.ts';
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

export default function Blog() {
    const initialData = useLoaderData<typeof loader>();
    const [articles, setArticles] = useState(initialData.articles);
    const [page, setPage] = useState(2); // Start at page 2 because we've already loaded page 1
    const [reachedEnd, setReachedEnd] = useState(false);
    const fetcher = useFetcher<typeof loader>();

    const intersectionRef = useRef(null);
    const intersection = useIntersection(intersectionRef, {
        root: null,
        rootMargin: '100px', // Start fetching slightly before reaching end of screen
    });

    useEffect(() => {
        if (
            intersection &&
            intersection.isIntersecting &&
            fetcher.state === 'idle' &&
            !reachedEnd
        ) {
            fetcher.load(`/blog?page=${page}`);
            setPage((page) => page + 1);
        }
    }, [intersection, fetcher, page, reachedEnd]);

    useEffect(() => {
        const newData = fetcher.data;
        if (!newData) return;

        if (newData.articles.length === 0) {
            setReachedEnd(true);
            return;
        }

        setArticles((articles) => [...articles, ...newData.articles]);
    }, [fetcher.data]);

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
                {articles.map((article) => (
                    <Link
                        to={`/blog/${article.slug ?? article.id}`}
                        key={article.id}
                        className="group rounded bg-card px-5 py-3"
                    >
                        <div className="flex flex-col sm:flex-row">
                            <div className="flex-1 text-xl transition-colors group-hover:text-accent-foreground">
                                {article.title}
                            </div>
                            {article.publishedAt && (
                                <div className="text-sm text-muted-foreground">
                                    {format(
                                        new Date(article.publishedAt),
                                        'd MMM yyyy',
                                    )}
                                </div>
                            )}
                        </div>
                        {article.description && (
                            <div className="text-muted-foreground">
                                {article.description}
                            </div>
                        )}
                        {article.tags && <TagList tags={article.tags} />}
                    </Link>
                ))}
                <div ref={intersectionRef} />
                <div className="flex justify-center">
                    <Spinner
                        showSpinner={fetcher.state !== 'idle'}
                        className="static"
                    />
                </div>
            </div>
        </div>
    );
}
