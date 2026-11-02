import { Badge } from "@/components/ui/badge";
import { NOTE_TYPE_LABELS, type NoteType } from "@/lib/note-types";

export function TypeBadge({
  type,
  className,
}: {
  type: NoteType;
  className?: string;
}) {
  return (
    <Badge variant={type} className={className}>
      {NOTE_TYPE_LABELS[type]}
    </Badge>
  );
}
