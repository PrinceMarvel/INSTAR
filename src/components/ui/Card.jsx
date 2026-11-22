/**
 * Composant Carte (Card) réutilisable de l'interface INSTAR.
 * Fournit une mise en page épurée sur fond blanc avec ombre douce.
 */

import React from 'react';

export default function Card({
  children,
  className = '',
  onClick,
  interactive = false,
  ...props
}) {
  const interactiveClasses = interactive
    ? 'cursor-pointer hover:border-instar-border-active active:scale-[0.99] transition-all'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-instar-surface border border-instar-border rounded-2xl p-4 shadow-instar-card text-left ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-2 pb-3 mb-3 border-b border-instar-border ${className}`}>
      <div>
        {title && <h3 className="text-base font-bold text-instar-text">{title}</h3>}
        {subtitle && <p className="text-xs text-instar-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return (
    <div className={`pt-3 mt-3 border-t border-instar-border flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
};
