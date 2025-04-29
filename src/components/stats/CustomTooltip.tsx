
import React from 'react';

export interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-md shadow-sm">
        <p className="text-sm font-semibold">{data.formattedDate}</p>
        <p className="text-sm text-muted-foreground">
          {data.count} of {data.total} habits completed
        </p>
        <p className="text-sm font-medium text-primary">
          {data.rate}% completion
        </p>
      </div>
    );
  }
  
  return null;
};

export default CustomTooltip;
