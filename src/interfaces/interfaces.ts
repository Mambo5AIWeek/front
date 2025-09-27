import { FormData } from '@/components/custom/form';
import { DiseaseData } from '@/components/custom/disease-chart';

export interface message{
    content:string;
    role:string;
    id:string;
    formData?: FormData;
    diseaseData?: DiseaseData[];
    type?: 'text' | 'form' | 'chart';
}