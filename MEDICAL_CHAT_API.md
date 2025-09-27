# Medical Chat API Integration

## Overview
The chatbox now integrates with the Medical Diagnosis API for conversational medical assistance. This provides a more natural, interactive diagnostic experience.

## API Details

### Endpoint
- **URL:** `https://aiweek.jguevara.dev/chat`
- **Method:** POST
- **Content-Type:** application/json

### Request Format
```json
{
  "message": "I have a headache and fever",
  "session_id": "optional-session-id-for-conversation-continuity"
}
```

### Response Format
```json
{
  "response": "Thank you for sharing your symptoms. Can you tell me more about...",
  "session_id": "unique-session-identifier",
  "conversation_complete": false,
  "timestamp": "2025-09-27T14:30:00Z"
}
```

## Key Features

### ✅ **Session Management**
- Maintains conversation context across messages
- Session ID automatically stored and sent with subsequent messages
- Enables multi-turn diagnostic conversations

### ✅ **Natural Language Processing**
- Send complete messages directly to the AI
- No need for symptom extraction - AI handles natural language
- Supports conversational flow and follow-up questions

### ✅ **Conversation Tracking**
- `conversation_complete` flag indicates when diagnosis is finished
- Timestamped responses for conversation history
- Real-time conversation status logging

## User Experience

### **Step 1: Complete Forms**
1. Fill out consent form
2. Complete medical information
3. Chatbox becomes available

### **Step 2: Start Conversation**
User types natural messages like:
```
"I have a severe headache and feel nauseous"
"The pain started this morning and is getting worse"
"I also feel dizzy when I stand up"
```

### **Step 3: AI Responds**
- AI asks follow-up questions
- Provides medical guidance
- Continues conversation until diagnosis complete

### **Step 4: Session Continuity**
- Each message builds on previous context
- AI remembers earlier symptoms and responses
- Natural diagnostic interview flow

## Technical Implementation

### **Chat Flow:**
```
User types message → POST to /chat → AI processes → Response displayed → Continue conversation
```

### **Session Management:**
```
1st message: No session_id → API creates new session
2nd+ messages: Includes session_id → AI continues conversation
```

### **Error Handling:**
- Network errors: User-friendly error messages
- API errors: Fallback to retry instructions
- Session loss: Graceful degradation

## Console Logging

When testing, check browser DevTools for:
- `💬 User typed message: [message]`
- `🌐 Making POST request to chat API: {...}`
- `✅ Chat API response received: {...}`
- `📝 Session ID stored: [session-id]`
- `🔄 Medical conversation continues...`
- `✅ Medical conversation completed`

## Testing Instructions

1. **Open:** http://localhost:8505
2. **Complete consent and medical forms**
3. **Start chatting naturally:**
   - "I have a headache and fever"
   - "The pain is behind my eyes"
   - "It started yesterday evening"
4. **Follow AI's questions**
5. **Continue until diagnosis complete**

## Important Notes

- **Conversational:** No need to extract symptoms - just chat naturally
- **Contextual:** AI remembers previous messages in the session
- **Interactive:** AI will ask follow-up questions for better diagnosis
- **Complete:** Conversation continues until AI has enough information
- **Safe:** Always includes medical disclaimers and professional advice recommendations

## Advantages Over Previous API

### **Before (Predict API):**
- Single request/response
- Required symptom extraction
- Chart-based results only
- No conversation context

### **Now (Chat API):**
- ✅ Multi-turn conversations
- ✅ Natural language processing
- ✅ Session continuity
- ✅ Interactive diagnosis
- ✅ Follow-up questions
- ✅ Contextual responses

**Ready for natural medical conversations! 🩺💬**