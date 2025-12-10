# Faith Counsel - Development Notes

## Project Overview
Faith Counsel 是一個基於 AI 的信仰輔導聊天應用程式，提供聖經經文和個人化的安慰對話。

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Icons**: Lucide React
- **API**: Webhook integration (https://ici.zeabur.app/webhook/FCAgent)

## Recent Changes (2025-11-22)

### ChatPage.tsx Modifications
1. **Initial Welcome Message Feature** (Lines 39-84)
   - Created `getRandomItem()` helper function for random selection
   - Added 10 comforting Bible verses array
   - Added 10 personalized opening message templates
   - Implemented `createWelcomeMessage()` function with proper TypeScript typing (`UserSettings`)
   - Welcome message format: `{verse}\n\n{opening}`

2. **Username Formatting**
   - Username now displayed in **bold** using Markdown syntax (`**${name}**`)
   - Automatic spacing around username in all templates

3. **UI Update**
   - Changed header back button from Settings icon to ArrowLeft icon (more intuitive)

### Git Setup
- Initialized git repository
- Created `.gitignore` file excluding:
  - `node_modules/`
  - Build outputs (`/build`, `/dist`)
  - Environment files (`.env.*`)
  - Logs and system files
- All project files staged and ready for initial commit

## Project Structure
```
src/
├── App.tsx                          # Main app component with routing
├── main.tsx                         # App entry point
├── types/index.ts                   # TypeScript type definitions
├── styles/index.css                 # Global styles
├── components/
│   ├── ChatInput.tsx               # Message input component
│   ├── MessageBubble.tsx           # Message display component (supports Markdown)
│   └── TypingIndicator.tsx         # Typing animation
└── pages/
    ├── SetupPage.tsx               # User configuration (username, chat goal)
    └── ChatPage.tsx                # Main chat interface
```

## Key Features

### Welcome Message System
- Displays random Bible verse + personalized greeting on chat start
- 10 different verses and 10 different greetings for variety
- Username is bolded and personalized in each message
- Message stored with ID "welcome" in conversation history

### Chat Flow
1. User enters username and chat goal on SetupPage
2. Settings saved to localStorage
3. Redirect to ChatPage
4. Welcome message auto-generated and displayed
5. User can chat with AI via webhook API
6. Conversation history maintained in state

### API Integration
- **Endpoint**: `https://ici.zeabur.app/webhook/FCAgent`
- **Payload**:
  ```json
  {
    "userMessage": "string",
    "username": "string",
    "chatGoal": "string",
    "conversationHistory": Message[]
  }
  ```
- **Response**: Handles multiple formats (`output`, `response`, `message`)

## Important Notes

### Markdown Support
- MessageBubble component should support Markdown rendering
- Username bold formatting depends on Markdown parser
- Newlines in welcome message use `\n\n` for proper spacing

### TypeScript Types
- Main types defined in `src/types/index.ts`:
  - `UserSettings`: username, chatGoal
  - `Message`: id, role, content, timestamp

### Next Steps / TODO
- [ ] Set git user config (name & email)
- [ ] Complete initial git commit
- [ ] Test welcome message display in browser
- [ ] Verify Markdown rendering (bold username)
- [ ] Test webhook integration
- [ ] Consider adding more Bible verses/opening templates if needed

## Development Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Git commands (after setting user config)
git config user.name "Your Name"
git config user.email "your.email@example.com"
git commit -m "Initial commit"
```

## Contact & Webhook
- **Chat Webhook**: https://ici.zeabur.app/webhook/FCAgent
- Uses POST method with JSON payload

---
Last Updated: 2025-11-22
