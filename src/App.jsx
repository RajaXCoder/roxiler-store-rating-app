import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import Notfound from './pages/Notfound';
import StatsView from './pages/StatsView';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <StatsView />
            </ProtectedRoute>
          }
        />
        <Route path="/not-found" element={<Notfound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
        {/* or alternatively: <Route path="*" element={<Notfound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
