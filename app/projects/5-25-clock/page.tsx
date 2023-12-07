'use client'

import React from "react";
import Style  from "./clock.module.css";
import Head from "next/head";

const formatNumber = (num: number) => {
  return num < 10 && num >= 0 ? "0" + num : "" + num;
};

type Timeleft = {
    minutes: String
    seconds: String
}

export default function PormodoroClock() {
  const [breakLength, setBreakLength] = React.useState<number>(5);
  const [sessionLength, setSessionLength] = React.useState<number>(25);
  const [timeLeft, setTimeLeft] = React.useState<Timeleft>({
    minutes: formatNumber(sessionLength),
    seconds: formatNumber(0),
  });
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timeout | null>(null);
  const [timerLabel, setTimerLabel] = React.useState<String>("Session");
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [pause, setPause] = React.useState<Boolean>(false);
  const [session, setSession] = React.useState<Boolean>(true);

  React.useEffect(() => {
    setAudio(document.getElementById("beep") as HTMLAudioElement);
  }, []);

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    if (intervalId) {
      clearInterval(intervalId)
    }
    setIntervalId(null);
    setTimerLabel("Session");
    setTimeLeft({
      minutes: formatNumber(sessionLength),
      seconds: formatNumber(0),
    });
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  const handleIncrease = (id: String) => {
    if (intervalId === null) {
      if (id == "break-increment" && breakLength < 60) {
        setBreakLength(breakLength + 1);

        timerLabel == "Break"
          ? setTimeLeft({
              minutes: formatNumber(breakLength + 1),
              seconds: formatNumber(0),
            })
          : null;
      } else if (id == "session-increment" && sessionLength < 60) {
        setSessionLength(sessionLength + 1);

        setTimeLeft({
          minutes: formatNumber(sessionLength + 1),
          seconds: formatNumber(0),
        });
      }
    }
  };

  const handleDecrease = (id: String) => {
    if (intervalId === null) {
      if (id == "break-decrement" && breakLength > 1) {
        setBreakLength(breakLength - 1);

        timerLabel == "Break"
          ? setTimeLeft({
              minutes: formatNumber(breakLength - 1),
              seconds: formatNumber(0),
            })
          : null;
      } else if (id == "session-decrement" && sessionLength > 1) {
        setSessionLength(sessionLength - 1);

        setTimeLeft({
          minutes: formatNumber(sessionLength - 1),
          seconds: formatNumber(0),
        });
      }
    }
  };

  const handleStart = () => {
    if (intervalId === null) {
      const myInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft.seconds === "00") {
            if (prevTimeLeft.minutes === "00") {
              audio ? audio.play() : null;
              if (timerLabel === "Session") {
                setTimerLabel((prev) =>
                  prev === "Session" ? "Break" : "Session"
                );
                return {
                  minutes: formatNumber(breakLength),
                  seconds: formatNumber(0),
                };
              } else if (timerLabel === "Break") {
                setTimerLabel((prev) =>
                  prev === "Break" ? "Session" : "Break"
                );
                return {
                  minutes: formatNumber(sessionLength),
                  seconds: formatNumber(0),
                };
              }
            } else {
              return {
                minutes: formatNumber(+prevTimeLeft.minutes - 1),
                seconds: formatNumber(59),
              };
            }
          } else {
            return {
              minutes: prevTimeLeft.minutes,
              seconds: formatNumber(+prevTimeLeft.seconds - 1),
            };
          }
          return {
            minutes: "00",
            seconds: "00",
          };
        });
      }, 1000);

      if (intervalId === null && pause == false) {
        setTimeLeft({
          minutes: formatNumber(sessionLength),
          seconds: formatNumber(0),
        });
      }
      setIntervalId(myInterval);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
      setPause(true);
    }
  };

  return (
   <>
    <main className={Style.main}>
    <div className={Style.container}>
      <h2>25 + 5 Clock</h2>

      <div className={Style.session_break_length}>
        <div id="break-label" className={Style.length}>
          <p>Break Length</p>
          <div className={Style.btns}>
            <button className={Style.button}
              id="break-decrement"
              onClick={() => handleDecrease("break-decrement")}
            >
              <i className={`${Style.i} fa-solid fa-arrow-down`}></i>
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => handleIncrease("break-increment")}
            >
              <i className={`${Style.i} fa-solid fa-arrow-up`}></i>
            </button>
          </div>
        </div>
        <div id="session-label" className={Style.length}>
          <p>Session Length</p>
          <div className={Style.btns}>
            <button
              id="session-decrement"
              onClick={() => handleDecrease("session-decrement")}
            >
              <i className={`${Style.i} fa-solid fa-arrow-down`}></i>
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-increment"
              onClick={() => handleIncrease("session-increment")}
            >
              <i className={`${Style.i} fa-solid fa-arrow-up`}></i>
            </button>
          </div>
        </div>
      </div>

      <div className={Style.display}>
        <p id="timer-label">{timerLabel}</p>
        <span
          id="time-left"
          className={Style.timeleft}
          style={{ color: +timeLeft.minutes <= 1 ? "red" : ''}}
        >
          {timeLeft.minutes + ":" + timeLeft.seconds}
        </span>
      </div>
      <div className={Style.playreset}>
        <button id="start_stop" onClick={handleStart}>
          <i className={`${Style.i} fa-solid fa-play`}></i>
          <i className={`${Style.i} fa-solid fa-pause`}></i>
        </button>
        <button id="reset" onClick={handleReset}>
          <i className={`${Style.i} fa-solid fa-rotate`}></i>
        </button>
      </div>
      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
      <em
        style={{
          fontSize: "24px",
          color: "orange",
          marginTop: "30px",
        }}
      >
        Designed by Obiora Sopuluchukwu Emmanuel
      </em>
    </div>
    </main>
   </>
  );
}
