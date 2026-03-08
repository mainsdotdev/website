type TypingDisplayProps = {
  text: string;
  showCursor: boolean;
};

/**
 * Displays the typed text with an optional blinking cursor
 */
export function TypingDisplay({ text, showCursor }: TypingDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-[80px]">
      <div className="relative">
        <span className="text-4xl md:text-5xl font-mono font-light text-white/90 tracking-wide">
          {text}
        </span>
        {showCursor && (
          <span className="inline-block w-[3px] h-[1.2em] bg-white/70 ml-1 animate-blink align-middle" />
        )}
      </div>
    </div>
  );
}
