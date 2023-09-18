import { prisma } from '#app/utils/db.server.ts';
import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';

export const loader = async () => {
    const qualifications = await prisma.qualification.findMany({
        select: {
            id: true,
            title: true,
            grade: true,
            institution: true,
        },
        orderBy: {
            date: 'desc',
        },
    });

    return json({ qualifications });
};

const qualificationsVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

export default function Qualifications() {
    const data = useLoaderData<typeof loader>();

    return (
        <div className="container">
            <motion.div
                className="relative z-10 mb-5 w-fit text-5xl"
                layoutId="qualifications"
            >
                Qualifications
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
            <div className="flex flex-col items-center justify-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1 }}
                    className="flex w-fit flex-col gap-5"
                >
                    {data.qualifications.map((qualification) => (
                        <motion.div
                            variants={qualificationsVariants}
                            key={qualification.id}
                            className="rounded-md bg-card px-3 py-2 text-xl"
                        >
                            <div>{qualification.title}</div>
                            <div className="text-sm text-muted-foreground">
                                {qualification.grade} -{' '}
                                {qualification.institution}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
