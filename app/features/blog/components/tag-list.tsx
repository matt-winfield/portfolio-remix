import { cn } from '#app/utils/misc.tsx';

type TagListProps = {
    tags: string;
    className?: string;
};

export const TagList = ({ tags, className }: TagListProps) => {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {tags.split(' ').map((tag) => (
                <div key={tag} className="rounded bg-card-foreground px-2 py-1">
                    {tag}
                </div>
            ))}
        </div>
    );
};
