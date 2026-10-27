import { HashRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { useProfile } from './lib/store';
import { Profiles } from './pages/Profiles';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Play } from './pages/Play';
import { Rewards } from './pages/Rewards';
import { Parent } from './pages/Parent';
import type { ReactElement } from 'react';

function PlayKeyed() {
  const { id } = useParams();
  return <Play key={id} />;
}

function Guard({ children }: { children: ReactElement }) {
  const p = useProfile();
  return p ? children : <Navigate to="/profiles" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/" element={<Guard><Home /></Guard>} />
        <Route path="/learn/:subject" element={<Guard><Learn /></Guard>} />
        <Route path="/learn/:subject/:group" element={<Guard><Learn /></Guard>} />
        <Route path="/play/:id" element={<Guard><PlayKeyed /></Guard>} />
        <Route path="/rewards" element={<Guard><Rewards /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
