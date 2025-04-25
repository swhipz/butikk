import './App.css';
import Header from './components/Header/Header';
import React from "react";
import Home from './pages/home/Home';
import Items from './pages/items/Items';
import Checkout from './pages/checkout/Checkout';
import { Outlet } from 'react-router-dom';

export default function App() {
  return (
<>
<Header />

</>
  );
}