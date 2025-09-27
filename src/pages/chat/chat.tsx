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
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Removed WebSocket functionality - now using REST API

async function handleSubmit(text?: string) {
  if (isLoading) return;

  const messageText = text || question;
  console.log('💬 User typed message:', messageText);
  setIsLoading(true);
  
  const traceId = uuidv4();
  setMessages(prev => [...prev, { content: messageText, role: "user", id: traceId }]);
  setQuestion("");

  // Call medical chat API for conversational diagnosis
  setTimeout(async () => {
    console.log('🔄 Processing user message with medical AI:', messageText);
    await processMedicalChat(messageText);
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

  // Symptom extraction removed - now using conversational API that handles natural language directly

  // Function to call the medical chat API
  const callMedicalChatAPI = async (message: string) => {
    try {
      const requestBody: any = {
        message: message
      };
      
      // Include session_id if we have one for conversation continuity
      if (sessionId) {
        requestBody.session_id = sessionId;
        console.log('🔗 Including session ID in request:', sessionId);
      } else {
        console.log('🆕 New conversation - no session ID yet');
      }
      
      console.log('🌐 Making POST request to chat API:', requestBody);
      
      const response = await fetch('https://aiweek.jguevara.dev/chat', {
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
      console.log('✅ Chat API response received:', data);
      
      // Always update session_id when API provides one
      if (data.session_id) {
        if (data.session_id !== sessionId) {
          setSessionId(data.session_id);
          console.log('📝 Session ID updated:', data.session_id);
        } else {
          console.log('🔄 Session ID confirmed:', data.session_id);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error calling medical chat API:', error);
      throw error;
    }
  };

  // Function to process medical chat conversation
  const processMedicalChat = async (userMessage: string) => {
    try {
      console.log('💬 Sending message to medical chat API:', userMessage);
      
      // Call the medical chat API
      const apiResponse = await callMedicalChatAPI(userMessage);
      
      // Create response message from API
      const responseTraceId = uuidv4();
      const responseMessage: message = {
        content: apiResponse.response,
        role: 'assistant',
        id: responseTraceId,
        type: 'text'
      };
      
      setMessages(prev => [...prev, responseMessage]);
      
      // Log conversation status
      if (apiResponse.conversation_complete) {
        console.log('✅ Medical conversation completed');
      } else {
        console.log('🔄 Medical conversation continues...');
      }
      
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
        <div className="flex flex-col mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {sessionId && (
            <div className="text-xs text-muted-foreground text-center">
              💬 Conversación activa - ID: {sessionId.slice(-8)}
            </div>
          )}
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
