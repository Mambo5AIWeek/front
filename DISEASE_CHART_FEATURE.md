# Disease Diagnosis Chart Feature

## Overview
This feature displays disease probabilities as interactive bar charts by integrating with a real AI disease prediction API. Users can describe symptoms in natural language, and the system will analyze them using the API at `https://aiweek.jguevara.dev/predict` and display the results visually.

## API Integration

### Endpoint
- **URL:** `https://aiweek.jguevara.dev/predict`
- **Method:** POST
- **Content-Type:** application/json

### Request Format
```json
{
  "symptoms": ["headache", "fever", "fatigue"],
  "confidence_threshold": 0.0
}
```

### Response Format
```json
{
  "predictions": [["Disease Name", 0.785], ["Another Disease", 0.652]],
  "unrecognized_symptoms": ["unknown symptom"]
}
```

## Components Added

### 1. DiseaseChart Component (`src/components/custom/disease-chart.tsx`)
- Renders a responsive bar chart using Recharts library
- Shows top 5 diseases with highest probabilities
- Includes custom tooltips and professional medical styling
- Automatically sorts diseases by probability

### 2. Updated Message Interface
- Added `diseaseData?: DiseaseData[]` to message interface
- Added `'chart'` as a new message type
- Support for rendering chart messages in chat

### 3. Real API Integration
Two ways to test the feature:

#### Option 1: Test Button (Easiest)
1. Open the app
2. Click "Test Diagnóstico IA" button on the welcome screen
3. Sends test symptoms: "dolor de cabeza intenso, fiebre alta, fatiga extrema"
4. Real API call is made and chart displays actual results

#### Option 2: Natural Symptom Description
1. Complete the medical consent form first
2. Type any symptoms in Spanish or English (e.g., "tengo dolor de cabeza y fiebre")
3. System extracts symptoms and calls the API
4. Results displayed as interactive chart

## Symptom Extraction Logic
The system includes intelligent symptom extraction that:

1. **Recognizes common symptoms in Spanish and English:**
   - dolor de cabeza, headache, cefalea, migraña
   - fiebre, fever, temperatura
   - tos, cough, toser
   - fatiga, cansancio, tired
   - náuseas, nausea, vómito
   - And many more...

2. **Fallback handling:** If no specific symptoms are recognized, uses the entire message as a symptom description

3. **API Error Handling:** Gracefully handles network errors and API failures

## Real-time API Usage
The system now:
1. ✅ Makes actual HTTP POST requests to the disease prediction API
2. ✅ Processes real symptom analysis
3. ✅ Displays genuine probability calculations
4. ✅ Handles unrecognized symptoms
5. ✅ Shows appropriate error messages for API failures

## Dependencies
- `recharts` - For creating interactive bar charts
- Existing `@/components/ui/card` - For chart container styling

## Future Enhancements
- Multiple chart types (pie charts, horizontal bars)
- Export chart functionality
- Animation transitions
- Confidence intervals
- Severity indicators