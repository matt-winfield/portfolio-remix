import { Button } from '#app/components/ui/button.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';

export const loader = async () => {
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            name: true,
            codeUrl: true,
            demoUrl: true,
            images: {
                select: {
                    id: true,
                },
            },
        },
    });

    return json({ projects });
};

export default function Projects() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <motion.div className="relative w-fit text-5xl" layoutId="projects">
                Projects
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {data.projects.map((project) => (
                    <div
                        key={project.id}
                        className="flex flex-col items-center"
                    >
                        <div className="my-2 text-3xl">{project.name}</div>
                        <div className="my-1 px-2">
                            <Button className="text-xl" asChild>
                                <Link to={`/projects/${project.id}`}>
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
                ))}
            </motion.div>
        </div>
    );
}
