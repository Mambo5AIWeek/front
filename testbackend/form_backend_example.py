#!/usr/bin/env python3
"""
Example backend script showing how to send forms to the chatbot frontend.
This demonstrates integration with the forms feature.
"""

import json
import asyncio
import websockets
from typing import Dict, Any

# Sample form configurations that can be sent from backend
SAMPLE_FORMS = {
    "medical_consent": {
        "title": "Agente Conversacional de Anamnesis",
        "description": "Hola, soy un agente conversacional diseñado para realizar una anamnesis básica y estimar la probabilidad de ciertas condiciones de salud a partir de sus respuestas. No ofrezco diagnóstico médico ni sustituyo la valoración de un profesional. Esta interacción durará aproximadamente 5–10 minutos.\n\nAntes de continuar, necesito su consentimiento.\n\n## Consentimiento para Anamnesis Básica\n\n**Declaración:**\n\nDeclaro que comprendo que este agente conversacional tiene fines informativos y educativos, no sustituye la atención médica profesional, y que los resultados son estimaciones probabilísticas sujetas a error. La información que proporcione se usará solo durante esta sesión con fines de demostración y no se almacenará de forma permanente ni se compartirá con terceros. En caso de presentar síntomas de urgencia, debo buscar atención inmediata.",
        "fields": [
            {
                "id": "consent_response",
                "label": "¿Acepta continuar bajo estas condiciones?",
                "type": "select",
                "options": ["", "Acepto", "No acepto"],
                "required": True
            },
            {
                "id": "main_complaint",
                "label": "Si acepta, ¿cuál es el motivo principal de su consulta hoy?",
                "type": "textarea",
                "placeholder": "Describa el motivo principal de su consulta...",
                "required": False
            }
        ],
        "submitText": "Continuar"
    },
    
    "contact": {
        "title": "Contact Information",
        "description": "Please provide your contact details",
        "fields": [
            {
                "id": "name",
                "label": "Full Name",
                "type": "text",
                "required": True,
                "placeholder": "Enter your full name"
            },
            {
                "id": "email", 
                "label": "Email Address",
                "type": "email",
                "required": True,
                "placeholder": "Enter your email"
            },
            {
                "id": "phone",
                "label": "Phone Number", 
                "type": "tel",
                "placeholder": "Enter your phone number"
            },
            {
                "id": "message",
                "label": "Message",
                "type": "textarea",
                "required": True,
                "placeholder": "How can we help you?"
            }
        ],
        "submitText": "Send Message"
    },
    
    "booking": {
        "title": "Hotel Booking Request",
        "description": "Please fill out your booking preferences",
        "fields": [
            {
                "id": "checkin",
                "label": "Check-in Date",
                "type": "text",
                "required": True,
                "placeholder": "YYYY-MM-DD"
            },
            {
                "id": "checkout",
                "label": "Check-out Date", 
                "type": "text",
                "required": True,
                "placeholder": "YYYY-MM-DD"
            },
            {
                "id": "guests",
                "label": "Number of Guests",
                "type": "select",
                "required": True,
                "options": ["1", "2", "3", "4", "5+"]
            },
            {
                "id": "room_type",
                "label": "Room Type Preference",
                "type": "select",
                "required": True,
                "options": ["Standard", "Deluxe", "Suite", "Premium Suite"]
            },
            {
                "id": "special_requests",
                "label": "Special Requests",
                "type": "textarea",
                "placeholder": "Any special requirements or requests..."
            }
        ],
        "submitText": "Submit Booking Request"
    },
    
    "survey": {
        "title": "Customer Satisfaction Survey",
        "description": "Help us improve our service",
        "fields": [
            {
                "id": "satisfaction",
                "label": "Overall Satisfaction",
                "type": "select",
                "required": True,
                "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
            },
            {
                "id": "recommend",
                "label": "Likelihood to Recommend",
                "type": "select", 
                "required": True,
                "options": ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"]
            },
            {
                "id": "feedback",
                "label": "Additional Feedback",
                "type": "textarea",
                "placeholder": "Please share any additional comments..."
            }
        ],
        "submitText": "Submit Survey"
    }
}

def create_form_response(form_name: str, intro_text: str = "") -> str:
    """
    Create a formatted response containing a form.
    
    Args:
        form_name: Name of the form from SAMPLE_FORMS
        intro_text: Optional introductory text before the form
        
    Returns:
        Formatted string with form JSON wrapped in [FORM] tags
    """
    if form_name not in SAMPLE_FORMS:
        return f"Form '{form_name}' not found. Available forms: {list(SAMPLE_FORMS.keys())}"
    
    form_json = json.dumps(SAMPLE_FORMS[form_name], indent=2)
    
    response = ""
    if intro_text:
        response += intro_text + "\n\n"
    
    response += f"[FORM]{form_json}[/FORM]"
    return response

def process_message(message: str) -> str:
    """
    Process incoming message and determine response.
    This is where you'd add your chatbot logic.
    """
    message_lower = message.lower().strip()
    
    # Form triggers
    if "medical" in message_lower or "anamnesis" in message_lower or "consent" in message_lower or "consentimiento" in message_lower:
        return create_form_response("medical_consent", "Iniciando proceso de anamnesis médica. Por favor, revise y complete el formulario de consentimiento:")
    
    elif "contact" in message_lower or "contact form" in message_lower:
        return create_form_response("contact", "I'll help you get in touch with us. Please fill out this contact form:")
    
    elif "book" in message_lower or "booking" in message_lower or "hotel" in message_lower:
        return create_form_response("booking", "I'd be happy to help you with your hotel booking. Please provide the following information:")
    
    elif "survey" in message_lower or "feedback" in message_lower:
        return create_form_response("survey", "We value your feedback! Please take a moment to complete this short survey:")
    
    elif "form" in message_lower:
        return """I can show you different types of forms. Try asking for:
- "medical consent" - Medical anamnesis consent form (Spanish)
- "contact form" - Get in touch with us
- "booking form" - Make a hotel reservation  
- "survey form" - Provide feedback

Or just say "show form" and I'll display a medical consent form."""
    
    elif "show form" in message_lower:
        return create_form_response("medical_consent")
    
    # Default responses
    elif "hello" in message_lower or "hi" in message_lower:
        return "Hello! I'm a chatbot that can display interactive forms. Try asking for a 'contact form', 'booking form', or 'survey form'!"
    
    elif "help" in message_lower:
        return """I can help you with:
- Medical anamnesis: Say "medical consent" or "anamnesis"
- Contact forms: Say "contact form"
- Hotel bookings: Say "booking form" 
- Surveys: Say "survey form"
- General forms: Say "show form"

What would you like to do?"""
    
    else:
        return f"I received your message: '{message}'. Try asking for 'medical consent', 'contact form', 'booking form', or 'survey form' to see the forms feature in action!"

async def handle_websocket(websocket, path):
    """Handle WebSocket connections from the frontend."""
    print(f"New connection from {websocket.remote_address}")
    
    try:
        async for message in websocket:
            print(f"Received: {message}")
            
            # Process the message and generate response
            response = process_message(message)
            
            # Send response back to frontend
            await websocket.send(response)
            await websocket.send("[END]")  # Signal end of message
            
            print(f"Sent: {response}")
            
    except websockets.exceptions.ConnectionClosed:
        print("Connection closed")
    except Exception as e:
        print(f"Error: {e}")

def main():
    """Start the WebSocket server."""
    print("Starting WebSocket server on ws://localhost:8090")
    print("This server demonstrates form integration with the chatbot frontend.")
    print("Try sending messages like:")
    print("  - 'contact form'")
    print("  - 'booking form'")
    print("  - 'survey form'")
    print("  - 'show form'")
    print("\nPress Ctrl+C to stop the server.")
    
    start_server = websockets.serve(handle_websocket, "localhost", 8090)
    
    try:
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")

if __name__ == "__main__":
    main()