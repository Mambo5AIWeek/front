import { motion } from 'framer-motion';
import { MessageCircle, BotIcon, FormInput } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverviewProps {
  onShowForm?: () => void;
}

export const Overview = ({ onShowForm }: OverviewProps) => {
  return (
    <>
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.75 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <BotIcon size={44}/>
          <span>+</span>
          <MessageCircle size={44}/>
        </p>
        <p>
          Bienvenido al <strong>Asistente de Anamnesis Médica</strong><br />
          Un agente conversacional para evaluación<br />
          <strong>básica de salud</strong>.
        </p>
        
        <div className="flex flex-col gap-4 items-center">
          {onShowForm && (
            <>
              <p className="text-sm text-muted-foreground">
                Iniciar consulta médica virtual:
              </p>
              <Button 
                onClick={onShowForm}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FormInput size={16} />
                Iniciar Anamnesis
              </Button>
            </>
          )}
          

        </div>
      </div>
    </motion.div>
    </>
  );
};
