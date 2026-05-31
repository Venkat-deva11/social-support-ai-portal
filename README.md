
## 📋 Prerequisites

- Node.js 18+ and npm 9+
- OpenAI API key (for AI assistance feature)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd social-support-ai-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** and add your OpenAI API key:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_OPENAI_MODEL=gpt-3.5-turbo
   VITE_OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will open at `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤖 AI Assistance

The AI assistance feature uses OpenAI's GPT model to help applicants write their situation descriptions.

### Configuration

Set the following environment variables:
- `VITE_OPENAI_API_KEY` - Your OpenAI API key
- `VITE_OPENAI_MODEL` - Model to use (default: gpt-3.5-turbo)
- `VITE_OPENAI_ENDPOINT` - API endpoint (default: https://api.openai.com/v1/chat/completions)

### How It Works

1. Click "Help Me Write" button on any textarea in Step 3
2. AI generates content based on context and field type
3. Preview the generated text
4. Accept, Edit, or Discard the suggestion

## 🔒 Data Persistence

- Form data is automatically saved to LocalStorage on every change
- Data persists across browser refresh
- "Clear Saved Application" button removes all saved data

## 📝 API

The application uses JSONPlaceholder as a mock API for demonstration:

```typescript
POST /posts
{
  title: "Application: [Full Name]",
  body: JSON.stringify(formData),
  userId: 1
}
```

## 🎯 Accessibility

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly

## 📱 Responsive Breakpoints

| Breakpoint | Size |
|-----------|------|
| xs | 0px - 599px |
| sm | 600px - 899px |
| md | 900px - 1199px |
| lg | 1200px+ |

## 🧪 Testing

```bash
npm run lint    # Run ESLint
npm run build   # Build for production
```

## 📄 License

MIT License

## 👥 Authors

- Senior Frontend Developer

## 🙏 Acknowledgments

- Material UI for components
- React Hook Form for form handling
- Redux Toolkit for state management
- OpenAI for AI assistance
# Environment Variables for Social Support AI Portal

# ============================================
# OPENAI API CONFIGURATION
# ============================================
# Get your API key from: https://platform.openai.com/api-keys
# The AI assistance feature will be disabled if this is not set.

VITE_OPENAI_API_KEY=sk-your-api-key-here

# Optional: Override the default model (gpt-3.5-turbo, gpt-4, etc.)
VITE_OPENAI_MODEL=gpt-3.5-turbo

# Optional: Override the API endpoint (useful for proxies/testing)
VITE_OPENAI_ENDPOINT=https://api.openai.com/v1/chat/completions
