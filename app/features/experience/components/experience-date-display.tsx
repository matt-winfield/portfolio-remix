import { DateTime, type DurationObjectUnits } from 'luxon';
import { useTimeSince } from '../hooks/use-time-since.tsx';

interface DateDisplayProps {
    startDate: string;
    endDate?: string | null;
}

export const ExperienceDateDisplay = ({
    startDate,
    endDate,
}: DateDisplayProps) => {
    const start = new Date(startDate);
    const timeSinceStart = useTimeSince(start);

    if (endDate) {
        const end = new Date(endDate);
        const duration = DateTime.fromJSDate(end).diff(
            DateTime.fromJSDate(start),
            ['years', 'months', 'weeks'],
        );

        const biggestUnit =
            (Object.keys(duration.toObject()).find(
                (key) =>
                    (duration.toObject()[key as keyof DurationObjectUnits] ??
                        0) > 0,
            ) as keyof DurationObjectUnits) ?? ('months' as const);

        const formattedDuration = duration.shiftTo(biggestUnit).toHuman({
            maximumFractionDigits: 0,
            unit: biggestUnit,
        });

        if (start.getFullYear() === end.getFullYear()) {
            return (
                <>
                    {start.getFullYear()} ({formattedDuration})
                </>
            );
        }

        return (
            <>
                {start.getFullYear()} - {end.getFullYear()} ({formattedDuration}
                )
            </>
        );
    }

    return (
        <>
            {start.getFullYear()} - now ({timeSinceStart})
        </>
    );
};
