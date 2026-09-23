import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import Home from './pages/Home';

const CreatePoint = lazy(() => import('./pages/CreatePoint'));

export default function App() {
  return (
    <Suspense fallback={<p className="page-loading" role="status">Carregando…</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-point/*" element={<CreatePoint />} />
      </Routes>
    </Suspense>
  );
}
