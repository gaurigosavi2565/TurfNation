import React from 'react';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './src/pages/Home';
import TurfBrowse from './src/pages/TurfBrowse';
import TurfDetail from './src/pages/TurfDetail';
import Profile from './src/pages/Profile';
import ListTurf from './src/pages/ListTurf';
import NotFound from './src/pages/NotFound';

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" radius="large" scaling="100%">
      <Router>
        <main className="min-h-screen font-inter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<TurfBrowse />} />
            <Route path="/turf/:id" element={<TurfDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/list-turf" element={<ListTurf />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
        </main>
      </Router>
    </Theme>
  );
}

export default App;