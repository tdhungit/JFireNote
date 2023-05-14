import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import MainMenu from './components/MainMenu/MainMenu';
import Dashboard from './pages/Home/Dashboard';
import FirebaseSetting from './pages/Settings/FirebaseSetting';

export default function App() {
  const toast = useRef<Toast>(null);

  return (
    <Router>
      <div style={{ padding: 0, margin: 0 }}>
        <MainMenu />
        <div style={{ padding: 0, margin: 0 }}>
          <Toast ref={toast} />
          <ConfirmDialog />
          <Routes>
            <Route
              path="/"
              element={<Dashboard toast={toast?.current || undefined} />}
            />
            <Route
              path="/settings/firebase"
              element={<FirebaseSetting toast={toast?.current || undefined} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
