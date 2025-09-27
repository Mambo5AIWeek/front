import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select fields
}

export interface FormData {
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

interface ChatFormProps {
  formData: FormData;
  onFormSubmit?: (data: Record<string, string>) => void;
  onConsentAccepted?: () => void;
  onConsentDeclined?: () => void;
}

export const ChatForm: React.FC<ChatFormProps> = ({ formData, onFormSubmit, onConsentAccepted, onConsentDeclined }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (fieldId: string, value: string) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    formData.fields.forEach(field => {
      if (field.required && !values[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && values[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formSubmissionData = { ...values };
      
      // Special handling for medical consent form
      if (formData.title.includes("Agente Conversacional") || formData.title.includes("Consentimiento")) {
        if (formSubmissionData.consent_response === "No acepto") {
          if (onConsentDeclined) {
            onConsentDeclined();
          }
          return;
        } else if (formSubmissionData.consent_response === "Acepto") {
          console.log("Usuario aceptó el consentimiento:", formSubmissionData);
          if (onConsentAccepted) {
            onConsentAccepted();
          }
        }
      }
      
      if (onFormSubmit) {
        onFormSubmit(formSubmissionData);
      } else if (formData.onSubmit) {
        formData.onSubmit(formSubmissionData);
      }
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      value: values[field.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleInputChange(field.id, e.target.value),
      placeholder: field.placeholder,
      className: errors[field.id] ? 'border-red-500' : '',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={4}
            className={`min-h-[100px] text-base resize-vertical transition-all duration-200 ${errors[field.id] ? 'border-red-500 ring-red-500' : 'hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500'}`}
          />
        );
      
      case 'select':
        return (
          <select
            {...commonProps}
            className={`flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${errors[field.id] ? 'border-red-500 ring-red-500' : 'hover:border-gray-400 dark:hover:border-gray-500'}`}
          >
            <option value="">{field.placeholder || `Seleccione una opción...`}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <Input
            {...commonProps}
            type={field.type}
            className={`h-12 text-base transition-all duration-200 ${errors[field.id] ? 'border-red-500 ring-red-500' : 'hover:border-gray-400 dark:hover:border-gray-500 focus:ring-blue-500'}`}
          />
        );
    }
  };

  const isMedicalForm = formData.title.includes("Agente Conversacional") || formData.title.includes("Consentimiento");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`w-full max-w-3xl mx-auto my-6 ${isMedicalForm ? 'border-blue-200 dark:border-blue-800 shadow-lg' : ''}`}>
      <CardHeader className={`${isMedicalForm ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-b border-blue-100 dark:border-blue-800' : ''}`}>
        {/* 1. Main Title - Centered */}
        <CardTitle className={`${isMedicalForm ? 'text-blue-900 dark:text-blue-100 text-2xl font-bold text-center mb-6 flex justify-center items-center gap-3' : ''}`}>
          {isMedicalForm && (
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          {formData.title}
        </CardTitle>

        {/* 2. Introduction Paragraph */}
        {isMedicalForm && (
          <div className="text-blue-700 dark:text-blue-200 leading-relaxed text-base mb-6 p-4 bg-blue-25 dark:bg-blue-900/30 rounded-lg">
            <p className="mb-4">
              Hola, soy un agente conversacional diseñado para realizar una anamnesis básica y estimar 
              la probabilidad de ciertas condiciones de salud a partir de sus respuestas. No ofrezco 
              diagnóstico médico ni sustituyo la valoración de un profesional. Esta interacción durará 
              aproximadamente 5–10 minutos.
            </p>
            <p className="font-medium">
              Antes de continuar, necesito su consentimiento.
            </p>
          </div>
        )}

    

        {/* 4. Declaration Title - Centered and Bold */}
        {isMedicalForm && (
          <h4 className="text-blue-900 dark:text-blue-100 text-base font-bold text-center mb-3">
            Consentimiento para Anamnesis Básica

          </h4>
        )}

        {/* 5. Declaration Text */}
        {isMedicalForm && (
          <div className="text-blue-700 dark:text-blue-200 leading-relaxed text-sm mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p>
              Declaro que comprendo que este agente conversacional tiene fines informativos y educativos, 
              no sustituye la atención médica profesional, y que los resultados son estimaciones 
              probabilísticas sujetas a error. La información que proporcione se usará solo durante esta 
              sesión con fines de demostración y no se almacenará de forma permanente ni se compartirá 
              con terceros. En caso de presentar síntomas de urgencia, debo buscar atención inmediata.
            </p>
          </div>
        )}

        {/* Non-medical forms - original description */}
        {!isMedicalForm && formData.description && (
          <CardDescription className="whitespace-pre-line">
            {formData.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={`${isMedicalForm ? 'p-6 bg-white dark:bg-gray-900' : ''}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.fields.map((field) => (
            <div key={field.id} className={`space-y-3 ${isMedicalForm ? 'p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50' : 'space-y-2'}`}>
              <Label htmlFor={field.id} className={`${isMedicalForm ? 'text-gray-700 dark:text-gray-200 font-medium text-base' : ''}`}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
              </Label>
              <div className={`${isMedicalForm ? 'mt-2' : ''}`}>
                {renderField(field)}
              </div>
              {errors[field.id] && (
                <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {errors[field.id]}
                </p>
              )}
            </div>
          ))}
          
          <div className={`pt-4 ${isMedicalForm ? 'border-t border-gray-200 dark:border-gray-700' : ''}`}>
            <Button 
              type="submit" 
              className={`w-full ${isMedicalForm ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 text-base shadow-md transition-all duration-200' : ''}`}
            >
              {formData.submitText || 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </motion.div>
  );
};

// Helper function to create form data from JSON
export const createFormFromJSON = (jsonString: string): FormData | null => {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed as FormData;
  } catch (error) {
    console.error('Error parsing form JSON:', error);
    return null;
  }
};

// Example form configurations
export const sampleForms = {
  medicalConsentForm: {
    title: "Agente Conversacional de Anamnesis",
    description: "",
    fields: [
      {
        id: "consent_response",
        label: "¿Acepta continuar bajo estas condiciones?",
        type: "select" as const,
        options: ["", "Acepto", "No acepto"],
        required: true
      }
    ],
    submitText: "Continuar"
  },

  contactForm: {
    title: "Contact Information",
    description: "Please fill out your contact details",
    fields: [
      {
        id: "name",
        label: "Full Name",
        type: "text" as const,
        placeholder: "Enter your full name",
        required: true
      },
      {
        id: "email",
        label: "Email Address",
        type: "email" as const,
        placeholder: "Enter your email",
        required: true
      }
    ],
    submitText: "Send Message"
  }
};