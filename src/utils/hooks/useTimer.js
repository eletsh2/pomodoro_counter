"use strict";
exports.__esModule = true;
exports.useTimer = void 0;
var react_1 = require("react");
var useTimer = function (_a) {
    var callback = _a.callback, _b = _a.delay, delay = _b === void 0 ? 1000 : _b, _c = _a.isMilSeconds, isMilSeconds = _c === void 0 ? false : _c, duration = _a.duration, onChange = _a.onChange;
    duration = isMilSeconds ? duration / delay : duration;
    var timer = (0, react_1.useRef)();
    var timerStatus = (0, react_1.useRef)(false);
    var _d = (0, react_1.useState)("00:00:00"), displayedTime = _d[0], setDisplayedTime = _d[1];
    var _e = (0, react_1.useState)(0), hours = _e[0], setHours = _e[1];
    var _f = (0, react_1.useState)(0), minutes = _f[0], setMinutes = _f[1];
    var _g = (0, react_1.useState)(0), seconds = _g[0], setSeconds = _g[1];
    var _h = (0, react_1.useState)(0), restTime = _h[0], setRestTime = _h[1];
    var _j = (0, react_1.useState)(0), passedTime = _j[0], setPassedTime = _j[1];
    var _k = (0, react_1.useState)("00:00:00"), passedTimeDisplay = _k[0], setPassedTimeDisplay = _k[1];
    var _l = (0, react_1.useState)(0), passedSeconds = _l[0], setPassedSeconds = _l[1];
    var _m = (0, react_1.useState)(0), passedMinutes = _m[0], setPassedMinutes = _m[1];
    var _o = (0, react_1.useState)(0), passedHours = _o[0], setPassedHours = _o[1];
    var _p = (0, react_1.useState)(true), paused = _p[0], setPaused = _p[1];
    var _q = (0, react_1.useState)(false), firstLaunch = _q[0], setFirstLaunch = _q[1];
    var _r = (0, react_1.useState)(false), started = _r[0], setStarted = _r[1];
    var msToHMS = (0, react_1.useCallback)(function (ms) {
        var seconds = Math.floor((ms / delay) % 60);
        var minutes = Math.floor((ms / delay / 60) % 60);
        var hours = Math.floor((ms / delay / 3600) % 24);
        return [
            hours.toString().padStart(2, "0"),
            minutes.toString().padStart(2, "0"),
            seconds.toString().padStart(2, "0"),
        ].join(":");
    }, [delay]);
    var minToHMS = (0, react_1.useCallback)(function (time) { return msToHMS(time * 60 * delay); }, [delay, msToHMS]);
    var stop = (0, react_1.useCallback)(function () {
        timerStatus.current = false;
        setPaused(true);
        clearInterval(timer.current);
        setStarted(false);
    }, []);
    var pause = function () {
        if (firstLaunch) {
            timerStatus.current = !timerStatus.current;
            setPaused(function (paused) { return !paused; });
        }
    };
    var start = (0, react_1.useCallback)(function start() {
        var _a, _b;
        if (timer.current) {
            stop();
        }
        setStarted(true);
        setFirstLaunch(true);
        timerStatus.current = true;
        setPaused(false);
        var _c = (_b = (_a = minToHMS(duration || 0)) === null || _a === void 0 ? void 0 : _a.split(":")) === null || _b === void 0 ? void 0 : _b.map(function (e) { return parseInt(e); }), hours = _c[0], minutes = _c[1], seconds = _c[2];
        timer.current = setInterval(function () {
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
                setDisplayedTime([
                    hours.toString().padStart(2, "0"),
                    minutes.toString().padStart(2, "0"),
                    seconds.toString().padStart(2, "0"),
                ].join(":"));
            }
        }, delay);
    }, [minToHMS, duration, delay, stop, callback]);
    var reset = (0, react_1.useCallback)(function () {
        clearInterval(timer.current);
        setDisplayedTime(minToHMS(duration));
        setPassedTimeDisplay("00:00:00");
        setPassedTime(0);
        start();
    }, [minToHMS, duration, start]);
    (0, react_1.useEffect)(function () {
        var timeDetails = minToHMS(duration);
        var _a = timeDetails.split(":"), hours = _a[0], minutes = _a[1], seconds = _a[2];
        setDisplayedTime(timeDetails);
        setHours(+hours);
        setMinutes(+minutes);
        setSeconds(+seconds);
        setRestTime(+seconds * delay + +minutes * delay * 60 + +hours * delay * 60 * 60);
        setPassedTime(0);
        if (firstLaunch && !paused) {
            clearTimeout(timer.current);
            //   timer.current = null;
            start();
        }
    }, [minToHMS, delay, duration, start]);
    (0, react_1.useEffect)(function () {
        var _a = displayedTime
            .split(":")
            .map(function (e) { return parseInt(e); }), hours = _a[0], minutes = _a[1], seconds = _a[2];
        var newRestTime = +seconds * delay + +minutes * delay * 60 + +hours * delay * 60 * 60;
        setPassedTime((duration || 0) * 60 * delay - newRestTime);
        setRestTime(newRestTime);
    }, [displayedTime, delay, duration]);
    (0, react_1.useEffect)(function () {
        var passedTimeDisplay = msToHMS(passedTime);
        var _a = passedTimeDisplay
            .split(":")
            .map(function (e) { return parseInt(e); }), hours = _a[0], minutes = _a[1], seconds = _a[2];
        setPassedTimeDisplay(passedTimeDisplay);
        setPassedHours(hours);
        setPassedMinutes(minutes);
        setPassedSeconds(seconds);
    }, [msToHMS, passedTime]);
    // OnChange
    (0, react_1.useEffect)(function () {
        return onChange === null || onChange === void 0 ? void 0 : onChange({
            // Control
            start: start,
            stop: stop,
            reset: reset,
            pause: pause,
            // Playing
            paused: paused,
            firstLaunch: firstLaunch,
            started: started,
            // Timing
            passedTime: passedTime,
            restTime: restTime,
            displayedTime: displayedTime,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            passedTimeDisplay: passedTimeDisplay,
            passedHours: passedHours,
            passedMinutes: passedMinutes,
            passedSeconds: passedSeconds,
            // Conversion
            msToHMS: msToHMS,
            minToHMS: minToHMS,
            // Testing
            timer: timer,
            timerStatus: timerStatus
        });
    }, [
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
    ]);
    return {
        // Control
        start: start,
        stop: stop,
        reset: reset,
        pause: pause,
        // Playing
        paused: paused,
        firstLaunch: firstLaunch,
        started: started,
        // Timing
        passedTime: passedTime,
        restTime: restTime,
        countingDown: {
            display: displayedTime,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        },
        countingUp: {
            display: passedTimeDisplay,
            hours: passedHours,
            minutes: passedMinutes,
            seconds: passedSeconds
        },
        // Conversion
        msToHMS: msToHMS,
        minToHMS: minToHMS,
        // Testing
        timer: timer,
        timerStatus: timerStatus
    };
};
exports.useTimer = useTimer;
