import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getAvatarSrc } from "@/lib/avatars";

interface UserAvatarProps {
  username?: string | null;
  avatarUrl?: string | null;
  avatarId?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name.slice(0, 2).toUpperCase();
}

const UserAvatar = ({ username, avatarUrl, avatarId, size = "md", className }: UserAvatarProps) => {
  const imgSrc = avatarUrl || getAvatarSrc(avatarId);

  return (
    <Avatar className={cn(SIZE_MAP[size], "border border-border/40", className)}>
      {imgSrc && <AvatarImage src={imgSrc} alt={username || "User"} />}
      <AvatarFallback className="bg-primary/10 text-primary font-body font-medium">
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
