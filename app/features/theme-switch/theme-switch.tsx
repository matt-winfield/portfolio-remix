import { useForm } from '@conform-to/react';
import { parse } from '@conform-to/zod';
import { useFetcher } from '@remix-run/react';
import { ErrorList } from '#app/components/forms.tsx';
import { Icon } from '#app/components/ui/icon.tsx';
import {
    ThemeFormSchema,
    type action,
    useOptimisticThemeMode,
} from '#app/root.tsx';
import { type Theme } from '#app/utils/theme.server.ts';

export const ThemeSwitch = ({
    userPreference,
}: {
    userPreference?: Theme | null;
}) => {
    const fetcher = useFetcher<typeof action>();

    const [form] = useForm({
        id: 'theme-switch',
        lastSubmission: fetcher.data?.submission,
        onValidate({ formData }) {
            return parse(formData, { schema: ThemeFormSchema });
        },
    });

    const optimisticMode = useOptimisticThemeMode();
    const mode = optimisticMode ?? userPreference ?? 'dark';
    const nextMode = mode === 'light' ? 'dark' : 'light';
    const modeLabel = {
        light: (
            <Icon name="sun">
                <span className="sr-only">Light</span>
            </Icon>
        ),
        dark: (
            <Icon name="moon">
                <span className="sr-only">Dark</span>
            </Icon>
        ),
    };

    return (
        <fetcher.Form method="POST" {...form.props}>
            <input type="hidden" name="theme" value={nextMode} />
            <div className="flex gap-2">
                <button
                    name="intent"
                    value="update-theme"
                    type="submit"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center transition-colors hover:text-accent-foreground"
                >
                    {modeLabel[mode]}
                </button>
            </div>
            <ErrorList errors={form.errors} id={form.errorId} />
        </fetcher.Form>
    );
};
