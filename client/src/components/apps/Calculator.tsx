import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Game2048 } from "./Game2048";

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [operation, setOperation] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [bsod, setBsod] = useState(false);
  const [show2048, setShow2048] = useState(false);

  useEffect(() => {
    if (display === "2048") {
      setShow2048(true);
    }
  }, [display]);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    setOperation(op);
    setPrevValue(parseFloat(display));
    setNewNumber(true);
  };

  const calculate = () => {
    if (operation && prevValue !== null) {
      const current = parseFloat(display);
      if (operation === "/" && current === 0) {
        setBsod(true);
        return;
      }
      let result = 0;
      switch (operation) {
        case "+":
          result = prevValue + current;
          break;
        case "-":
          result = prevValue - current;
          break;
        case "*":
          result = prevValue * current;
          break;
        case "/":
          result = prevValue / current;
          break;
      }
      setDisplay(result.toString());
      setOperation(null);
      setPrevValue(null);
      setNewNumber(true);
    }
  };

  if (bsod) {
    return (
      <div className="h-full bg-blue-600 text-white p-4 font-mono">
        <h1 className="text-xl mb-4">):</h1>
        <p>Your application ran into a problem and needs to restart.</p>
        <p className="mt-4">Error: DIVIDE_BY_ZERO_EXCEPTION</p>
        <p className="mt-4">* Press any key to restart</p>
        <button
          className="absolute inset-0 w-full h-full opacity-0"
          onClick={() => setBsod(false)}
        />
      </div>
    );
  }

  if (show2048) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-2 bg-muted">
          <h1 className="text-lg font-bold">2048</h1>
          <Button variant="ghost" size="sm" onClick={() => setShow2048(false)}>
            Back to Calculator
          </Button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Game2048 />
        </div>
      </div>
    );
  }

  const clear = () => {
    setDisplay("0");
    setOperation(null);
    setPrevValue(null);
    setNewNumber(true);
  };

  return (
    <div className="grid grid-cols-4 gap-1">
      <div className="col-span-4 bg-muted p-2 rounded mb-1 text-right text-xl" data-testid="calculator-display">
        {display}
      </div>
      <Button variant="outline" onClick={() => clear()}>
        C
      </Button>
      <Button variant="outline" onClick={() => handleOperation("/")}>
        /
      </Button>
      <Button variant="outline" onClick={() => handleOperation("*")}>
        ×
      </Button>
      <Button variant="outline" onClick={() => handleOperation("-")}>
        -
      </Button>

      <Button variant="secondary" onClick={() => handleNumber("7")}>
        7
      </Button>
      <Button variant="secondary" onClick={() => handleNumber("8")}>
        8
      </Button>
      <Button variant="secondary" onClick={() => handleNumber("9")}>
        9
      </Button>
      <Button variant="outline" onClick={() => handleOperation("+")}>
        +
      </Button>

      <Button variant="secondary" onClick={() => handleNumber("4")}>
        4
      </Button>
      <Button variant="secondary" onClick={() => handleNumber("5")}>
        5
      </Button>
      <Button variant="secondary" onClick={() => handleNumber("6")}>
        6
      </Button>
      <Button
        variant="default"
        onClick={() => calculate()}
        className="row-span-3"
      >
        =
      </Button>

      <Button variant="secondary" onClick={() => handleNumber("1")}>
        1
      </Button>
      <Button variant="secondary" onClick={() => handleNumber("2")}>
        2
      </Button>
      <Button variant="secondary" onClick={() => handleNumber("3")}>
        3
      </Button>

      <Button
        variant="secondary"
        onClick={() => handleNumber("0")}
        className="col-span-2"
      >
        0
      </Button>
      <Button variant="secondary" onClick={() => handleNumber(".")}>
        .
      </Button>
    </div>
  );
}