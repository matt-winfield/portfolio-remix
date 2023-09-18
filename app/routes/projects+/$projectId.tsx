import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx';
import { Button } from '#app/components/ui/button.tsx';
import { IconList } from '#app/features/icons/components/icon-list.tsx';
import richtextStylesUrl from '#app/styles/richtext.css';
import { prisma } from '#app/utils/db.server.ts';
import { invariantResponse } from '#app/utils/misc.tsx';
import { useLoaderData } from '@remix-run/react';
import {
    json,
    type DataFunctionArgs,
    type LinksFunction,
} from '@remix-run/server-runtime';
import { motion } from 'framer-motion';

export const links: LinksFunction = () => [
    { rel: 'stylesheet', href: richtextStylesUrl },
];

export const loader = async ({ params }: DataFunctionArgs) => {
    const { projectId } = params;
    invariantResponse(projectId, 'Missing projectId');

    const project = await prisma.project.findUnique({
        where: {
            id: projectId,
        },
        select: {
            id: true,
            name: true,
            codeUrl: true,
            demoUrl: true,
            description: true,
            images: {
                select: {
                    id: true,
                    altText: true,
                },
            },
            technologies: {
                select: {
                    id: true,
                    name: true,
                    icons: true,
                },
            },
        },
    });

    invariantResponse(project, 'Project not found', { status: 404 });

    return json({ project });
};

export default function Project() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <motion.div
                className="z-10 mb-5 w-fit text-5xl"
                layoutId={`${data.project.id}-title`}
            >
                {data.project.name}
            </motion.div>
            {data.project.images.length > 0 && (
                <div className="my-5 flex h-52 flex-wrap items-center justify-center">
                    {data.project.images.map((image) => (
                        <img
                            key={image.id}
                            className="max-h-full max-w-full"
                            src={`/resources/images/${image.id}`}
                            alt={
                                image.altText ?? `Image of ${data.project.name}`
                            }
                        />
                    ))}
                </div>
            )}
            <div className="my-2 flex flex-wrap items-center justify-center gap-2">
                {data.project.technologies.map((technology) => (
                    <div
                        key={technology.id}
                        className="flex items-center justify-center gap-2 rounded-md bg-card px-3 py-2"
                    >
                        <span>
                            {technology.icons && (
                                <IconList
                                    icons={technology.icons}
                                    iconProps={{
                                        className: 'fill-accent-foreground',
                                    }}
                                />
                            )}
                        </span>
                        <span>{technology.name}</span>
                    </div>
                ))}
            </div>
            {data.project.description && (
                <div
                    className="rich-text my-2"
                    dangerouslySetInnerHTML={{
                        __html: data.project.description,
                    }}
                />
            )}
            <div className="my-2 flex flex-wrap items-center justify-center gap-2">
                {data.project.codeUrl && (
                    <Button asChild>
                        <a href={data.project.codeUrl}>Code</a>
                    </Button>
                )}
                {data.project.demoUrl && (
                    <Button asChild>
                        <a href={data.project.demoUrl}>Demo</a>
                    </Button>
                )}
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <GeneralErrorBoundary
            statusHandlers={{
                404: ({ params }) => (
                    <p>No project with the ID "{params.projectId}" exists</p>
                ),
            }}
        />
    );
}
