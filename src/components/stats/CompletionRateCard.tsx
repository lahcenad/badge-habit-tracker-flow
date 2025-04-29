
import React from 'react';

interface CompletionRateCardProps {
  rate: number;
}

const CompletionRateCard = ({ rate }: CompletionRateCardProps) => (
  <div className="p-4 bg-accent rounded-lg flex items-center justify-center">
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1">Overall Completion Rate</p>
      <p className="text-3xl font-semibold">{rate}%</p>
    </div>
  </div>
);

export default CompletionRateCard;
