import type { User } from "@/types";
import { cn } from "@/lib/cn";

interface AvatarProps {
  user: Pick<User, "name" | "initials">;
  size?: "md" | "lg";
  tone?: "lime" | "forest";
}

export function Avatar({ user, size = "md", tone = "forest" }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      title={user.name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-extrabold",
        size === "lg" ? "size-[42px] text-[.85rem]" : "size-[38px] text-[.8rem]",
        tone === "lime" ? "bg-lime text-forest-dark" : "bg-forest-dark text-lime",
      )}
    >
      {user.initials}
    </span>
  );
}

export default Avatar;
