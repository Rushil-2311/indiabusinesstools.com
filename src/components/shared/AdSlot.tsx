import { cn } from "@/lib/utils";

interface AdSlotProps {
  type?: "leaderboard" | "rectangle";
  className?: string;
}

export function AdSlot({ type = "leaderboard", className }: AdSlotProps) {
  const isLeaderboard = type === "leaderboard";
  
  return <></>; // will be implemented in the future when we have a better ad strategy in place
  return (
    <div className={cn(
      "w-full flex justify-center py-6", 
      className
    )}>
      <div 
        className={cn(
          "bg-muted/50 border border-dashed border-border/60 rounded-xl flex items-center justify-center relative overflow-hidden",
          isLeaderboard ? "w-full max-w-[728px] h-[90px]" : "w-[336px] h-[280px]"
        )}
      >
        <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
          Advertisement Placeholder
        </span>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-background/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
