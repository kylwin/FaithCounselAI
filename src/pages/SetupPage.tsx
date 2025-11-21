import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Target } from "lucide-react";
import type { UserSettings } from "@/types";

// Webhook URL for setting up the agent
const WEBHOOK_URL = "https://ici.zeabur.app/webhook/FSAgent";

export const SetupPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>({
    username: "",
    chatGoal: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("🚀 Sending settings to webhook:", WEBHOOK_URL);
      console.log("📦 Payload:", settings);

      // Send settings to webhook API
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: settings.username,
          chatGoal: settings.chatGoal,
        }),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`Webhook returned status ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Response data:", data);

      // Save settings to localStorage
      localStorage.setItem("userSettings", JSON.stringify(settings));

      // Navigate to chat page
      navigate("/chat");
    } catch (error) {
      console.error("❌ Error calling webhook:", error);
      alert("Failed to connect to the webhook. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = settings.username && settings.chatGoal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 animate-pulse-glow">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Faith Counsel AI
          </h1>
          <p className="text-muted-foreground">
            The christian therapist
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-lg border border-border/50 p-6 md:p-8 space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <User className="w-4 h-4 text-primary" />
              Username
            </label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Chat Goal Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="w-4 h-4 text-accent" />
              Chat Goal
            </label>
            <input
              type="text"
              value={settings.chatGoal}
              onChange={(e) => setSettings({ ...settings, chatGoal: e.target.value })}
              placeholder="What would you like to chat about?"
              className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? "Setting up agent..." : "Start Chat Session"}
          </button>
        </form>
      </div>
    </div>
  );
};
