import { copy } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export function AdSlot({
  locale,
  compact = false
}: {
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <aside className={compact ? "ad-slot ad-slot-compact" : "ad-slot"}>
      <span>{copy[locale].adLabel}</span>
    </aside>
  );
}
