import React from 'react';

export default function Panel({ title, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </section>
  );
}
