import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface DiseaseData {
  name: string;
  probability: number;
}

interface DiseaseChartProps {
  data: DiseaseData[];
  title?: string;
}

export const DiseaseChart = ({ data, title = "Probabilidades de Diagnóstico" }: DiseaseChartProps) => {
  // Sort by probability and take top 5
  const sortedData = data
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5)
    .map(item => ({
      ...item,
      probability: Math.round(item.probability * 100) / 100 // Round to 2 decimals
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-blue-600">
            {`Probabilidad: ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        <CardDescription>
          Top 5 diagnósticos más probables basados en los síntomas reportados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={sortedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Probabilidad (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="probability" 
              fill="#3b82f6" 
              name="Probabilidad (%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};