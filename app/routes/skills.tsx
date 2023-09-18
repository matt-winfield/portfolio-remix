import { prisma } from '#app/utils/db.server.ts';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';

export const loader = async () => {
    const technologies = await prisma.technology.findMany({
        select: {
            id: true,
            name: true,
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
                className="relative mb-5 w-fit text-5xl"
                layoutId="skills"
            >
                Skills
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
            <motion.div
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.1 }}
                className="flex flex-wrap items-center justify-center gap-2"
            >
                {data.technologies.map((technology) => (
                    <motion.div
                        variants={skillsVariants}
                        key={technology.id}
                        className="rounded-md bg-card px-3 py-2 text-xl"
                    >
                        {technology.name}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
