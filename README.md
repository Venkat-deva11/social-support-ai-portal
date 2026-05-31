# Social Support AI Portal

A production-ready React application for government social support portal that allows citizens to apply for financial assistance through a multi-step application wizard with AI-assisted writing support.

## 🚀 Features

- **3-Step Application Wizard**: Personal Information → Family & Financial Information → Situation Descriptions
- **AI Writing Assistance**: OpenAI GPT-powered "Help Me Write" feature for narrative fields
- **Multi-language Support**: English and Arabic with full RTL support
- **Auto-save**: Form progress is automatically saved to LocalStorage
- **Form Validation**: Comprehensive validation using Zod
- **Accessible**: ARIA labels, keyboard navigation, screen reader support
- **Responsive Design**: Mobile, tablet, and desktop support

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

## 📁 Project Structure

```
src/
├── app/
│   └── store.ts                 # Redux store configuration
├── components/
│   ├── ai/
│   │   └── AIAssistanceModal.tsx # AI assistance modal component
│   ├── forms/
│   │   ├── FamilyFinancialForm.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   └── SituationDescriptionsForm.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── Header.tsx
│   └── wizard/
│       ├── ApplicationStepper.tsx
│       └── WizardNavigation.tsx
├── constants/
│   └── index.ts                 # Application constants
├── content/
│   └── sitecore.json            # Sitecore-like content repository
├── features/
│   ├── application/
│   │   └── applicationSlice.ts  # Redux slice for application state
│   └── ui/
│       └── uiSlice.ts           # Redux slice for UI state
├── hooks/
│   └── useSitecoreContent.ts    # Custom hook for content access
├── i18n/
│   └── index.ts                 # i18n configuration
├── pages/
│   ├── ApplicationWizard.tsx    # Main wizard page
│   └── SuccessPage.tsx          # Success page after submission
├── routes/
├── services/
│   ├── api/
│   │   └── apiService.ts        # API service for submission
│   └── openai/
│       └── openaiService.ts     # OpenAI service for AI assistance
├── theme/
│   └── index.ts                 # MUI theme configuration
├── types/
│   └── index.ts                 # TypeScript type definitions
└── utils/
    ├── sitecoreContentHelper.ts # Content helper utility
    ├── storage.ts               # LocalStorage utility
    └── validation.ts            # Zod validation schemas
```

## 🎨 Configuration

### Theme Colors (src/theme/index.ts)

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#0052CC` | Buttons, links, headers |
| Secondary | `#36B37E` | Success states, secondary actions |
| Background | `#F4F6F8` | Page background |
| Paper | `#FFFFFF` | Cards, dialogs |

### Form Validation Limits

| Field | Min | Max |
|-------|-----|-----|
| Full Name | 3 chars | 100 chars |
| National ID | 8 chars | 20 chars |
| Address | 10 chars | - |
| Textarea (Step 3) | 50 chars | 2000 chars |

## 🌐 Internationalization

The application supports:
- **English (en)** - Default language
- **Arabic (ar)** - Full RTL support

To change language, use the language switcher in the header.

### Adding Translations

Translations are managed in `src/content/sitecore.json`:
- `en.pages` - English content
- `ar.pages` - Arabic content

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