import * as React from 'react';

export interface QuickFact {
  label: string;
  value: string;
}

export interface QuickFactsProps {
  title: string;
  facts: QuickFact[];
  idPrefix: string;
}

/** Hairline-separated label/value table (mono header). */
const QuickFacts: React.FC<QuickFactsProps> = ({ title, facts, idPrefix }) => (
  <div id={`${idPrefix}__quick-facts--primary`}>
    <p className="eyebrow mb-3">{title}</p>
    <dl className="divide-y divide-border border-y border-border">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="grid grid-cols-[7rem_1fr] gap-3 py-3 text-sm sm:grid-cols-[8rem_1fr]"
        >
          <dt className="text-muted-foreground">{fact.label}</dt>
          <dd className="text-foreground">{fact.value}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default QuickFacts;
