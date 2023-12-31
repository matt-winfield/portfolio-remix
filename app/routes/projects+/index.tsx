import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';
import { Button } from '#app/components/ui/button.tsx';
import { prisma } from '#app/utils/db.server.ts';

const fallbackImagePath = '/img/placeholder.jpg';

export const loader = async () => {
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            slug: true,
            name: true,
            codeUrl: true,
            demoUrl: true,
            images: {
                select: {
                    id: true,
                    altText: true,
                },
            },
        },
        orderBy: {
            order: 'asc',
        },
    });

    return json({ projects });
};

export default function Projects() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <motion.div
                className="relative z-10 mb-5 w-fit text-5xl"
                layoutId="projects"
            >
                Projects
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-5"
            >
                {data.projects.map((project) => (
                    <div
                        key={project.id}
                        className="group relative flex w-fit flex-col items-center rounded-md bg-card px-3 py-2 transition hover:scale-105"
                    >
                        <motion.div
                            className="my-2 w-fit text-3xl transition-colors group-hover:text-accent-foreground"
                            layoutId={`${project.id}-title`}
                        >
                            {project.name}
                        </motion.div>
                        <div className="my-1 h-60">
                            <img
                                className="max-h-full max-w-full"
                                src={
                                    project.images.length > 0
                                        ? `/resources/images/${project.images[0].id}`
                                        : fallbackImagePath
                                }
                                alt={project.images[0]?.altText ?? project.name}
                            />
                        </div>
                        <div className="absolute bottom-0 flex w-full flex-col items-center bg-background/90 transition-opacity group-hover:opacity-100 sm:opacity-80">
                            <div className="my-1 px-2">
                                <Button className="text-xl" asChild>
                                    <Link
                                        to={`/projects/${
                                            project.slug
                                                ? encodeURIComponent(
                                                      project.slug,
                                                  )
                                                : project.id
                                        }`}
                                    >
                                        Details
                                    </Link>
                                </Button>
                            </div>
                            <div className="my-1 flex flex-row gap-2 px-2">
                                {project.codeUrl && (
                                    <Button asChild>
                                        <a
                                            href={project.codeUrl}
                                            className="text-xl"
                                        >
                                            Code
                                        </a>
                                    </Button>
                                )}
                                {project.demoUrl && (
                                    <Button asChild>
                                        <a
                                            href={project.demoUrl}
                                            className="text-xl"
                                        >
                                            Demo
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
