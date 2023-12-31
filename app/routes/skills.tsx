import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';
import { IconList } from '#app/features/icons/components/icon-list.tsx';
import { prisma } from '#app/utils/db.server.ts';

export const loader = async () => {
    const technologies = await prisma.technology.findMany({
        select: {
            id: true,
            name: true,
            icons: true,
        },
        orderBy: {
            order: 'asc',
        },
    });

    return json({ technologies });
};

const skillsVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

export default function Skills() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <motion.div
                className="relative z-10 mb-5 w-fit text-5xl"
                layoutId="skills"
            >
                Skills
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
            <div className="flex flex-col items-center justify-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                    className="flex max-w-3xl flex-wrap items-center justify-center gap-5"
                >
                    {data.technologies.map((technology) => (
                        <motion.div
                            variants={skillsVariants}
                            key={technology.id}
                            className="flex items-center gap-2 rounded-md bg-card px-3 py-2 text-xl"
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
                            <span className="text-center">
                                {technology.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
