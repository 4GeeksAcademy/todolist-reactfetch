import React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './components/Home';
import '../styles/index.css';

const root = createRoot(document.getElementById('root'));
root.render(<Home />);
