import type { Message } from "@/types";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

export const MessageBubble = ({ message, isLast }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div
        className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-br from-primary to-accent shadow-md"
            : "bg-gradient-to-br from-card to-muted/50 text-card-foreground shadow-sm border border-border/50"
        } ${isLast ? "animate-slide-up" : ""}`}
      >
        <div
          className={`text-sm md:text-base prose prose-sm max-w-none ${
            isUser ? "prose-invert" : ""
          }`}
          style={isUser ? { color: '#ffffff' } : {}}
        >
          <ReactMarkdown
            components={{
              // Customize markdown elements
              h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-base font-bold mt-3 mb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
              li: ({node, ...props}) => <li className="ml-2" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
              em: ({node, ...props}) => <em className="italic" {...props} />,
              code: ({node, ...props}) => <code className="bg-muted/30 px-1 py-0.5 rounded text-xs" {...props} />,
              hr: ({node, ...props}) => <hr className="my-3 border-border/50" {...props} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <span className={`text-xs mt-2 block ${
          isUser ? "" : "opacity-70"
        }`} style={isUser ? { color: '#ffffff' } : {}}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
