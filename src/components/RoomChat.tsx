import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, MessageCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

interface RoomChatProps {
  roomId: string;
}

const AVATAR_EMOJIS = ["📚", "🎧", "✍️", "💡", "🧠", "☕", "🌙", "🔥", "🎵", "🌿"];

function getAvatarEmoji(userId: string) {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_EMOJIS[Math.abs(hash) % AVATAR_EMOJIS.length];
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const RoomChat = ({ roomId }: RoomChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState("Anonymous");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.username) setUsername(data.username);
      });
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("room_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data) setMessages(data as ChatMessage[]);
    };
    fetchMessages();

    const channel = supabase
      .channel(`chat-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new as ChatMessage]);
          } else if (payload.eventType === "DELETE") {
            setMessages((prev) => prev.filter((m) => m.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !newMsg.trim()) return;
    setNewMsg("");
    await supabase.from("room_messages").insert({
      room_id: roomId,
      user_id: user.id,
      username,
      message: newMsg.trim(),
    });
  };

  const deleteMessage = async (msgId: string) => {
    await supabase.from("room_messages").delete().eq("id", msgId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-primary" />
          <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
            Room Chat
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-body">
          {collapsed ? "Show" : "Hide"}
        </span>
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 320 }}
            exit={{ height: 0 }}
            className="flex flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-thin">
              {messages.length === 0 && (
                <p className="text-xs text-muted-foreground/40 font-body text-center py-8">
                  No messages yet. Say hi! 👋
                </p>
              )}
              {messages.map((msg) => {
                const isOwn = msg.user_id === user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 group ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 bg-muted/40">
                      {getAvatarEmoji(msg.user_id)}
                    </div>
                    <div className={`max-w-[75%] ${isOwn ? "text-right" : ""}`}>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-body text-muted-foreground/70">
                          {msg.username}
                        </span>
                        <span className="text-[9px] text-muted-foreground/40">
                          {formatTime(msg.created_at)}
                        </span>
                        {isOwn && (
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-destructive"
                          >
                            <Trash2 size={10} className="text-muted-foreground/50 hover:text-destructive" />
                          </button>
                        )}
                      </div>
                      <div
                        className={`inline-block px-3 py-1.5 rounded-xl text-xs font-body leading-relaxed ${
                          isOwn
                            ? "bg-primary/15 text-foreground rounded-tr-sm"
                            : "bg-muted/40 text-foreground rounded-tl-sm"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {user ? (
              <div className="p-3 border-t border-border/20">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-xs font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMsg.trim()}
                    className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all disabled:opacity-30"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 border-t border-border/20 text-center">
                <p className="text-[10px] text-muted-foreground/50 font-body">
                  Sign in to chat
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoomChat;
