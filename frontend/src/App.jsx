import logo from './logo.svg';
import './App.css';
import SearchPage from './Pages/SearchPage';
import './index.css';
// import tailwind
import 'tailwindcss/tailwind.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import ViewRecipe from './Pages/ViewRecipe';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import { useEffect, useState } from 'react';
import CreateRecipe from './Pages/CreateRecipe';
import MyRecipes from './Pages/MyRecipes';
import EditRecipe from './Pages/EditRecipe';
function App() {
  return (
  <BrowserRouter>
  <Navbar />
  <Routes>
    <>

  <Route path="/" element={<MainPage />} />
  <Route path="/view/:id" element={<ViewRecipe />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/create" element={<CreateRecipe />} />
  <Route path="/myrecipes" element={<MyRecipes />} />
  <Route path="/edit/:id" element={<EditRecipe />} />
  

  </>
  </Routes>
  </BrowserRouter>
  );
}

export default App;
