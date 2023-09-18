import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

const getTimeSince = (date: Date) => {
    const nowSeconds = Math.floor(DateTime.now().toSeconds());
    const duration = DateTime.fromSeconds(nowSeconds).diff(
        DateTime.fromJSDate(date),
        ['years', 'months', 'days', 'hours', 'minutes', 'seconds'],
    );
    return duration.toHuman({
        maximumFractionDigits: 0,
        unitDisplay: 'short',
    });
};

export const useTimeSince = (date: Date) => {
    const [timeSince, setTimeSince] = useState(getTimeSince(date));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeSince(getTimeSince(date));
        }, 1000);

        return () => clearInterval(interval);
    }, [date]);

    return timeSince;
};
