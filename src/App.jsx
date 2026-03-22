import React from 'react';
import AuraStore from './AuraStore';
import LuminaStore from './LuminaStore';
import NexusDashboard from './NexusDashboard';
import StudioFolio from './StudioFolio';

export default function App() {
  // To view the 3D crystal store, use: return <AuraStore />;
  // To view the 2D furniture store, use: return <LuminaStore />;
  // To view the analytics dashboard, use: return <NexusDashboard />;
  // To view the creative studio, use: return <StudioFolio />;
  
  return <StudioFolio />;
}