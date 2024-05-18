import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import PokemonComponent from "./components/PokemonComponent";
import logo from "./assets/Pokémon_logo.png";
import "./App.css";
import PokemonDetail from "./components/PokemonDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... min-h-svh">
        <header className="flex justify-center items-center mt-5">
          <Link to="/">
            <img src="pokemon logo" className="h-28 w-74 mt-5" srcSet={logo} />
          </Link>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PokemonComponent />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
