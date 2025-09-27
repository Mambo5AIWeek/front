# Chatbot Forms Feature

This documentation explains how to use the dynamic forms feature in your chatbot application.

## Overview

The chatbot now supports displaying interactive forms as responses. Users can fill out these forms and submit data back to the system.

## Form Structure

Forms are defined using the `FormData` interface:

```typescript
interface FormData {
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
}
```

## Usage Methods

### 1. Programmatic Form Creation

You can create forms programmatically in your React components:

```typescript
import { sampleForms } from "@/components/custom/form";

// Display a contact form
const showContactForm = () => {
  createFormMessage(sampleForms.contactForm);
};
```

### 2. Backend JSON Response

Your backend can send form definitions as JSON within special tags. The format is:

```
[FORM]
{
  "title": "User Registration",
  "description": "Please fill out your information",
  "fields": [
    {
      "id": "name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "placeholder": "Enter your email"
    }
  ],
  "submitText": "Register"
}
[/FORM]
```

The chatbot will automatically parse this JSON and render it as an interactive form.

## Supported Field Types

- **text**: Basic text input
- **email**: Email input with validation
- **password**: Password input (hidden text)
- **number**: Numeric input
- **tel**: Telephone number input
- **url**: URL input
- **textarea**: Multi-line text area
- **select**: Dropdown selection with options

## Form Validation

The form component includes built-in validation:
- Required field validation
- Email format validation
- Real-time error display

## Sample Forms

Three pre-configured sample forms are available:

1. **Contact Form** (`sampleForms.contactForm`)
   - Name, email, phone, message fields
   
2. **Registration Form** (`sampleForms.registrationForm`)
   - Username, email, password, country selection
   
3. **Survey Form** (`sampleForms.surveyForm`)
   - Rating, recommendation, comments

## Integration Example

To trigger a form from your chatbot backend, simply send a response containing the form JSON wrapped in `[FORM]` tags:

```python
# Python backend example
form_json = {
    "title": "Contact Information",
    "fields": [
        {
            "id": "name",
            "label": "Name", 
            "type": "text",
            "required": True
        }
    ]
}

response = f"Please fill out this form:\n[FORM]{json.dumps(form_json)}[/FORM]"
websocket.send(response)
```

## Form Submission Handling

When a user submits a form, the data is logged to the console by default. You can customize the submission behavior by providing an `onFormSubmit` callback or implementing custom logic in the `ChatForm` component.

The submitted data is in the format:
```typescript
{
  "fieldId1": "value1",
  "fieldId2": "value2",
  // ... more field values
}
```

## Styling

Forms use Tailwind CSS classes and shadcn/ui components for consistent styling that matches your application theme. They automatically adapt to light/dark themes.

## Try It Out

1. Start the application
2. On the welcome screen, click "Show Sample Form" to see a demo
3. Or send a message that triggers your backend to respond with a form JSON