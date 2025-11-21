# AI Chat Agent Tester

A beautiful, customizable AI chat agent testing tool with a warm, calming design. Test and interact with your AI agents through an intuitive interface.

## Features

### Page 1: Setup Page
- Username input field
- Chat goal input field
- System prompts multi-line text area
- Beautiful form validation and submit button
- Saves settings to localStorage

### Page 2: Chat Page
- Personalized welcome message using username and chat goal
- Real-time chat interface with message bubbles
- Typing indicator with animated dots while AI is processing
- Integration with webhook API for AI responses
- Beautiful gradient design with smooth animations

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Your Webhook API

Open `src/pages/ChatPage.tsx` and update the webhook URL:

```typescript
// Line 10 in ChatPage.tsx
const WEBHOOK_URL = "YOUR_WEBHOOK_URL_HERE";
```

Replace `"YOUR_WEBHOOK_URL_HERE"` with your actual webhook endpoint.

### 3. Webhook API Requirements

Your webhook API should:

**Accept POST requests with the following JSON body:**

```json
{
  "userMessage": "User's current message",
  "username": "User's name from setup",
  "chatGoal": "User's goal from setup",
  "systemPrompts": "System prompts from setup",
  "conversationHistory": [
    {
      "id": "message-id",
      "role": "user|assistant",
      "content": "message content",
      "timestamp": "ISO date string"
    }
  ]
}
```

**Return a JSON response:**

```json
{
  "response": "AI's response message"
}
```

OR

```json
{
  "message": "AI's response message"
}
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Usage Flow

1. **Setup Page**: User fills in:
   - Username (e.g., "Alex")
   - Chat Goal (e.g., "Testing my AI assistant")
   - System Prompts (e.g., "You are a helpful AI assistant...")

2. **Chat Page**:
   - Opens with personalized greeting
   - User can chat with AI agent
   - All messages are sent to webhook with context
   - AI responses appear in beautiful message bubbles
   - Loading indicator shows while processing

## Example Webhook Implementation

Here's a simple example using Node.js/Express:

```javascript
app.post('/webhook', async (req, res) => {
  const { userMessage, username, chatGoal, systemPrompts } = req.body;

  // Your AI processing logic here
  // Use systemPrompts to configure your AI
  // Use username and chatGoal for context

  const aiResponse = await yourAIService.process({
    message: userMessage,
    context: { username, chatGoal },
    systemPrompt: systemPrompts
  });

  res.json({ response: aiResponse });
});
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Design System

The app uses a warm, calming color palette:
- **Primary**: Soft lavender (`hsl(260 60% 75%)`)
- **Secondary**: Blush pink (`hsl(350 70% 85%)`)
- **Accent**: Pale blue (`hsl(200 60% 80%)`)
- **Background**: Warm beige (`hsl(35 30% 96%)`)

Features smooth animations, gradients, and a comfortable user experience.

## Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Customization

### Change Colors

Edit `src/styles/index.css` to modify the color scheme.

### Modify Initial Message

Edit the welcome message in `src/pages/ChatPage.tsx` (line 43).

### Add More Features

- Add conversation history export
- Add dark mode toggle
- Add voice input
- Add message editing
- Add conversation reset button

## Troubleshooting

### Issue: Page redirects to setup
- Make sure localStorage has user settings
- Check browser console for errors

### Issue: Webhook not responding
- Verify WEBHOOK_URL is correct
- Check CORS settings on your webhook
- Check network tab in browser DevTools

### Issue: Styling not loading
- Run `npm install` again
- Clear browser cache
- Check that Tailwind is properly configured

### Issue: Blank page on Live Server
- This is a React app that requires Vite dev server
- Use `npm run dev` instead of Live Server
- For production, run `npm run build` first

## License

MIT

## Support

For issues or questions, please check the code comments or create an issue in the repository.
