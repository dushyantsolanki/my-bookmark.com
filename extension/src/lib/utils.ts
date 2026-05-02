import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTagColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return {
    "--tag-bg": `hsla(${hue}, 75%, 50%, 0.12)`,
    "--tag-text": `hsl(${hue}, 75%, 35%)`,
    "--tag-border": `hsla(${hue}, 75%, 50%, 0.25)`,
    "--tag-bg-dark": `hsla(${hue}, 75%, 50%, 0.25)`,
    "--tag-text-dark": `hsl(${hue}, 85%, 75%)`,
  } as React.CSSProperties;
}
