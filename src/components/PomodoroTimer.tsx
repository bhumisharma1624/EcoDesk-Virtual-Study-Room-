import { motion } from "framer-motion";
import { usePomodoro, TimerMode } from "@/hooks/usePomodoro";
import { Play, Pause, RotateCcw } from "lucide-react";

const modes: { key: TimerMode; label: string }[] = [
  { key: "focus", label: "Focus" },
  { key: "shortBreak", label: "Short Break" },
  { key: "longBreak", label: "Long Break" },
];

interface PomodoroTimerProps {
  timer?: ReturnType<typeof usePomodoro>;
}

const PomodoroTimer = ({ timer: externalTimer }: PomodoroTimerProps = {}) => {
  const internalTimer = usePomodoro();
  const timer = externalTimer ?? internalTimer;

  return (
    <div className="glass-panel p-6 flex flex-col items-center gap-5">
      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => timer.setMode(m.key)}
            className={`px-3 py-1.5 text-xs font-body rounded-md transition-all ${
              timer.mode === m.key
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer ring */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
          />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - timer.progress)}`}
            style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary) / 0.4))" }}
          />
        </svg>
        <div className="text-center">
          <div className="text-4xl font-display font-light tracking-wider text-foreground">
            {timer.formattedTime}
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-body uppercase tracking-widest">
            {timer.mode === "focus" ? "Focus" : "Break"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={timer.reset}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={timer.toggle}
          className="p-4 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-all glow-amber"
        >
          {timer.isRunning ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <div className="w-8 text-center text-xs text-muted-foreground font-body">
          {timer.completedPomodoros}×
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 text-xs text-muted-foreground font-body">
        <span>Focus: {Math.floor(timer.totalFocusTime / 60)}m</span>
        <span>Break: {Math.floor(timer.totalBreakTime / 60)}m</span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
