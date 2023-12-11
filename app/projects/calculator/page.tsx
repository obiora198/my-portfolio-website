"use client";
import { useState, useEffect } from "react";

export default function Calculator() {
  const [currentValue, setCurrentValue] = useState<string>("0");
  const [equation, setEquation] = useState<string>("");

  function handleClick(value: string) {
    if (value === "=") {
      try {
        const solution = eval(equation);
        setCurrentValue(`${solution}`);
        setEquation((prevEquation) => `${prevEquation}=${solution}`);
      } catch (error) {
        setCurrentValue((prevValue) => prevValue);
        setEquation((prevEquation) => prevEquation);
      }
    } else if (value === "AC") {
      setCurrentValue("0");
      setEquation("");
    } else if ("/*+-".includes(value)) {
      const currentEquation = equation;
      const lastChar = currentEquation[currentEquation.length - 1];

      if ("/*+-".includes(lastChar) && value === "-") {
        const newEquation = currentEquation.slice(0, -1);
        const newLastChar = newEquation[newEquation.length - 1];

        if ("/*+-".includes(newLastChar)) {
          if (lastChar === "-") {
            setCurrentValue((prevValue) => value);
            setEquation((prevEquation) => newEquation + value);
          } else {
            setCurrentValue((prevValue) => value);
            setEquation((prevEquation) => currentEquation + value);
          }
        } else {
          if (currentEquation === "-") {
            setCurrentValue((prevValue) => value);
            setEquation((prevEquation) => value);
          } else {
            setCurrentValue((prevValue) => value);
            setEquation((prevEquation) => currentEquation + value);
          }
        }
      } else if ("/*+-".includes(lastChar) && value !== "-") {
        const newEquation = currentEquation.slice(0, -1);
        const newLastChar = newEquation[newEquation.length - 1];

        if ("/*+-".includes(newLastChar)) {
          setCurrentValue((prevValue) => value);
          setEquation((prevEquation) => newEquation.slice(0, -1) + value);
        } else {
          setCurrentValue((prevValue) => value);
          setEquation((prevEquation) => currentEquation.slice(0, -1) + value);
        }
      } else {
        if (currentEquation.includes("=")) {
          const newEquation = currentEquation.split("=");
          setCurrentValue((prevValue) => value);
          setEquation((prevEquation) => newEquation[1] + value);
        } else {
          setCurrentValue((prevValue) => value);
          setEquation((prevEquation) => currentEquation + value);
        }
      }
    } else if (value == ".") {
      setCurrentValue((prevValue) =>
        prevValue.includes(".") ? prevValue : prevValue + value
      );
      setEquation((prevEquation) => prevEquation + value);
    } else {
      if (currentValue.length > 20) {
        setCurrentValue((prevValue) => "DIGIT LIMIT MET");
        setTimeout(() => {
          setCurrentValue((prevValue) => currentValue);
          setEquation((prevEquation) => prevEquation);
        }, 1000);
      } else {
        setCurrentValue((prevValue) =>
          "0/*-+".includes(prevValue) || equation.includes("=")
            ? value
            : prevValue == "DIGIT LIMIT MET"
            ? prevValue
            : prevValue + value
        );
        setEquation((prevEquation) =>
          ("0/*+".includes(currentValue) && "0/*+".includes(prevEquation)) ||
          prevEquation.includes("=")
            ? value
            : currentValue == "DIGIT LIMIT MET"
            ? prevEquation
            : prevEquation + value
        );
      }
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", () => handleEvent);
  }, [handleEvent]);

  function handleEvent(event: KeyboardEvent) {
    buttons.forEach((button) => {
      if (button.value == event.key) {
        handleClick(event.key);
      }
    });
  }

  return (
    <div className="w-full flex flex-col justify-center items-center pt-[150px] px-4">
      <div className="w-[250px] sm:w-[350px] bg-black p-2">
        <div className="w-full text-right">
          <div className="w-full min-h-[30px] break-all font-mono text-yellow-400">
            {equation}
          </div>
          <div id="display" className="w-full font-mono text-2xl text-white">
            {currentValue}
          </div>
        </div>

        <div className="w-full grid grid-rows-5 grid-cols-4 gap-[1px]">
          {buttons.map((button) => (
            <button
              id={button.id}
              key={button.id}
              className={`${
                button.value === "AC"
                  ? "col-span-2 bg-[#ac3939]"
                  : button.value === "0"
                  ? "col-span-2 bg-[#4d4d4d]"
                  : button.value === "="
                  ? "row-span-2 h-auto bg-[#004466]"
                  : "*/+-".includes(button.value)
                  ? "bg-[#666666]"
                  : "bg-[#4d4d4d]"
              } ${buttonsStyle}`}
              onClick={() => handleClick(button.value)}
            >
              {button.value}
            </button>
          ))}
        </div>
      </div>
      <p className="text-white italic pt-8 font-thin sm:text-xl text-center">
        Designed by Obiora Sopuluchukwu emmanuel
      </p>
    </div>
  );
}

const buttonsStyle =
  "hover:border-2 hover:border-gray-200 w-full h-[55px] sm:h-[75px] text-white hover:text-black";
const buttons = [
  {
    id: "clear",
    value: "AC",
  },
  {
    id: "divide",
    value: "/",
  },
  {
    id: "multiply",
    value: "*",
  },
  {
    id: "seven",
    value: "7",
  },
  {
    id: "eight",
    value: "8",
  },
  {
    id: "nine",
    value: "9",
  },
  {
    id: "subtract",
    value: "-",
  },
  {
    id: "four",
    value: "4",
  },
  {
    id: "five",
    value: "5",
  },
  {
    id: "six",
    value: "6",
  },
  {
    id: "add",
    value: "+",
  },
  {
    id: "one",
    value: "1",
  },
  {
    id: "two",
    value: "2",
  },
  {
    id: "three",
    value: "3",
  },
  {
    id: "equals",
    value: "=",
  },
  {
    id: "zero",
    value: "0",
  },
  {
    id: "decimal",
    value: ".",
  },
];
