import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const EMOJIS = ["📚", "🎧", "✍️", "💡", "🧠", "☕", "🌙", "🔥", "🎵", "🌿", "🦉", "🐱"];

const OnlineUsersBar = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    const { count: c } = await supabase
      .from("room_participants")
      .select("*", { count: "exact", head: true });
    setCount(c || 0);
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 15000);

    const channel = supabase
      .channel("global-presence")
      .on("postgres_changes", { event: "*", schema: "public", table: "room_participants" }, () => fetchCount())
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="flex items-center gap-3 px-5 py-3 rounded-full bg-card/60 border border-border/30 backdrop-blur-md"
    >
      <div className="flex -space-x-1.5">
        {EMOJIS.slice(0, Math.max(count, 3)).map((emoji, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5 + i * 0.08 }}
            className="text-base"
          >
            {emoji}
          </motion.span>
        ))}
      </div>
      <span className="text-xs font-body text-muted-foreground">
        {count > 0 ? (
          <>
            <span className="text-primary font-medium">{count}</span> studying now
          </>
        ) : (
          "Be the first to study!"
        )}
      </span>
      {count > 0 && (
        <span className="w-2 h-2 rounded-full bg-studying animate-pulse-soft" />
      )}
    </motion.div>
  );
};

export default OnlineUsersBar;
