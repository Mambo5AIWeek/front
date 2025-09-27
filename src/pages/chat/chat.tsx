import { ChatInput } from "@/components/custom/chatinput";
import { PreviewMessage, ThinkingMessage } from "../../components/custom/message";
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { useState } from "react";
import { message } from "../../interfaces/interfaces"
import { Overview } from "@/components/custom/overview";
import { Header } from "@/components/custom/header";
import {v4 as uuidv4} from 'uuid';
import { sampleForms, FormData } from "@/components/custom/form";

// WebSocket functionality removed - now using REST API for disease prediction

export function Chat() {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
  const [messages, setMessages] = useState<message[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [formCompleted, setFormCompleted] = useState<boolean>(false);

  // Removed WebSocket functionality - now using REST API

async function handleSubmit(text?: string) {
  if (isLoading) return;

  const messageText = text || question;
  console.log('💬 User typed message:', messageText);
  setIsLoading(true);
  
  const traceId = uuidv4();
  setMessages(prev => [...prev, { content: messageText, role: "user", id: traceId }]);
  setQuestion("");

  // Call disease prediction API for symptom analysis
  setTimeout(async () => {
    console.log('🔄 Processing user message for symptoms:', messageText);
    await processDiseasePrediction(messageText);
    setIsLoading(false);
  }, 1000); // Brief delay for better UX

  // Now using REST API instead of WebSocket
}

  // Function to create and display a form as chatbot output
  const createFormMessage = (formData: FormData) => {
    const traceId = uuidv4();
    const formMessage: message = {
      content: '',
      role: 'assistant',
      id: traceId,
      type: 'form',
      formData: formData
    };
    setMessages(prev => [...prev, formMessage]);
  };

  // Form parsing removed - forms are now handled directly

  // Function to handle consent acceptance
  const handleConsentAccepted = () => {
    // Add combined acceptance and question message
    const combinedTraceId = uuidv4();
    const combinedMessage: message = {
      content: 'Gracias. Iniciaré con algunas preguntas sobre sus síntomas y antecedentes.\n\n\n\n¿Cuál es el motivo principal de su consulta hoy?',
      role: 'assistant',
      id: combinedTraceId,
      type: 'text'
    };
    
    setMessages(prev => [...prev, combinedMessage]);
    setConsentAccepted(true);
  };

  // Function to handle consent decline
  const handleConsentDeclined = () => {
    const declineTraceId = uuidv4();
    const declineMessage: message = {
      content: 'Comprendo y respeto su decisión. No continuaré con la interacción. Si necesita orientación médica, por favor contacte a un profesional de la salud o a los servicios de urgencias en caso de síntomas graves. Que tenga buen día.',
      role: 'assistant',
      id: declineTraceId,
      type: 'text'
    };
    
    setMessages(prev => [...prev, declineMessage]);
  };

  // Function to handle form submission completion
  const handleFormSubmitted = () => {
    setFormCompleted(true);
  };

  // Function to show medical consent form (primary use case)
  const showMedicalConsentForm = () => {
    createFormMessage(sampleForms.medicalConsentForm);
  };

  // Function to extract symptoms from user message
  const extractSymptomsFromMessage = (message: string): string[] => {
    const lowerMessage = message.toLowerCase();
    
    // Comprehensive symptom dictionary with variations
    const symptomPatterns = {
      // Headache/Pain symptoms
      'headache': ['dolor de cabeza', 'headache', 'cefalea', 'migraña', 'migraine', 'me duele la cabeza', 'cabeza me duele'],
      'sore throat': ['dolor de garganta', 'sore throat', 'garganta irritada', 'throat pain', 'me duele la garganta'],
      'stomach pain': ['dolor abdominal', 'stomach pain', 'dolor de estómago', 'dolor de barriga', 'me duele el estómago'],
      'muscle pain': ['dolor muscular', 'muscle pain', 'dolor de músculos', 'músculos doloridos', 'body aches'],
      'joint pain': ['dolor articular', 'joint pain', 'dolor de articulaciones', 'articulaciones doloridas'],
      'chest pain': ['dolor en el pecho', 'chest pain', 'dolor torácico', 'me duele el pecho'],
      'back pain': ['dolor de espalda', 'back pain', 'espalda dolorida', 'me duele la espalda'],
      
      // Fever/Temperature symptoms  
      'fever': ['fiebre', 'fever', 'temperatura alta', 'calentura', 'tengo fiebre', 'me siento con fiebre'],
      'chills': ['escalofríos', 'chills', 'temblores de frío', 'tengo escalofríos', 'me dan escalofríos'],
      
      // Respiratory symptoms
      'cough': ['tos', 'cough', 'toser', 'tengo tos', 'me da tos', 'tos seca', 'tos con flema'],
      'shortness of breath': ['dificultad para respirar', 'shortness of breath', 'falta de aire', 'me falta el aire'],
      'nasal congestion': ['congestión nasal', 'nasal congestion', 'nariz tapada', 'congestión', 'tengo la nariz tapada'],
      'runny nose': ['secreción nasal', 'runny nose', 'nariz que gotea', 'mucosidad nasal'],
      
      // Gastrointestinal symptoms
      'nausea': ['náuseas', 'nausea', 'ganas de vomitar', 'tengo náuseas', 'me dan náuseas'],
      'vomiting': ['vómito', 'vomiting', 'vomitar', 'he vomitado', 'tengo vómitos'],
      'diarrhea': ['diarrea', 'diarrhea', 'deposiciones líquidas', 'tengo diarrea'],
      'constipation': ['estreñimiento', 'constipation', 'no puedo defecar', 'estreñido'],
      'loss of appetite': ['pérdida de apetito', 'loss of appetite', 'no tengo hambre', 'sin apetito'],
      
      // Neurological symptoms
      'dizziness': ['mareo', 'dizziness', 'vertigo', 'me mareo', 'tengo mareos'],
      'confusion': ['confusión', 'confusion', 'me siento confundido', 'desorientado'],
      
      // General symptoms
      'fatigue': ['fatiga', 'cansancio', 'tired', 'exhausted', 'me siento cansado', 'agotamiento', 'sin energía'],
      'weakness': ['debilidad', 'weakness', 'me siento débil', 'sin fuerzas'],
      'sweating': ['sudoración', 'sweating', 'sudor', 'sudo mucho', 'transpiración excesiva'],
      'insomnia': ['insomnio', 'insomnia', 'no puedo dormir', 'problemas para dormir', 'desvelo'],
      'rash': ['sarpullido', 'rash', 'erupciones en la piel', 'manchas en la piel', 'irritación cutánea'],
      'itching': ['picazón', 'itching', 'comezón', 'me pica', 'prurito']
    };

    const foundSymptoms = new Set<string>();
    
    // Check for each symptom pattern
    Object.entries(symptomPatterns).forEach(([symptom, patterns]) => {
      patterns.forEach(pattern => {
        if (lowerMessage.includes(pattern.toLowerCase())) {
          foundSymptoms.add(symptom);
        }
      });
    });

    // Convert set to array
    let symptomsArray = Array.from(foundSymptoms);
    
    // If no specific symptoms found, use the entire message but clean it up
    if (symptomsArray.length === 0) {
      // Remove common conversational phrases to focus on symptoms
      let cleanMessage = message
        .replace(/^(tengo|me siento|siento|I have|I feel|I am experiencing)/i, '')
        .replace(/por favor|please|ayuda|help/gi, '')
        .trim();
      
      if (cleanMessage.length > 0) {
        symptomsArray = [cleanMessage];
      } else {
        symptomsArray = [message.trim()];
      }
    }

    return symptomsArray;
  };

  // Function to call the real disease prediction API
  const callDiseaseAPI = async (symptoms: string[]) => {
    try {
      const requestBody = {
        symptoms: symptoms,
        confidence_threshold: 0.0
      };
      console.log('🌐 Making POST request to API:', requestBody);
      
      const response = await fetch('https://aiweek.jguevara.dev/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling disease API:', error);
      throw error;
    }
  };

  // Function to process API response and show disease chart
  const processDiseasePrediction = async (userMessage: string) => {
    try {
      // Extract symptoms from user message
      const symptoms = extractSymptomsFromMessage(userMessage);
      console.log('🔍 Extracted symptoms:', symptoms);
      
      // Call the API
      console.log('📡 Calling API with symptoms:', symptoms);
      const apiResponse = await callDiseaseAPI(symptoms);
      console.log('✅ API response received:', apiResponse);
      
      // Transform API response to our chart format
      const diseaseData = apiResponse.predictions.map(([name, probability]: [string, number]) => ({
        name,
        probability: probability * 100 // Convert to percentage
      }));

      // Create response message
      const responseTraceId = uuidv4();
      let content = `He analizado los síntomas que describió usando inteligencia artificial médica.

**📋 Síntomas procesados:** ${symptoms.join(', ')}

**🔬 Análisis de IA completado**

A continuación se muestran los diagnósticos más probables según la evaluación de síntomas:`;

      // Add information about unrecognized symptoms if any
      if (apiResponse.unrecognized_symptoms && apiResponse.unrecognized_symptoms.length > 0) {
        content += `\n\n⚠️ **Síntomas no reconocidos:** ${apiResponse.unrecognized_symptoms.join(', ')}`;
      }

      const responseMessage: message = {
        content,
        role: 'assistant',
        id: responseTraceId,
        type: 'chart',
        diseaseData: diseaseData
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
    } catch (error) {
      // Handle API errors
      const errorTraceId = uuidv4();
      const errorMessage: message = {
        content: `⚠️ **Error de conexión**

Lo siento, no pude procesar su consulta en este momento. Esto puede deberse a:

• Problema de conectividad con el servidor de análisis
• Mantenimiento temporal del sistema de IA médica

**💡 Qué puede hacer:**
1. Verifique su conexión a internet
2. Intente nuevamente en unos minutos  
3. Si el problema persiste, contacte a un profesional de la salud

**⚡ Para emergencias médicas, contacte servicios de urgencia inmediatamente.**`,
        role: 'assistant',
        id: errorTraceId,
        type: 'text'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <Header/>
      <div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4" ref={messagesContainerRef}>
        {messages.length == 0 && <Overview onShowForm={showMedicalConsentForm} />}
        {messages.map((message, index) => (
          <PreviewMessage 
            key={index} 
            message={message} 
            onConsentAccepted={handleConsentAccepted}
            onConsentDeclined={handleConsentDeclined}
            onFormSubmitted={handleFormSubmitted}
          />
        ))}
        {isLoading && <ThinkingMessage />}
        <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]"/>
      </div>
      {consentAccepted && formCompleted && (
        <div className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <ChatInput  
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};
