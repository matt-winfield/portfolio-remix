import { Link } from '@remix-run/react';
import { format } from 'date-fns';
import {
    type FragmentType,
    useFragment,
} from '#app/graphql/__generated__/fragment-masking.ts';
import { gql } from '#app/graphql/__generated__/gql.ts';
import { TagList } from './tag-list.tsx';

export const ArticleSummaryFragment = gql(`#graphql
    fragment ArticleSummaryFragment on Article {
        id
        slug
        title
        description
        publishedAt
        tags
    }
`);

type ArticleSummaryProps = {
    article: FragmentType<typeof ArticleSummaryFragment>;
};

export const ArticleSummary = ({ article }: ArticleSummaryProps) => {
    const articleData = useFragment(ArticleSummaryFragment, article);
    return (
        <Link
            to={`/blog/${articleData.slug ?? articleData.id}`}
            className="group rounded bg-card px-5 py-3"
        >
            <div className="flex flex-col sm:flex-row">
                <div className="flex-1 text-xl transition-colors group-hover:text-accent-foreground">
                    {articleData.title}
                </div>
                {articleData.publishedAt && (
                    <div className="text-sm text-muted-foreground">
                        {format(
                            new Date(articleData.publishedAt),
                            'd MMM yyyy',
                        )}
                    </div>
                )}
            </div>
            {articleData.description && (
                <div className="text-muted-foreground">
                    {articleData.description}
                </div>
            )}
            {articleData.tags && <TagList tags={articleData.tags} />}
        </Link>
    );
};
