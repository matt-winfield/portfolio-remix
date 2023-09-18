import { ExperienceDateDisplay } from '#app/features/experience/components/experience-date-display.tsx';
import { prisma } from '#app/utils/db.server.ts';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';

export const loader = async () => {
    const experience = await prisma.experience.findMany({
        select: {
            id: true,
            title: true,
            company: true,
            startDate: true,
            endDate: true,
        },
        orderBy: {
            endDate: {
                sort: 'desc',
                nulls: 'first',
            },
        },
    });

    return json({ experience });
};

const experienceVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

export default function Experience() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <motion.div
                className="relative z-10 mb-5 w-fit text-5xl"
                layoutId="experience"
            >
                Experience
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>

            <div className="flex flex-col items-center justify-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                    className="flex w-fit flex-col gap-5"
                >
                    {data.experience.map((experience) => (
                        <motion.div
                            variants={experienceVariants}
                            key={experience.id}
                            className="rounded-md bg-card px-3 py-2 text-xl"
                        >
                            <div>{experience.title}</div>
                            <div className="flex flex-col text-sm text-muted-foreground">
                                <span>{experience.company}</span>
                                <ExperienceDateDisplay
                                    startDate={experience.startDate}
                                    endDate={experience.endDate}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
