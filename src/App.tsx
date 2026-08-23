/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AppProvider, useAppStore } from './store/AppProvider';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { PracticeSetup } from './screens/PracticeSetup';
import { PracticeEngine } from './screens/PracticeEngine';
import { SynchronizedSetup } from './screens/SynchronizedSetup';
import { SynchronizedEngine } from './screens/SynchronizedEngine';
import { SosInstruction } from './screens/SosInstruction';
import { Instruction } from './screens/Instruction';
import { Progress } from './screens/Progress';
import { Course } from './screens/Course';
import { Settings } from './screens/Settings';

function PracticeSetupRouter() {
  const { type } = useParams<{ type: string }>();
  if (type === 'synchronized') {
    return <SynchronizedSetup />;
  }
  return <PracticeSetup />;
}

function PracticeEngineRouter() {
  // Use state from location to determine which engine to show
  // We can just use standard Route, or inspect window.history.state
  // But wait, the navigate was to `/practice/active` with state.type
  // Let's create a wrapper
  return <PracticeEngineWrapper />;
}

import { useLocation } from 'react-router-dom';
function PracticeEngineWrapper() {
  const location = useLocation();
  const type = location.state?.type;
  if (type === 'synchronized') {
    return <SynchronizedEngine />;
  }
  return <PracticeEngine />;
}

function AppRouter() {
  const { hasCompletedOnboarding } = useAppStore();

  if (!hasCompletedOnboarding) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sos" element={<SosInstruction />} />
      <Route path="/instruction" element={<Instruction />} />
      <Route path="/practice/setup/:type" element={<PracticeSetupRouter />} />
      <Route path="/practice/active" element={<PracticeEngineWrapper />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/course" element={<Course />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col selection:bg-neutral-700">
          <AppRouter />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
