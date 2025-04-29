
import React from 'react';

interface CategoryBreakdownCardProps {
  data: {name: string, value: number, color: string}[];
}

const CategoryBreakdownCard = ({ data }: CategoryBreakdownCardProps) => (
  <div className="bg-white rounded-lg">
    <p className="text-xs text-muted-foreground mb-2">Category Breakdown</p>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: `rgb(var(--${item.color}-rgb))` }}
          />
          <span className="text-sm flex-1">{item.name}</span>
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryBreakdownCard;
