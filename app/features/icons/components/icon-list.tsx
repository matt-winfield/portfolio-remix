import { Icon } from '#app/components/ui/icon.tsx';
import { type IconName } from '@/icon-name';
import { type ComponentProps } from 'react';

type IconListProps = {
    /** Comma separated list of icons */
    icons: string;
    iconProps?: Omit<ComponentProps<typeof Icon>, 'name'>;
};

export const IconList = ({ icons: iconsString, iconProps }: IconListProps) => {
    const icons = iconsString.split(',').map((icon) => icon.trim() as IconName);

    return (
        <ul className="flex items-center justify-center gap-1">
            {icons.map((icon, index) => (
                <Icon {...iconProps} name={icon} key={index} />
            ))}
        </ul>
    );
};
