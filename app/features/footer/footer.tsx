import { Form, Link, useSubmit } from '@remix-run/react';
import { useRef } from 'react';
import { Button } from '#app/components/ui/button.tsx';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuTrigger,
} from '#app/components/ui/dropdown-menu.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import { getUserImgSrc } from '#app/utils/misc.tsx';
import { type Theme } from '#app/utils/theme.server.ts';
import { type useOptionalUser, useUser } from '#app/utils/user.ts';
import { ThemeSwitch } from '../theme-switch/theme-switch.tsx';

type FooterProps = {
    theme: Theme | null;
    user: ReturnType<typeof useOptionalUser>;
};

export const Footer = ({ theme, user }: FooterProps) => {
    return (
        <div className="mb-2 mt-10 flex flex-col items-center justify-between gap-2 px-5 text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-5">
                <Link
                    to="/privacy-policy"
                    className="transition-colors hover:text-accent-foreground"
                >
                    Privacy Policy
                </Link>
                <Link
                    to="/settings/analytics"
                    className="transition-colors hover:text-accent-foreground"
                >
                    Analytics
                </Link>
            </div>
            <div className="flex items-center gap-5">
                <ThemeSwitch userPreference={theme} />
                {user ? <UserDropdown /> : <Link to="/login">Log In</Link>}
            </div>
        </div>
    );
};

function UserDropdown() {
    const user = useUser();
    const submit = useSubmit();
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button asChild variant="secondary">
                    <Link
                        to={`/users/${user.username}`}
                        // this is for progressive enhancement
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-2"
                    >
                        <img
                            className="h-8 w-8 rounded-full object-cover"
                            alt={user.name ?? user.username}
                            src={getUserImgSrc(user.image?.id)}
                        />
                        <span className="text-body-sm font-bold">
                            {user.name ?? user.username}
                        </span>
                    </Link>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent sideOffset={8} align="start">
                    {user.roles.some((role) => role.name === 'admin') && (
                        <DropdownMenuItem asChild>
                            <Link to="/admin/cms">
                                <Icon className="text-body-md" name="plus">
                                    Admin
                                </Icon>
                            </Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                        <Link prefetch="intent" to={`/users/${user.username}`}>
                            <Icon className="text-body-md" name="avatar">
                                Profile
                            </Icon>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        asChild
                        // this prevents the menu from closing before the form submission is completed
                        onSelect={(event) => {
                            event.preventDefault();
                            submit(formRef.current);
                        }}
                    >
                        <Form action="/logout" method="POST" ref={formRef}>
                            <Icon className="text-body-md" name="exit">
                                <button type="submit">Logout</button>
                            </Icon>
                        </Form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
}
