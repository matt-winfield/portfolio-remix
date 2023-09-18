import { motion } from 'framer-motion';

export default function Qualifications() {
    return (
        <div className="container">
            <motion.div
                className="relative mb-5 w-fit text-5xl"
                layoutId="qualifications"
            >
                Qualifications
                <motion.div className="absolute -bottom-1 h-[2px] w-full bg-accent-foreground" />
            </motion.div>
        </div>
    );
}
