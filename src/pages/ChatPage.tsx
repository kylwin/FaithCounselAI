import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { Sparkles, ArrowLeft } from "lucide-react";
import type { Message, UserSettings } from "@/types";

// Webhook URL for chat messages
const CHAT_WEBHOOK_URL = "https://ici.zeabur.app/webhook/FCAgent";

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
  
    // Create initial welcome message
    function getRandomItem<T>(arr: T[]): T {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    
    const comfortingVerses = [
      `"Do not fear, for I am with you." (Isaiah 41:10)`,
      `"Cast all your anxiety on him because he cares for you." (1 Peter 5:7)`,
      `"The Lord is my shepherd; I shall not want." (Psalm 23:1)`,
      `"Come to me, all you who are weary and burdened." (Matthew 11:28)`,
      `"My grace is sufficient for you." (2 Corinthians 12:9)`,
      `"I have loved you with an everlasting love." (Jeremiah 31:3)`,
      `"The Lord is near to the brokenhearted." (Psalm 34:18)`,
      `"Peace I leave with you; my peace I give you." (John 14:27)`,
      `"God is our refuge and strength, an ever-present help in trouble." (Psalm 46:1)`,
      `"Nothing will be able to separate us from the love of God." (Romans 8:39)`,
    ];
    
    const openingTemplates = [
      (name: string) => `Peace be with you, **${name}**. What's on your heart today?`,
      (name: string) => `Hi **${name}**, I'm here with you. How can I pray with you today?`,
      (name: string) => `**${name}**, you're not alone. What would you like to share?`,
      (name: string) => `Good to see you, **${name}**. Where do you need comfort or guidance right now?`,
      (name: string) => `Welcome, **${name}**. How are you really doing today?`,
      (name: string) => `I'm glad you're here, **${name}**. What burden are you carrying that we can talk about?`,
      (name: string) => `Dear **${name}**, let's bring your worries into the light. What's weighing on you?`,
      (name: string) => `**${name}**, take a deep breath. What situation would you like to talk through together?`,
      (name: string) => `Hello **${name}**. In this moment, you are seen and loved. What would you like to say?`,
      (name: string) => `Thank you for coming, **${name}**. How can I support you right now?`,
    ];
    
    function createWelcomeMessage(settings: UserSettings): Message {
      const name = settings.username || "friend";
      const verse = getRandomItem(comfortingVerses);
      const opening = getRandomItem(openingTemplates)(name);
    
      return {
        id: "welcome",
        role: "assistant",
        content: `${verse}\n\n${opening}`,
        timestamp: new Date(),
      };
    }

    const welcomeMessage: Message = createWelcomeMessage(settings);
    setMessages([welcomeMessage]);
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
      let aiContent = "I'm here to help. Please tell me more.";

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
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleBackToSetup = () => {
    if (window.confirm("Are you sure you want to go back to setup? Your current conversation will be lost.")) {
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
            <h1 className="text-xl font-semibold text-foreground">AI Chat Agent</h1>
            <p className="text-sm text-muted-foreground">
              Chatting with {userSettings.username}
            </p>
          </div>
        </div>
        <button
          onClick={handleBackToSetup}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="Back to setup"
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
