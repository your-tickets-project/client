import React, { useEffect, useRef, useState } from 'react';
import { colors } from 'client/styles/variables';

interface Props {
  minutes: number;
  preffix?: React.ReactNode;
  onTimeEnd?: () => void;
}

export default function CountDownTimer({ minutes, preffix, onTimeEnd }: Props) {
  const [time, setTime] = useState(minutes * 60);
  const [isHalfTime, setIsHalfTime] = useState(false);
  const timerId = useRef<any>();

  useEffect(() => {
    timerId.current = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    if (time <= (minutes * 60) / 2 && !isHalfTime) {
      setIsHalfTime(true);
    }
    if (time <= 0) {
      onTimeEnd?.();
      clearInterval(timerId.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const formatTime = ({ currentTime }: { currentTime: number }) => {
    const minutes = `0${Math.floor(currentTime / 60)}`.slice(-2);
    const seconds = `0${currentTime % 60}`.slice(-2);
    return `${minutes}: ${seconds}`;
  };

  return (
    <span style={{ color: isHalfTime ? colors.warning : undefined }}>
      {preffix} {formatTime({ currentTime: time })}
    </span>
  );
}
