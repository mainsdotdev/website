import { KeyboardKey } from "./keyboard-key";

// Define keyboard layout - simplified to show relevant keys for "404 Not Found"
const KEYBOARD_LAYOUT = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

type KeyboardProps = {
  pressedKey: string;
};

export function Keyboard({ pressedKey }: KeyboardProps) {
  // Normalize the pressed key for comparison
  const normalizedPressedKey = pressedKey.toUpperCase();

  return (
    <div className="flex flex-col items-center gap-2">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {row.map((key) => (
            <KeyboardKey
              key={key}
              character={key}
              isPressed={normalizedPressedKey === key}
              className="w-12 h-12"
            />
          ))}
        </div>
      ))}
      {/* Spacebar */}
      <div className="flex gap-2 mt-1">
        <KeyboardKey
          character="SPACE"
          isPressed={normalizedPressedKey === " "}
          className="w-64 h-12"
        />
      </div>
    </div>
  );
}
