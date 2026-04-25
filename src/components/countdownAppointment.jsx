/* eslint-disable react/prop-types */
import moment from 'moment';
import { useEffect, useState } from 'react';

const Timer = ({ startTime }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [showTimer, setShowTimer] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const appointmentTime = moment(startTime, "h:mm a");
        const fiveMinBefore = moment(appointmentTime).subtract(5, 'minutes');
        const totalDuration = appointmentTime.diff(fiveMinBefore); // total 5 min in ms

        const interval = setInterval(() => {
            const now = moment();

            if (now.isSameOrAfter(fiveMinBefore) && now.isBefore(appointmentTime)) {
                setShowTimer(true);
                const timeRemaining = appointmentTime.diff(now);

                const duration = moment.duration(timeRemaining);
                const minutes = String(duration.minutes()).padStart(2, '0');
                const seconds = String(duration.seconds()).padStart(2, '0');
                setTimeLeft(`${minutes}:${seconds}`);

                const elapsed = totalDuration - timeRemaining;
                const progressPercentage = (elapsed / totalDuration) * 100;
                setProgress(progressPercentage);
            } else if (now.isSameOrAfter(appointmentTime)) {
                setTimeLeft('00:00');
                setProgress(100);
                clearInterval(interval);
            } else {
                setShowTimer(false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime])

    if (!showTimer) return null;

    return (
        <div className='wraper_time_countdown'>
            <div className='textt d-flex align-items-center gap-1'>
                <span>{timeLeft}</span> <p> Remaining to start </p>
            </div>
            <div className='progressAppoint' style={{ height: '1px', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#118BE2',
                    transition: 'width 1s linear'
                }} />
            </div>
        </div>
    );
};

export default Timer;