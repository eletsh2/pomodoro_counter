import { useRef, useState, useEffect, useCallback } from "react";

export interface IUseTimerProps {
  duration: number;
  callback?: () => void;
  delay?: number;
  isMilSeconds?: boolean;
  onChange?: (obj: any) => void;
}

export const useTimer = ({
  callback,
  delay = 1000,
  isMilSeconds = false,
  duration,
  onChange,
}: IUseTimerProps) => {
  duration = isMilSeconds ? duration / delay : duration;

  const timer = useRef<NodeJS.Timer>();
  const timerStatus = useRef<boolean>(false);

  const [displayedTime, setDisplayedTime] = useState<string>("00:00:00");
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const [restTime, setRestTime] = useState<number>(0);
  const [passedTime, setPassedTime] = useState<number>(0);

  const [passedTimeDisplay, setPassedTimeDisplay] =
    useState<string>("00:00:00");
  const [passedSeconds, setPassedSeconds] = useState<number>(0);
  const [passedMinutes, setPassedMinutes] = useState<number>(0);
  const [passedHours, setPassedHours] = useState<number>(0);

  const [paused, setPaused] = useState<boolean>(true);
  const [firstLaunch, setFirstLaunch] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);

  const msToHMS = useCallback(
    (ms: number) => {
      const seconds = Math.floor((ms / delay) % 60);
      const minutes = Math.floor((ms / delay / 60) % 60);
      const hours = Math.floor((ms / delay / 3600) % 24);

      return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");
    },
    [delay],
  );

  const minToHMS = useCallback(
    (time: number) => msToHMS(time * 60 * delay),
    [delay, msToHMS],
  );

  const stop = useCallback(() => {
    timerStatus.current = false;
    setPaused(true);
    clearInterval(timer.current);
    setStarted(false);
  }, []);

  const pause = () => {
    if (firstLaunch) {
      timerStatus.current = !timerStatus.current;
      setPaused((paused: boolean) => !paused);
    }
  };

  const start = useCallback(
    function start() {
      if (timer.current) {
        stop();
      }

      setStarted(true);
      setFirstLaunch(true);
      timerStatus.current = true;
      setPaused(false);

      let [hours, minutes, seconds] = minToHMS(duration || 0)
        ?.split(":")
        ?.map(e => parseInt(e));

      timer.current = setInterval(() => {
        if (timerStatus.current) {
          // decrement seconds
          if (seconds > 0) {
            seconds--;
          }

          if (seconds === 0 && minutes > 0) {
            minutes--;
            seconds = 59;
          }

          if (minutes === 0 && hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
          }

          // if the seconds, minutes and hours is less than 0 then stop the timer
          if (hours <= 0 && minutes <= 0 && seconds <= 0) {
            clearInterval(timer.current);
            if (callback) {
              callback();
            }
          }

          setHours(hours);
          setMinutes(minutes);
          setSeconds(seconds);

          // update displayed time
          setDisplayedTime(
            [
              hours.toString().padStart(2, "0"),
              minutes.toString().padStart(2, "0"),
              seconds.toString().padStart(2, "0"),
            ].join(":"),
          );
        }
      }, delay);
    },
    [minToHMS, duration, delay, stop, callback],
  );

  const reset = useCallback(() => {
    clearInterval(timer.current);
    setDisplayedTime(minToHMS(duration));
    setPassedTimeDisplay("00:00:00");
    setPassedTime(0);
    start();
  }, [minToHMS, duration, start]);

  useEffect(() => {
    const timeDetails = minToHMS(duration);
    const [hours, minutes, seconds] = timeDetails.split(":");

    setDisplayedTime(timeDetails);
    setHours(+hours);
    setMinutes(+minutes);
    setSeconds(+seconds);
    setRestTime(
      +seconds * delay + +minutes * delay * 60 + +hours * delay * 60 * 60,
    );

    setPassedTime(0);

    if (firstLaunch && !paused) {
      clearTimeout(timer.current);
      //   timer.current = null;
      start();
    }
  }, [minToHMS, delay, duration, start]);

  useEffect(() => {
    const [hours, minutes, seconds] = displayedTime
      .split(":")
      .map(e => parseInt(e));

    let newRestTime =
      +seconds * delay + +minutes * delay * 60 + +hours * delay * 60 * 60;

    setPassedTime((duration || 0) * 60 * delay - newRestTime);

    setRestTime(newRestTime);
  }, [displayedTime, delay, duration]);

  useEffect(() => {
    const passedTimeDisplay = msToHMS(passedTime);
    const [hours, minutes, seconds] = passedTimeDisplay
      .split(":")
      .map(e => parseInt(e));

    setPassedTimeDisplay(passedTimeDisplay);

    setPassedHours(hours);
    setPassedMinutes(minutes);
    setPassedSeconds(seconds);
  }, [msToHMS, passedTime]);

  // OnChange
  useEffect(
    () =>
      onChange?.({
        // Control
        start,
        stop,
        reset,
        pause,

        // Playing
        paused,
        firstLaunch,
        started,

        // Timing
        passedTime,
        restTime,

        displayedTime,
        hours,
        minutes,
        seconds,

        passedTimeDisplay,
        passedHours,
        passedMinutes,
        passedSeconds,

        // Conversion
        msToHMS,
        minToHMS,

        // Testing
        timer,
        timerStatus,
      }),
    [
      // Control
      start,
      stop,
      reset,
      pause,

      // Playing
      paused,
      firstLaunch,
      started,

      // Timing
      passedTime,
      restTime,

      displayedTime,
      hours,
      minutes,
      seconds,

      passedTimeDisplay,
      passedHours,
      passedMinutes,
      passedSeconds,

      // Conversion
      msToHMS,
      minToHMS,

      // Testing
      timer,
      timerStatus,

      onChange,
    ],
  );

  return {
    // Control
    start,
    stop,
    reset,
    pause,

    // Playing
    paused,
    firstLaunch,
    started,

    // Timing
    passedTime,
    restTime,
    countingDown: {
      display: displayedTime,
      hours,
      minutes,
      seconds,
    },
    countingUp: {
      display: passedTimeDisplay,
      hours: passedHours,
      minutes: passedMinutes,
      seconds: passedSeconds,
    },

    // Conversion
    msToHMS,
    minToHMS,

    // Testing
    timer,
    timerStatus,
  };
};
