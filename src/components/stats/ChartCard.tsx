
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';
import CustomTooltip, { CustomTooltipProps } from './CustomTooltip';

export interface LogData {
  date: string;
  count: number;
  total: number;
  rate: number;
  formattedDate: string;
}

interface ChartCardProps {
  data: LogData[];
}

const ChartCard = ({ data }: ChartCardProps) => (
  <div className="bg-white rounded-lg">
    <p className="text-xs text-muted-foreground mb-2">Habit Completion</p>
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <RechartsTooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]} 
            className="fill-primary"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ChartCard;
