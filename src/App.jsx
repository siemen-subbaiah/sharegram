import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

import IndexPage from './pages';
import NotFoundPage from './pages/404';
import DetailedPage from './pages/detailedPage';
import ExplorePage from './pages/explore';
import LoginPage from './pages/login';
import LoginRedirect from './pages/LoginRedirect';
import ProfilePage from './pages/profile';
import ProtectedRoute from './pages/ProtectedRoute';
import RegisterPage from './pages/register';
import SearchPage from './pages/search';
import SettingsPage from './pages/settings';

const App = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark'
  );
  const changeTheme = () => setTheme(theme == 'dark' ? 'light' : 'dark');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      <div className='transition-colors ease-in font-poppins bg-[#FAFAFA] dark:bg-gray-900 dark:text-gray-200 md:relative md:h-screen md:overflow-hidden'>
        <NavBar changeTheme={changeTheme} />
        <Routes>
          <Route path='/account/login' element={<LoginPage />} />
          <Route path='/account/register' element={<RegisterPage />} />
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/connect/:providerName/redirect'
            element={
              <ProtectedRoute>
                <LoginRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path='/post/:id'
            element={
              <ProtectedRoute>
                <DetailedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/explore'
            element={
              <ProtectedRoute>
                <ExplorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/search'
            element={
              <ProtectedRoute>
                <SearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/:username'
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/account/settings'
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
