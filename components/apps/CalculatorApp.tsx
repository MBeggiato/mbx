import { useState } from "react";
import { Calculator, Delete, Equal } from "lucide-react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (
    firstValue: number,
    secondValue: number,
    operation: string
  ) => {
    switch (operation) {
      case "+":
        return firstValue + secondValue;
      case "-":
        return firstValue - secondValue;
      case "×":
        return firstValue * secondValue;
      case "÷":
        return firstValue / secondValue;
      case "=":
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const buttons = [
    {
      label: "C",
      onClick: clear,
      className: "bg-red-500 hover:bg-red-600 text-white",
    },
    {
      label: "CE",
      onClick: clearEntry,
      className: "bg-orange-500 hover:bg-orange-600 text-white",
    },
    {
      label: "⌫",
      onClick: () => setDisplay(display.slice(0, -1) || "0"),
      className: "bg-gray-500 hover:bg-gray-600 text-white",
    },
    {
      label: "÷",
      onClick: () => inputOperation("÷"),
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },

    {
      label: "7",
      onClick: () => inputNumber("7"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "8",
      onClick: () => inputNumber("8"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "9",
      onClick: () => inputNumber("9"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "×",
      onClick: () => inputOperation("×"),
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },

    {
      label: "4",
      onClick: () => inputNumber("4"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "5",
      onClick: () => inputNumber("5"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "6",
      onClick: () => inputNumber("6"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "-",
      onClick: () => inputOperation("-"),
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },

    {
      label: "1",
      onClick: () => inputNumber("1"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "2",
      onClick: () => inputNumber("2"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "3",
      onClick: () => inputNumber("3"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "+",
      onClick: () => inputOperation("+"),
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },

    {
      label: "0",
      onClick: () => inputNumber("0"),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900 col-span-2",
    },
    {
      label: ".",
      onClick: () => inputNumber("."),
      className: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    },
    {
      label: "=",
      onClick: performCalculation,
      className: "bg-green-500 hover:bg-green-600 text-white",
    },
  ];

  return (
    <div className="p-6 h-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Calculator</h2>
      </div>

      <div className="max-w-xs mx-auto bg-black rounded-lg p-4 shadow-lg">
        {/* Display */}
        <div className="bg-gray-900 rounded p-4 mb-4">
          <div className="text-right text-2xl font-mono text-green-400 break-all">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`p-3 rounded font-semibold transition-colors ${button.className}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
