import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { motion } from 'framer-motion';
import { DateTime } from 'luxon';
import { promiseHash } from 'remix-utils';
import { ExperienceDateDisplay } from '#app/features/experience/components/experience-date-display.tsx';
import { startOfCareer } from '#app/features/experience/constants.ts';
import { prisma } from '#app/utils/db.server.ts';

export const loader = async () => {
    const experience = prisma.experience.findMany({
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

    const qualifications = prisma.qualification.findMany({
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

    return json(
        await promiseHash({
            experience,
            qualifications,
        }),
    );
};

const animationVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
};

export default function About() {
    const { experience, qualifications } = useLoaderData<typeof loader>();

    const now = new Date();
    const experienceDuration = DateTime.fromJSDate(now).diff(
        DateTime.fromJSDate(startOfCareer),
        'years',
    );
    const yearsOfExperience = Math.floor(experienceDuration.years);

    return (
        <div className="container">
            <motion.div
                className="relative z-10 mb-5 w-fit text-5xl"
                layoutId="about-title"
            >
                About
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
            <p className="mx-auto mb-5 mt-2 max-w-3xl text-center text-2xl text-muted-foreground sm:px-5">
                My name is Matt Winfield. I'm a software developer with over{' '}
                {yearsOfExperience} years of experience. I'm passionate about
                building high quality software, learning new technologies and
                helping others.
            </p>
            <div className="flex flex-col justify-center gap-10 sm:flex-row sm:items-start">
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-2 text-2xl">Experience</div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.1 }}
                        className="flex w-fit flex-col gap-5"
                    >
                        {experience.map((experience) => (
                            <motion.div
                                variants={animationVariants}
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
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-2 text-2xl">Qualifications</div>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.1 }}
                        className="flex w-fit flex-col gap-5"
                    >
                        {qualifications.map((qualification) => (
                            <motion.div
                                variants={animationVariants}
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
        </div>
    );
}
