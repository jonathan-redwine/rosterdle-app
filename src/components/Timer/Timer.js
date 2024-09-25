// Timer component

import React, { useEffect, useImperativeHandle, useState } from 'react';
import './Timer.scss';

const Timer = (props, ref) => {
  const [secondsRemaining, setSecondsRemaining] = useState(props.timerMaxSeconds);

  useImperativeHandle(ref, () => ({
    resetTimer: () => {
      setSecondsRemaining(props.timerMaxSeconds);
    },
  }));

  const iterateTimer = () => {
    if (!props.gameIsLive) return;
    if (secondsRemaining === 0) {
      props.timerExpired();
    } else {
      setSecondsRemaining(secondsRemaining - 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => iterateTimer(), 1000);
    return () => clearInterval(interval);
  });

  return (
    <div className="timer" style={{ backgroundSize: `100% ${(secondsRemaining / props.timerMaxSeconds) * 100}%` }}>
      {secondsRemaining}
    </div>
  );
};

export default React.forwardRef(Timer);
