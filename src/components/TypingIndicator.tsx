export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-gradient-to-br from-card to-muted/50 text-card-foreground shadow-sm border border-border/50">
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "200ms" }} />
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </div>
  );
};
