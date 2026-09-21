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
import { Checkin } from './screens/Checkin';
import { Day1Engine } from './screens/Day1Engine';
import { Day2Engine } from './screens/Day2Engine';
import { CourseDayEngine } from './screens/CourseDayEngine';

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
  return <SynchronizedEngine />;
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
      <Route path="/practice/day1" element={<Day1Engine />} />
      <Route path="/practice/day2" element={<Day2Engine />} />
      <Route path="/practice/day3" element={<Navigate to="/practice/course-day/3" replace />} />
      <Route path="/practice/course-day/:day" element={<CourseDayEngine />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/course" element={<Course />} />
          <Route path="/checkin" element={<Checkin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
          <AppRouter />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
