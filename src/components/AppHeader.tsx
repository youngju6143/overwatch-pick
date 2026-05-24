import type { CSSProperties } from "react";

interface AppHeaderProps {
  displayStyle: CSSProperties;
  monoStyle: CSSProperties;
  gameTypeLabel?: string;
  compLabel?: string;
  roleLabel?: string;
  statusLabel: string;
}

export default function AppHeader({
  monoStyle,
  gameTypeLabel,
  compLabel,
  roleLabel,
  statusLabel,
}: AppHeaderProps) {
  return (
    <header className="w-full px-4 md:px-7.5 h-12 md:h-14 border-b border-border flex items-center justify-between gap-2">
      <div className="flex items-center gap-4 shrink-0">
        <h2
          className="text-base md:text-lg font-bold text-white/90"
          style={monoStyle}
        >
          오버워치 픽
        </h2>
      </div>

      <div
        className="flex items-center gap-3 md:gap-5 text-sm font-medium text-muted-foreground overflow-hidden"
        style={monoStyle}
      >
        {gameTypeLabel && (
          <span className="tracking-widest text-white/65 hidden sm:inline">
            {gameTypeLabel}
          </span>
        )}
        {compLabel && (
          <span className="tracking-widest px-2 py-0.5 border border-white/30 text-white/85 hidden sm:inline">
            {compLabel}
          </span>
        )}
        {roleLabel && (
          <span className="tracking-widest text-white/75 hidden md:inline">
            {roleLabel}
          </span>
        )}
        <span className="tracking-widest text-white/55 truncate">
          {statusLabel}
        </span>
      </div>
    </header>
  );
}
