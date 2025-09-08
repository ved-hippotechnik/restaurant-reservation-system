import React from 'react';
import './Breadcrumb.css';

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const ChevronRightIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className={`breadcrumb-item ${item.active ? 'active' : ''}`}>
            {item.active ? item.label : <a href={item.href}>{item.label}</a>}
          </span>
          {index < items.length - 1 && (
            <span className="breadcrumb-separator">
              <ChevronRightIcon />
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
