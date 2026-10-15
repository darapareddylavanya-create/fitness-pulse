/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FitPulseProvider, useFitPulse } from './context/FitPulseContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { JsonModal } from './components/JsonModal';
import { DashboardScreen } from './screens/DashboardScreen';
import { HeatmapScreen } from './screens/HeatmapScreen';
import { LogWorkoutScreen } from './screens/LogWorkoutScreen';
import { DevPortfolioScreen } from './screens/DevPortfolioScreen';

const MainContent: React.FC = () => {
  const { activeTab } = useFitPulse();

  return (
    <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface min-h-screen">
      {activeTab === 'dashboard' && <DashboardScreen />}
      {activeTab === 'heatmap' && <HeatmapScreen />}
      {activeTab === 'log' && <LogWorkoutScreen />}
      {activeTab === 'portfolio' && <DevPortfolioScreen />}
    </main>
  );
};

export default function App() {
  return (
    <FitPulseProvider>
      <div className="bg-surface text-on-surface font-body-md min-h-screen selection:bg-primary-container selection:text-on-primary-container relative">
        <Header />
        <MainContent />
        <BottomNav />
        <Toast />
        <JsonModal />
      </div>
    </FitPulseProvider>
  );
}
