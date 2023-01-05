import { useState } from "react";
import { useTimer } from "utils/hooks/useTimer";

export default function App() {
  const [duration, setDuration] = useState(10);

  const {
    countingDown: { minutes: countDownMinutes, seconds: countDownSeconds },
    countingUp: { minutes: countUpMinutes, seconds: countUpSeconds },
    started,
    paused,
    stop,
    pause,
    reset,
  } = useTimer({
    duration,
  });

  const times = [5, 10, 15, 20, 25, 30, 40, 50, 60];

  return (
    <div className="app">
      {started && (
        <>
          <div className={`watchText`}>
            {[
              countDownMinutes.toString().padStart(2, "0"),
              countDownSeconds.toString().padStart(2, "0"),
            ].join(":")}
            <div className="passedTime">
              {[
                countUpMinutes.toString().padStart(2, "0"),
                countUpSeconds.toString().padStart(2, "0"),
              ].join(":")}
            </div>
            <div className="targetTime">
              {[
                duration.toString().padStart(2, "0"),
                (0).toString().padStart(2, "0"),
              ].join(":")}
            </div>
          </div>

          <button className="control-btn pause-btn" onClick={pause}>
            {paused ? "play" : "pause"}
          </button>
          <button className="control-btn stop-btn" onClick={stop}>
            stop
          </button>
          <button className="control-btn reset-btn" onClick={reset}>
            reset
          </button>
        </>
      )}

      {!started && (
        <div className="times-container">
          <h1>Choose a duration</h1>

          <div className="times">
            {times.map(time => (
              <button
                key={"time" + time}
                onClick={() => {
                  setDuration(time);
                  reset();
                }}>
                {time}
              </button>
            ))}
          </div>

          <h2>
            <mark>In Minutes</mark>
          </h2>
        </div>
      )}
    </div>
  );
}
