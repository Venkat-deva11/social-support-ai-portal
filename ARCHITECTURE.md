# Architecture & Design Notes

## Overview

This document explains the architecture decisions, design patterns, and technical choices made during the development of the Social Support AI Portal.

---

## Architecture Decisions

### 1. Sitecore-Inspired Content Architecture

**Decision**: Implemented a local JSON-based content management system inspired by Sitecore's architecture, rather than integrating with a real Sitecore CMS.

**Rationale**:
- Reduces external dependencies for the review prototype
- Enables content editors to modify labels, placeholders, and error messages without code changes
- Provides a clear separation between content and presentation
- Mirrors real-world enterprise CMS patterns

**Implementation**:
- Content stored in `src/content/sitecore.json`
- Types defined in `src/types/sitecore.ts`
- Access via `useSitecoreContent()` hook and helper utilities

**Content Structure**:
```json
{
  "en": {
    "common": { "submit": "Submit", "next": "Next", ... },
    "pages": {
      "personal-information-page": {
        "title": "Personal Information",
        "fields": {
          "fullName": { "label": "Full Name", "placeholder": "...", "errorMessage": "..." }
        }
      }
    }
  },
  "ar": { ... }
}
```

**Future Improvement**: Replace with actual Sitecore CMS integration using the Sitecore JavaScript Services (JSS) SDK.

---

### 2. Redux for State Management

**Decision**: Used Redux Toolkit for centralized state management instead of React Context or component-local state.

**Rationale**:
- Centralized application state (form data, current step, submission status)
- Easy to persist and restore from localStorage
- Familiar patterns for complex form wizard state
- Redux DevTools support for debugging

**State Slices**:
- `applicationSlice`: Form data, wizard step, submission state, language preference
- `uiSlice`: UI state (future expansion)

**Future Improvement**: Consider React Query for server state if a real backend API is added.

---

### 3. React Hook Form + Yup Validation

**Decision**: Combined React Hook Form for form management with Yup for schema validation.

**Rationale**:
- React Hook Form: Performance (uncontrolled inputs), easy validation integration
- Yup: Declarative schema validation with internationalized error messages
- Natural separation: form handling vs validation rules

**Validation Schema per Step**:
- Step 1: `PersonalInfoSchema` - name (3-100 chars), national ID (8-20 alphanumeric), age 18+, phone regex
- Step 2: `FamilyFinancialSchema` - marital status required, income >= 0, dependents >= 0
- Step 3: `SituationDescriptionsSchema` - min 50 chars, max 2000 chars per field

**Future Improvement**: Add field-level async validation (e.g., checking if national ID already exists).

---

### 4. AI Integration Pattern

**Decision**: Implemented AI assistance as an optional modal overlay on textarea fields.

**Rationale**:
- Non-intrusive: User chooses whether to use AI assistance
- Transparent: User can accept, edit, or discard AI suggestions
- Educational: Helps users who may not know what to write

**AI Service Design**:
```
generateText(fieldType, familyFinancialInfo)
  └── Builds prompt with applicant's employment/income context
  └── Calls OpenAI API with system prompt (first-person, professional tone)
  └── Returns generated text or error
```

**Prompt Strategy**:
- System prompt instructs AI to write in first person as the applicant
- User prompt includes context (employment status, income) for personalized content
- Temperature 0.3 for factual, professional output

**Future Improvement**: 
- Add support for more AI models (GPT-4, Claude)
- Implement streaming responses for longer生成
- Add AI usage analytics

---

### 5. Bilingual Support (i18n)

**Decision**: Used i18next for internationalization with full RTL support for Arabic.

**Implementation**:
- Language stored in Redux state
- Direction set on `<html>` element for CSS RTL support
- MUI CacheProvider for RTL/LTR-aware styling
- All user-facing strings loaded from `sitecore.json`

**RTL Considerations**:
- MUI components automatically flip in RTL mode
- Custom CSS uses logical properties (`margin-inline-start` vs `margin-left`)
- Icons that imply direction are mirrored

**Future Improvement**: 
- Add more languages (French, Urdu, etc.)
- Language detection from browser settings
- RTL-aware validation messages

---

### 6. Auto-Save to localStorage

**Decision**: Implemented debounced auto-save (500ms) to localStorage on every field change.

**Rationale**:
- Prevents data loss from browser crashes or accidental refresh
- Improves UX with seamless progress restoration
- Simple implementation without backend requirements

**Stored Data**:
```json
{
  "currentStep": 1,
  "formData": { "personalInfo": {...}, "familyFinancialInfo": {...}, "situationDescriptions": {...} },
  "language": "en",
  "savedAt": "2025-01-15T10:30:00Z"
}
```

**Future Improvement**:
- Add encryption for sensitive data
- Support multiple saved applications
- Sync across tabs

---

## Component Architecture

### Form Wizard Pattern

```
ApplicationWizard (Page)
└── ApplicationStepper (Progress indicator)
    ├── Step 1: PersonalInfoForm (forwardRef, imperative handle)
    ├── Step 2: FamilyFinancialForm (forwardRef, imperative handle)
    └── Step 3: SituationDescriptionsForm (forwardRef, imperative handle)
        └── AIAssistanceModal (triggered by "Help Me Write" button)
```

**Decoupling**: Each form step is an independent component that exposes `triggerValidation()` via `useImperativeHandle`. The parent wizard calls validation before allowing navigation to the next step.

---

## Design Patterns Used

| Pattern | Location | Purpose |
|---------|----------|---------|
| Slice Pattern | `features/application/` | Organized Redux state |
| Custom Hooks | `hooks/useSitecoreContent.ts` | Content access abstraction |
| Provider Pattern | `App.tsx` | Redux, Theme, i18n providers |
| forwardRef + useImperativeHandle | Form components | Parent-child validation coordination |
| Content-Label Separation | All forms | Labels from JSON, not hardcoded |
| Debounced Auto-save | `utils/storage.ts` | Prevent excessive localStorage writes |

---

## Future Improvements

### High Priority
1. **Real Backend API**: Replace JSONPlaceholder with actual social support application API
2. **Session Management**: Add user authentication and session handling
3. **File Uploads**: Support document attachments (ID copies, proof of income)
4. **Admin Dashboard**: Reviewers need a separate interface to view applications

### Medium Priority
5. **Analytics**: Track completion rates, drop-off points, AI usage
6. **Email Notifications**: Confirm submission to applicant, notify reviewers
7. **Accessibility Audit**: WCAG 2.1 AA compliance review
8. **Performance**: Code-splitting per wizard step

### Low Priority (Nice to Have)
9. **Dark Mode**: User preference for theme
10. **Progress Sharing**: Generate shareable link to continue later
11. **Draft Sharing**: Allow caseworkers to review drafts
12. **Multi-Language AI**: Generate content in Arabic when user is in Arabic mode

---

## Sitecore Integration Notes

This project uses a **Sitecore-inspired** architecture, not actual Sitecore CMS. For production with real Sitecore:

### Recommended Sitecore Architecture

```
Sitecore Instance (XM Cloud or On-Premises)
├── Content Editor: Manage labels, error messages, page content
├── Layout Service: Headless delivery API
└── JSS App: Next.js/React app consuming Sitecore APIs

Recommended Modules:
├── Sitecore Forms: For form field definitions
├── Sitecore JavaScript Services (JSS): For React integration
├── Sitecore GraphQL: For content delivery
└── Sitecore Edge: For multi-channel delivery
```

### Migration Path

1. Replace `src/content/sitecore.json` with Sitecore Layout Service calls
2. Use `sitecore-jss` or `@sitecore-feaas/nextjs` for component rendering
3. Update `useSitecoreContent` hook to fetch from Sitecore GraphQL API
4. Keep form validation and state management as-is (Sitecore Forms can generate JSON schemas)

### Current vs Sitecore Architecture

| Aspect | Current Implementation | Sitecore Production |
|--------|------------------------|---------------------|
| Content Storage | Local JSON file | Sitecore CMS Database |
| Content Delivery | Direct file read | Layout Service REST API |
| Multilingual | i18next with JSON | Sitecore Language Fallback |
| Content Editing | Code change required | Sitecore Content Editor |
| Caching | None (localStorage) | Sitecore Caching + CDN |
| Deployment | Static file hosting | Sitecore Managed Cloud |

---

## Security Considerations

1. **API Key Storage**: OpenAI key stored in `.env` (not committed to git)
2. **Form Validation**: All inputs validated client-side with Yup, should be validated server-side
3. **XSS Prevention**: React auto-escapes rendered content
4. **CSRF**: Not applicable (no authenticated sessions in prototype)
5. **Data Privacy**: Form data stored in localStorage (user's browser only)

**Recommendations for Production**:
- Move OpenAI calls to backend to hide API key
- Add rate limiting on API endpoints
- Implement HTTPS-only
- Add CAPTCHA to prevent automated submissions
- Encrypt localStorage data for sensitive fields

---

## Performance Optimizations

Current implementation includes:
- Vite for fast development builds
- React Hook Form (uncontrolled inputs, minimal re-renders)
- Debounced localStorage writes (500ms)

Potential improvements:
- Lazy load wizard steps
- Memoize AI prompt construction
- Add service worker for offline support
- Optimize MUI bundle with tree-shaking
