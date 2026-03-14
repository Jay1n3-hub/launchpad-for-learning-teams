import { AlertTriangle, CheckCircle, GripVertical, User } from "lucide-react";

const columns = [
  {
    title: "To Do",
    cards: [
      { label: "Setup CI pipeline", user: "JR", color: "text-muted-foreground" },
      { label: "Write unit tests", user: "KA", color: "text-muted-foreground" },
    ],
  },
  {
    title: "In Progress",
    cards: [
      { label: "API integration", user: "ML", color: "text-primary" },
    ],
  },
  {
    title: "Blocked",
    cards: [
      { label: "Auth module — waiting on mentor review", user: "DP", color: "text-log-blocker", blocked: true },
    ],
  },
  {
    title: "Done",
    cards: [
      { label: "Database schema", user: "ML", color: "text-log-complete", done: true },
    ],
  },
];

const SprintBoardVisual = () => (
  <div className="rounded-xl border border-border bg-card p-4 glow-border">
    <div className="mb-3 flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">Sprint 3 — Week of Mar 10</span>
      <span className="text-xs font-mono text-primary">boardly/sprint</span>
    </div>
    <div className="grid grid-cols-4 gap-2">
      {columns.map((col) => (
        <div key={col.title} className="rounded-lg bg-muted/40 p-2">
          <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {col.title}
          </span>
          <div className="space-y-1.5">
            {col.cards.map((card) => (
              <div
                key={card.label}
                className={`group flex items-start gap-1.5 rounded-md border border-border bg-card p-2 text-[11px] leading-tight ${card.color}`}
              >
                <GripVertical className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground/40" strokeWidth={1.5} />
                <div className="flex-1">
                  <span className="block">{card.label}</span>
                  <div className="mt-1.5 flex items-center gap-1">
                    {card.blocked && <AlertTriangle className="h-3 w-3 text-log-blocker" strokeWidth={1.5} />}
                    {card.done && <CheckCircle className="h-3 w-3 text-log-complete" strokeWidth={1.5} />}
                    <span className="ml-auto flex items-center gap-0.5 text-[9px] text-muted-foreground">
                      <User className="h-2.5 w-2.5" strokeWidth={1.5} />
                      {card.user}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SprintBoardVisual;
