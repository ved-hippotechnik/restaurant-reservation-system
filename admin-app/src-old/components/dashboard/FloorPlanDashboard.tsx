import React, { useState } from 'react';
import { Sidebar } from '../common/Sidebar';
import { Header } from '../common/Header';
import { FloorPlan } from '../restaurant/FloorPlan';
import { ElementsPanel } from '../restaurant/ElementsPanel';
import { Breadcrumb } from '../common/Breadcrumb';
import './FloorPlanDashboard.css';

export const FloorPlanDashboard: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState('Zone 1');
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  const zones = ['Zone 1', 'Zone 2', 'Zone 3'];

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Administration', href: '/administration' },
    { label: 'Tables', href: '/administration/tables' },
    { label: 'Floor Plan', href: '/administration/tables/floor-plan', active: true }
  ];

  return (
    <div className="floor-plan-dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-wrapper">
          <div className="content-header">
            <div className="title-section">
              <h1>Tables</h1>
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <button className="list-view-btn">
              <span>List View</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="filter-bar">
            <div className="zone-selector" onClick={() => setShowZoneDropdown(!showZoneDropdown)}>
              <span>Zone: {selectedZone}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
              {showZoneDropdown && (
                <div className="zone-dropdown">
                  <div className="zone-option add-zone">+ Add zone</div>
                  {zones.map((zone) => (
                    <div
                      key={zone}
                      className={`zone-option ${zone === selectedZone ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedZone(zone);
                        setShowZoneDropdown(false);
                      }}
                    >
                      {zone}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="save-changes-btn">Save Changes</button>
          </div>

          <div className="floor-plan-container">
            <FloorPlan />
            <ElementsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};
