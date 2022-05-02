import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AuthContext } from './context/AuthState';

import IndexPage from './pages';
import NotFoundPage from './pages/404';
import DetailedPage from './pages/detailedPage';
import ExplorePage from './pages/explore';
import LoginPage from './pages/login';
import LoginRedirect from './pages/LoginRedirect';
import ProfilePage from './pages/profile';
import RegisterPage from './pages/register';
import SettingsPage from './pages/settings';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <div className='font-poppins bg-[#FAFAFA] md:relative md:h-screen md:overflow-hidden'>
        <NavBar />
        <Routes>
          <Route path='/account/login' element={<LoginPage />} />
          <Route
            path='/connect/:providerName/redirect'
            element={<LoginRedirect />}
          />
          <Route path='/account/register' element={<RegisterPage />} />
          <Route path='/' element={user ? <IndexPage /> : <LoginPage />} />
          <Route path='/post/:id' element={<DetailedPage />} />
          <Route path='/explore' element={<ExplorePage />} />
          <Route path='/:username' element={<ProfilePage />} />
          <Route path='/account/settings' element={<SettingsPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
