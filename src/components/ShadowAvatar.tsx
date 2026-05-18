import { motion } from "framer-motion";

interface ShadowAvatarProps {
  status: "studying" | "break";
  delay?: number;
  size?: "sm" | "md";
}

const ShadowAvatar = ({ status, delay = 0, size = "md" }: ShadowAvatarProps) => {
  const sizeClass = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="relative">
        <div
          className={`${sizeClass} rounded-full bg-gradient-to-b from-muted-foreground/20 to-muted-foreground/5 animate-breathe`}
          style={{ animationDelay: `${delay * 1000}ms` }}
        />
        <div
          className={`absolute -bottom-0.5 right-0 ${dotSize} rounded-full ${
            status === "studying" ? "bg-studying" : "bg-on-break"
          } animate-pulse-soft`}
        />
      </div>
    </motion.div>
  );
};

export default ShadowAvatar;
