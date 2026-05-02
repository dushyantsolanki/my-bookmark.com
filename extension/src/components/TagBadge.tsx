
import { Tag as TagIcon } from 'lucide-react';
import { getTagColor, cn } from '../lib/utils';

interface TagBadgeProps {
  name: string;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TagBadge({ name, isSelected, onClick, className }: TagBadgeProps) {
  const tagStyle = getTagColor(name);

  return (
    <button
      type="button"
      onClick={onClick}
      style={tagStyle}
      className={cn(
        "px-2.5 py-1 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1",
        isSelected
          ? "bg-[var(--tag-text)] border-[var(--tag-text)] text-white shadow-sm"
          : "bg-[var(--tag-bg)] border-[var(--tag-border)] text-[var(--tag-text)] hover:brightness-95",
        className
      )}
    >
      <TagIcon size={10} className={cn("shrink-0", isSelected ? "text-white" : "text-[var(--tag-text)] opacity-70")} />
      <span>{name}</span>
    </button>
  );
}
