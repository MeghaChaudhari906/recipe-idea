import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';
import Recipe from "./Components/Recipe-Ideas/Recipe.jsx";
import "./components/Recipe-Ideas/Recipe.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    < Recipe/>
  </StrictMode>
)
