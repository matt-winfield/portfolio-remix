import {
    json,
    type DataFunctionArgs,
    type V2_MetaFunction,
} from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { DateTime } from 'luxon';
import { blogEnabled } from '#app/features/blog/blog-config.tsx';
import { TagList } from '#app/features/blog/components/tag-list.tsx';
import { getUser } from '#app/utils/auth.server.ts';
import { prisma } from '#app/utils/db.server.ts';

export const loader = async ({ request }: DataFunctionArgs) => {
    if (!blogEnabled) {
        throw new Response('Not Found', { status: 404 });
    }

    const user = await getUser(request);
    const showDrafts = user?.roles?.some((role) => role.name == 'admin');

    const articles = await prisma.article.findMany({
        where: {
            draft: showDrafts ? undefined : false,
        },
        select: {
            id: true,
            title: true,
            images: true,
            slug: true,
            publishedAt: true,
            description: true,
            tags: true,
        },
        orderBy: {
            publishedAt: 'desc',
        },
    });

    return json({ articles });
};

export const meta: V2_MetaFunction<typeof loader> = () => {
    return [
        {
            title: 'Matt Winfield - Blog',
            description: "Matt Winfield's blog",
        },
    ];
};

export default function Blog() {
    const data = useLoaderData<typeof loader>();
    const startOfCareer = new Date('2018-09-03');
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
                {data.articles.map((article) => (
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
                                    {new Date(
                                        article.publishedAt,
                                    ).toLocaleDateString()}
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
            </div>
        </div>
    );
}
