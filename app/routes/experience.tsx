import { motion } from 'framer-motion';

export default function Experience() {
    return (
        <div className="container">
            <motion.div
                className="relative z-10 mb-5 w-fit text-5xl"
                layoutId="experience"
            >
                Experience
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
        </div>
    );
}
