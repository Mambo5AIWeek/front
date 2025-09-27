import { FormData } from '@/components/custom/form';

export interface message{
    content:string;
    role:string;
    id:string;
    formData?: FormData;
    type?: 'text' | 'form';
}