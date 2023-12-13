"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Style from "./drumMachine.module.css";
import NavBar from "@/app/components/nav/NavBar";

export default function DrumMachine() {
  const [displayText, setDisplayText] = useState<string>("");
  const [volume, setVolume] = useState<number>(0.5);
  const [toggleKit, setToggleKit] = useState<Boolean>(false);
  const [curAudio, setCurAudio] = useState<HTMLAudioElement | null>(null);
  const drumpads = [
    {
      key: "Q",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
      audio2: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
      title: "Heater 1",
    },
    {
      key: "W",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
      audio2: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
      title: "Heater 2",
    },
    {
      key: "E",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
      audio2: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
      title: "Heater 3",
    },
    {
      key: "A",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
      title: "Heater 4",
    },
    {
      key: "S",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
      title: "Clap",
    },
    {
      key: "D",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
      title: "Open-HH",
    },
    {
      key: "Z",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
      title: "Kick-n'-Hat",
    },
    {
      key: "X",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
      title: "Kick",
    },
    {
      key: "C",
      audio: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
      title: "Closed-HH",
    },
  ];

  const handleClick = (key: string) => {
    const audio = document.getElementById(key) as HTMLAudioElement;
    if (audio) {
      audio.volume = volume;
    }
    if (curAudio) {
      curAudio.currentTime = 0;
      curAudio.pause();
      audio.play();
    } else {
      audio.play();
    }
    setCurAudio(audio);
    drumpads.map((pad) => (pad.key == key ? setDisplayText(pad.title) : null));
  };
  const flip = () => {
    if (!toggleKit) {
      setDisplayText("Smooth Piano Kit");
      setToggleKit((prevToggleKit) => !prevToggleKit);
    } else {
      setDisplayText("Heater Kit");
      setToggleKit((prevToggleKit) => !prevToggleKit);
    }
  };
  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(+e.target.value);
    setDisplayText(`Volume : ${Math.round(volume * 100)}`);
    setTimeout(() => {
      setDisplayText("");
    }, 2000);
  };
 ;
  useEffect(() => {
    document.addEventListener("keypress", (e) => {
      drumpads.forEach((pad) => {
        if (pad.key == e.key.toUpperCase()) {
          handleClick(pad.key);
        }
      });
    })
  },[])

  return (
    <>
      <NavBar links={[{text: 'Home', url: '/'}]}/>
      <div id="container" className={Style.container}>
        <div id="drum-machine" className={Style.drumMachine}>
          <div className={Style.keys}>
            {drumpads.map((pad) => (
              <button
                key={drumpads.indexOf(pad)}
                className={Style.drumPad}
                id={pad.title}
                onClick={(e) => handleClick(e.currentTarget.innerText)}
              >
                <audio
                  className="clip"
                  id={pad.key}
                  src={toggleKit && pad.audio2 ? pad.audio2 : pad.audio}
                ></audio>
                {pad.key}
              </button>
            ))}
          </div>
          <div className={Style.controls}>
            <div className={Style.audioSlider}>
              <span>Volume control</span>
              <input
                id="volume"
                type="range"
                max="1"
                min="0"
                step="0.01"
                value={volume}
                onChange={handleVolume}
                className={Style.volume}
              />
            </div>
            <div id="display" className={Style.display}>{displayText}</div>
            <div className={Style.switch}>
              <span>Switch Set</span>
              <div className={Style.toggleSwitch} onClick={flip}>
                <div
                  className={Style.toggle}
                  style={!toggleKit ? { marginLeft: "0" } : { marginLeft: "55%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-white italic pt-8 font-thin sm:text-xl text-center">
          Designed by Obiora Sopuluchukwu emmanuel
        </p>
      </div>
    </>
  );
}
