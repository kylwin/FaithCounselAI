import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Sparkles, ArrowLeft } from "lucide-react";
import type { Message, UserSettings } from "@/types";

// Webhook URL for chat messages
const CHAT_WEBHOOK_URL = "https://ici.zeabur.app/webhook/FCAgent2";

export const ChatPage = () => {
  const navigate = useNavigate();
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Load user settings from localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (!savedSettings) {
      // If no settings, redirect to setup page
      navigate("/");
      return;
    }

    const settings: UserSettings = JSON.parse(savedSettings);
    setUserSettings(settings);

    // Fetch initial greeting from API
    const fetchInitialGreeting = async () => {
      setIsTyping(true);

      try {
        // Prepare payload - "Hi" triggers initial greeting from AI
        const payload = {
          userMessage: "Hi",
          username: settings.username,
          chatGoal: settings.chatGoal,
          conversationHistory: [],
        };

        console.log("💬 Fetching initial greeting from:", CHAT_WEBHOOK_URL);
        console.log("📦 Payload:", payload);

        const response = await fetch(CHAT_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response ok:", response.ok);

        if (!response.ok) {
          throw new Error(`Chat webhook returned status ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Response data:", data);

        // Extract content from response
        let aiContent = "愿你平安，我在这里陪伴你。";

        if (Array.isArray(data) && data.length > 0 && data[0].output) {
          aiContent = data[0].output;
        } else if (data.output) {
          aiContent = data.output;
        } else if (data.response) {
          aiContent = data.response;
        } else if (data.message) {
          aiContent = data.message;
        }

        console.log("💬 Initial greeting content:", aiContent);

        // Add initial greeting message
        const greetingMessage: Message = {
          id: "greeting",
          role: "assistant",
          content: aiContent,
          timestamp: new Date(),
        };

        setMessages([greetingMessage]);
      } catch (error) {
        console.error("❌ Error fetching initial greeting:", error);
        console.error("❌ Error details:", error instanceof Error ? error.message : error);

        // Fallback greeting message on error
        const fallbackMessage: Message = {
          id: "greeting",
          role: "assistant",
          content: "愿你平安，我在这里陪伴你。有什么我可以帮助你的吗？",
          timestamp: new Date(),
        };

        setMessages([fallbackMessage]);
      } finally {
        setIsTyping(false);
      }
    };

    fetchInitialGreeting();
  }, [navigate]);

  const handleSendMessage = async (content: string) => {
    if (!userSettings) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Prepare payload
      const payload = {
        userMessage: content,
        username: userSettings.username,
        chatGoal: userSettings.chatGoal,
        conversationHistory: messages,
      };

      console.log("💬 Sending message to chat webhook:", CHAT_WEBHOOK_URL);
      console.log("📦 Payload:", payload);

      // Send message to chat webhook API
      const response = await fetch(CHAT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`Chat webhook returned status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);

      // Extract content from response
      // API returns: [{ "output": "xxxxx" }]
      let aiContent = "我在这里帮助你。请告诉我更多。";

      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        // Handle array format: [{ "output": "xxxxx" }]
        aiContent = data[0].output;
      } else if (data.output) {
        // Handle object format: { "output": "xxxxx" }
        aiContent = data.output;
      } else if (data.response) {
        // Handle alternative format: { "response": "xxxxx" }
        aiContent = data.response;
      } else if (data.message) {
        // Handle alternative format: { "message": "xxxxx" }
        aiContent = data.message;
      }

      console.log("💬 AI message content:", aiContent);

      // Add AI response to chat
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("❌ Error calling chat webhook:", error);
      console.error("❌ Error details:", error instanceof Error ? error.message : error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "很抱歉，我现在连接不上。请稍后再试。",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBackToSetup = () => {
    if (window.confirm("你确定要返回设置吗？你当前的对话将丢失。")) {
      navigate("/");
    }
  };

  if (!userSettings) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 p-4 md:p-6 border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">真道AI</h1>
            <p className="text-sm text-muted-foreground">
            与 {userSettings.username} 正在寻求
            </p>
          </div>
        </div>
        <button
          onClick={handleBackToSetup}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="返回设置"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isTyping} />
    </div>
  );
};
