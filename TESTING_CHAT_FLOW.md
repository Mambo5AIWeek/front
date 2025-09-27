# Testing the Chat Symptom Flow

## Step-by-Step Test Instructions

### 1. Open the Application
- Go to: http://localhost:8504
- You should see the welcome screen

### 2. Complete the Consent Process
- Click "Iniciar Anamnesis" 
- Read and click "Acepto" on the consent form
- Fill out the medical information form
- Submit the form

### 3. Use the Chatbox
- After completing the form, the chatbox should appear at the bottom
- Type any of these test messages:

**Test Messages:**
```
tengo dolor de cabeza y fiebre
```
```
I have a headache and fever
```
```
dolor de garganta y tos
```
```
nausea and fatigue
```

### 4. Expected Behavior
1. **User message appears** in chat
2. **Loading indicator** shows while processing
3. **API call is made** to https://aiweek.jguevara.dev/predict
4. **Assistant response** appears with:
   - Text explaining what symptoms were analyzed
   - **Interactive chart** showing disease probabilities
   - Top 5 diseases with percentages

### 5. Check Browser Console
- Press F12 to open Developer Tools
- Look for console messages:
  - `🔍 Extracted symptoms: [...]`
  - `📡 Calling API with symptoms: [...]`
  - `🌐 Making POST request to API: {...}`
  - `✅ API response received: {...}`

### 6. What You Should See
- Chart with disease names on X-axis
- Probability percentages on Y-axis
- Hover tooltips showing exact percentages
- Professional medical styling

## Troubleshooting

If the chat doesn't appear:
- Make sure you clicked "Acepto" on consent
- Make sure you submitted the medical form
- Check that `consentAccepted` and `formCompleted` are both true

If no chart appears:
- Check browser console for errors
- Verify API is accessible at https://aiweek.jguevara.dev/predict
- Check network tab in DevTools for API calls

## Current Implementation Status: ✅ READY

The system is configured to:
- ✅ Extract symptoms from chat messages
- ✅ Send POST requests to the real API
- ✅ Process JSON responses  
- ✅ Display interactive charts
- ✅ Handle errors gracefully