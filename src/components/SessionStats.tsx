import { motion } from "framer-motion";
import { BarChart3, Clock, Flame, Target } from "lucide-react";

interface SessionStatsProps {
  totalFocusTime: number;
  totalBreakTime: number;
  completedPomodoros: number;
}

const SessionStats = ({ totalFocusTime, totalBreakTime, completedPomodoros }: SessionStatsProps) => {
  const totalMinutes = Math.floor(totalFocusTime / 60);
  const streak = completedPomodoros;

  const stats = [
    { icon: Clock, label: "Focus Time", value: `${totalMinutes}m`, color: "text-studying" },
    { icon: Target, label: "Pomodoros", value: `${completedPomodoros}`, color: "text-primary" },
    { icon: Flame, label: "Streak", value: `${streak}`, color: "text-on-break" },
    { icon: BarChart3, label: "Break", value: `${Math.floor(totalBreakTime / 60)}m`, color: "text-muted-foreground" },
  ];

  return (
    <div className="glass-panel p-5 space-y-4">
      <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
        Session Analytics
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30"
          >
            <stat.icon size={16} className={stat.color} />
            <div>
              <div className="text-sm font-display font-medium text-foreground">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground font-body">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SessionStats;
