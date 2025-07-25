import React, { useState } from 'react';
import './ElementsPanel.css';

interface TableElementProps {
  number: string;
  shape: 'circle' | 'rectangle' | 'rounded' | 'booth' | 'bar';
  size?: 'small' | 'medium' | 'large';
}

const TableElement: React.FC<TableElementProps> = ({ number, shape, size = 'medium' }) => {
  const getTableClass = () => {
    return `table-element ${shape} ${size}`;
  };

  return (
    <div className={getTableClass()}>
      <span className="table-number">{number}</span>
    </div>
  );
};

export const ElementsPanel: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string>('Dining');

  const ChevronUpIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18,15 12,9 6,15"></polyline>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  );

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="elements-panel">
      <div className="elements-header">
        <h3>Elements</h3>
      </div>
      
      <div className="elements-content">
        {/* Dining Section */}
        <div className="element-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('Dining')}
          >
            <h4>Dining</h4>
            {expandedSection === 'Dining' ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
          
          {expandedSection === 'Dining' && (
            <div className="section-content">
              {/* Row 1 */}
              <div className="table-row">
                <TableElement number="01" shape="circle" />
                <TableElement number="02" shape="rectangle" />
                <TableElement number="03" shape="rectangle" />
              </div>
              
              {/* Row 2 */}
              <div className="table-row">
                <TableElement number="04" shape="rectangle" />
                <TableElement number="05" shape="booth" />
                <TableElement number="06" shape="bar" />
              </div>
              
              {/* Row 3 */}
              <div className="table-row">
                <TableElement number="06" shape="bar" />
                <TableElement number="08" shape="bar" size="large" />
              </div>
              
              {/* Row 4 */}
              <div className="table-row">
                <TableElement number="10" shape="bar" size="large" />
              </div>
              
              {/* Round Tables Section */}
              <div className="table-row">
                <TableElement number="01" shape="rounded" />
                <TableElement number="02" shape="rounded" />
                <TableElement number="03" shape="rounded" />
              </div>
              
              {/* More Round Tables */}
              <div className="table-row">
                <TableElement number="04" shape="rounded" />
                <TableElement number="05" shape="rounded" />
                <TableElement number="06" shape="rounded" />
              </div>
              
              {/* Specialty Tables */}
              <div className="table-row">
                <TableElement number="08" shape="rounded" />
                <TableElement number="06" shape="rounded" />
              </div>
              
              {/* Large Round Tables */}
              <div className="table-row">
                <TableElement number="06" shape="rounded" size="large" />
                <TableElement number="08" shape="rounded" size="large" />
              </div>
              
              {/* Extra Large Tables */}
              <div className="table-row">
                <TableElement number="10" shape="rounded" size="large" />
              </div>
            </div>
          )}
        </div>
        
        {/* Bar Section */}
        <div className="element-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('Bar')}
          >
            <h4>Bar</h4>
            <ChevronDownIcon />
          </div>
        </div>
        
        {/* Walls Section */}
        <div className="element-section">
          <div 
            className="section-header" 
            onClick={() => toggleSection('Walls')}
          >
            <h4>Walls</h4>
            <ChevronDownIcon />
          </div>
        </div>
      </div>
    </div>
  );
};
