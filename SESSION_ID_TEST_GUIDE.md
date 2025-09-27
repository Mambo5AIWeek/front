# Session ID Management Test Guide

## Overview
The session ID from the API response is now properly managed and included in every subsequent request to maintain conversation continuity.

## How It Works

### **First Message (No Session ID)**
```json
Request:
{
  "message": "I have a headache"
}

Response:
{
  "response": "I'm sorry to hear about your headache...",
  "session_id": "abc123def456",
  "conversation_complete": false,
  "timestamp": "2025-09-27T15:30:00Z"
}
```

### **Subsequent Messages (With Session ID)**
```json
Request:
{
  "message": "It started this morning",
  "session_id": "abc123def456"
}

Response:
{
  "response": "Thank you for that information...",
  "session_id": "abc123def456", 
  "conversation_complete": false,
  "timestamp": "2025-09-27T15:31:00Z"
}
```

## Visual Indicators

### **Session Status Display**
When a session is active, you'll see:
```
💬 Conversación activa - ID: def456
[Chat Input Box]
```
- Shows last 8 characters of session ID
- Appears above the chat input
- Only visible when session is active

### **Console Logging**
Open browser DevTools (F12) to see:

**First message:**
```
🆕 New conversation - no session ID yet
🌐 Making POST request to chat API: {"message": "I have a headache"}
✅ Chat API response received: {...}
📝 Session ID updated: abc123def456
```

**Second message:**
```
🔗 Including session ID in request: abc123def456
🌐 Making POST request to chat API: {"message": "It started this morning", "session_id": "abc123def456"}
✅ Chat API response received: {...}
🔄 Session ID confirmed: abc123def456
```

## Testing Steps

### **Step 1: Start Conversation**
1. Complete consent and medical forms
2. Type first message: "I have a headache and fever"
3. Check console for "🆕 New conversation - no session ID yet"
4. Watch for "📝 Session ID updated: [session-id]"
5. Note the session indicator appears above chat input

### **Step 2: Continue Conversation**
1. Type second message: "The pain is behind my eyes"
2. Check console for "🔗 Including session ID in request: [session-id]"
3. Verify same session ID is sent in request
4. Confirm "🔄 Session ID confirmed: [session-id]"

### **Step 3: Verify Session Continuity**
1. Send multiple messages in sequence
2. Each should include the same session_id in the request
3. AI responses should reference previous context
4. Session indicator should show consistent ID

## Key Improvements

### ✅ **Proper Session Management:**
- **Always updates** session ID when API provides one
- **Includes session ID** in every request after the first
- **Maintains continuity** across the entire conversation

### ✅ **Enhanced Logging:**
- Shows when session ID is included vs. new conversation
- Displays session updates vs. confirmations
- Full request/response logging for debugging

### ✅ **Visual Feedback:**
- Session indicator shows active conversation
- Displays abbreviated session ID for reference
- Only appears when session is active

### ✅ **Robust Error Handling:**
- Handles missing session IDs gracefully
- Updates session ID if API provides a new one
- Maintains conversation state properly

## Expected Behavior

### **Conversation Flow:**
```
User Message 1 → No session_id sent → API creates session → session_id stored
User Message 2 → session_id sent → API continues conversation → session_id confirmed
User Message 3 → session_id sent → API continues conversation → session_id confirmed
...
```

### **Session Persistence:**
- Session ID persists for entire conversation
- All messages after the first include the session ID
- AI maintains full context from previous messages
- Conversation continues until marked complete

## Troubleshooting

### **If session ID not appearing:**
- Check browser console for error messages
- Verify API is returning session_id in response
- Ensure network requests are successful

### **If conversation loses context:**
- Check that session_id is being sent in requests
- Verify same session_id across all messages
- Look for API errors that might reset the session

**Session ID management is now fully operational! 🎯**