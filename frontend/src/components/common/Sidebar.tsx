import React, { useState } from 'react';
import './Sidebar.css';

interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  hasSubmenu?: boolean;
  submenuItems?: string[];
  isExpanded?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  label, 
  icon, 
  active = false, 
  hasSubmenu = false, 
  submenuItems = [], 
  isExpanded = false,
  onClick 
}) => {
  return (
    <div className={`menu-item ${active ? 'active' : ''}`}>
      <div className="menu-item-content" onClick={onClick}>
        <div className="menu-item-icon">{icon}</div>
        <span className="menu-item-label">{label}</span>
        {hasSubmenu && (
          <svg 
            className={`menu-item-chevron ${isExpanded ? 'expanded' : ''}`} 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        )}
      </div>
      {hasSubmenu && isExpanded && (
        <div className="submenu">
          {submenuItems.map((item, index) => (
            <div key={index} className={`submenu-item ${index === 1 ? 'active' : ''}`}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Administration');

  const handleMenuClick = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9,22 9,12 15,12 15,22"></polyline>
    </svg>
  );

  const CutleryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
      <path d="M7 2v20"></path>
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
    </svg>
  );

  const BuildingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );

  const TippingIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="8" r="6"></circle>
      <path d="M18.09 10.37A6 6 0 1 1 10.37 18.09"></path>
      <path d="M7 6h1v4"></path>
      <path d="M9.5 10.5L16 4"></path>
    </svg>
  );

  const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">HIPPO</span>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <MenuItem 
          label="Home" 
          icon={<HomeIcon />} 
        />
        
        <MenuItem 
          label="F&B" 
          icon={<CutleryIcon />} 
          hasSubmenu={true}
          submenuItems={['Menu Management', 'Orders', 'Kitchen']}
          isExpanded={expandedMenu === 'F&B'}
          onClick={() => handleMenuClick('F&B')}
        />
        
        <MenuItem 
          label="Administration" 
          icon={<BuildingIcon />} 
          active={true}
          hasSubmenu={true}
          submenuItems={['Sub Module name', 'Sub Module name', 'Sub Module name', 'Tables']}
          isExpanded={expandedMenu === 'Administration'}
          onClick={() => handleMenuClick('Administration')}
        />
        
        <MenuItem 
          label="Tipping" 
          icon={<TippingIcon />} 
          hasSubmenu={true}
          submenuItems={['Tip Management', 'Reports']}
          isExpanded={expandedMenu === 'Tipping'}
          onClick={() => handleMenuClick('Tipping')}
        />
        
        <MenuItem 
          label="Feedback" 
          icon={<HeartIcon />} 
        />
      </div>
      
      <div className="sidebar-footer">
        <MenuItem 
          label="Settings" 
          icon={<SettingsIcon />} 
        />
      </div>
    </div>
  );
};
