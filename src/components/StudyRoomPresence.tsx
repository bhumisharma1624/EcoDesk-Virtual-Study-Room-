import ShadowAvatar from "./ShadowAvatar";
import { Users } from "lucide-react";

// Simulated other users in the study room
const SIMULATED_USERS = [
  { id: 1, status: "studying" as const, delay: 0.1 },
  { id: 2, status: "studying" as const, delay: 0.2 },
  { id: 3, status: "break" as const, delay: 0.3 },
  { id: 4, status: "studying" as const, delay: 0.4 },
  { id: 5, status: "studying" as const, delay: 0.5 },
  { id: 6, status: "break" as const, delay: 0.6 },
  { id: 7, status: "studying" as const, delay: 0.7 },
  { id: 8, status: "studying" as const, delay: 0.8 },
  { id: 9, status: "studying" as const, delay: 0.9 },
  { id: 10, status: "break" as const, delay: 1.0 },
  { id: 11, status: "studying" as const, delay: 1.1 },
  { id: 12, status: "studying" as const, delay: 1.2 },
];

const StudyRoomPresence = () => {
  const studyingCount = SIMULATED_USERS.filter((u) => u.status === "studying").length;

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body">
          Quiet Library
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
          <Users size={12} />
          <span>{SIMULATED_USERS.length} present</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center py-2">
        {SIMULATED_USERS.map((user) => (
          <ShadowAvatar key={user.id} status={user.status} delay={user.delay} size="sm" />
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground font-body">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-studying animate-pulse-soft" />
          <span>{studyingCount} studying</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-on-break animate-pulse-soft" />
          <span>{SIMULATED_USERS.length - studyingCount} on break</span>
        </div>
      </div>
    </div>
  );
};

export default StudyRoomPresence;
