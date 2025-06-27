import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import SiteList from './pages/SiteList';
import SitePage from './pages/SitePage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';
import usePageLoading from './hooks/usePageLoading';
import './index.css';

// Layout component that includes Navbar and Footer
const Layout = () => {
  const isLoading = usePageLoading();
  console.log('Layout: Rendering layout component');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isLoading && <LoadingScreen />}
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// App component that uses router hooks
const App = () => {
  console.log('App: Rendering App component');
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="map" element={<MapPage />} />
        <Route path="sites" element={<SiteList />} />
        <Route path="sites/:id" element={<SitePage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
