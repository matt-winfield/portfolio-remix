import { NavLink } from '@remix-run/react';
import { motion } from 'framer-motion';
import { type ComponentProps } from 'react';

const StyledNavLink = ({
    children,
    ...props
}: ComponentProps<typeof NavLink>) => (
    <NavLink className="relative px-4 py-2" {...props}>
        {({ isActive }) => (
            <>
                {children}
                {isActive && (
                    <motion.div
                        layoutId="nav-highlight"
                        style={{ borderRadius: 9999 }}
                        className="absolute left-0 top-0 z-10 h-full w-full bg-primary mix-blend-difference"
                    />
                )}
            </>
        )}
    </NavLink>
);

export const NavMenu = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex w-full flex-wrap items-center justify-center gap-3 sm:gap-5"
        >
            <StyledNavLink to="/">Home</StyledNavLink>
            <StyledNavLink to="/projects">Projects</StyledNavLink>
            <StyledNavLink to="/skills">Skills</StyledNavLink>
            <StyledNavLink to="/experience">Experience</StyledNavLink>
            <StyledNavLink to="/qualifications">Qualifications</StyledNavLink>
        </motion.div>
    );
};
