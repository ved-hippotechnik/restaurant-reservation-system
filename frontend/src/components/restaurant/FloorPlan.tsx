import React from 'react';
import './FloorPlan.css';

export const FloorPlan: React.FC = () => {
  const ZoomInIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
      <line x1="11" y1="8" x2="11" y2="14"></line>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  );

  const ZoomOutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
      <line x1="8" y1="11" x2="14" y2="11"></line>
    </svg>
  );

  const HandIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
    </svg>
  );

  const MoveIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="5,9 2,12 5,15"></polyline>
      <polyline points="9,5 12,2 15,5"></polyline>
      <polyline points="15,19 12,22 9,19"></polyline>
      <polyline points="19,9 22,12 19,15"></polyline>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <line x1="12" y1="2" x2="12" y2="22"></line>
    </svg>
  );

  const FlipIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3"></path>
      <path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"></path>
      <path d="M12 20v2"></path>
      <path d="M12 14v2"></path>
      <path d="M12 8v2"></path>
      <path d="M12 2v2"></path>
    </svg>
  );

  return (
    <div className="floor-plan">
      <div className="floor-plan-canvas">
        <div className="grid-background">
          {/* Grid pattern background */}
          <svg className="grid-pattern" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E8EEF3" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="floor-plan-content">
          {/* This would contain the actual floor plan layout */}
          <div className="floor-plan-placeholder">
            <p>Floor Plan Canvas</p>
            <p>Drag and drop tables and furniture here</p>
          </div>
        </div>
      </div>
      
      <div className="floor-plan-tools">
        <button className="tool-btn">
          <ZoomInIcon />
        </button>
        <div className="tool-separator"></div>
        <button className="tool-btn">
          <ZoomOutIcon />
        </button>
        <div className="tool-separator"></div>
        <button className="tool-btn">
          <HandIcon />
        </button>
        <div className="tool-separator"></div>
        <button className="tool-btn">
          <MoveIcon />
        </button>
        <div className="tool-separator"></div>
        <button className="tool-btn disabled">
          <FlipIcon />
        </button>
        <div className="tool-separator"></div>
        <button className="tool-btn disabled">
          <FlipIcon />
        </button>
      </div>
    </div>
  );
};
