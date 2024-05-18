import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import axios from "axios";

interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
}

const ITEMS_PER_PAGE = 10;

const PokemonComponent: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=1320"
        );

        const basicPokemons = response.data.results;

        const detailedPokemons = await Promise.all(
          basicPokemons.map(async (pokemon: Pokemon) => {
            try {
              const details = await axios.get(pokemon.url);
              return {
                ...pokemon,
                imageUrl: details.data.sprites.front_default,
              };
            } catch (detailsError) {
              console.error(
                `Failed to fetch details for ${pokemon.name}`,
                detailsError
              );
              return pokemon; // Return the basic data if details fetch fails
            }
          })
        );
        setPokemons(detailedPokemons);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch Pokémon data");
        setLoading(false);
      }
    };
    fetchPokemons();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery)
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);
  const displayedPokemons = filteredPokemons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const renderPageNumbers = () => {
    const pageNumber = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumber.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 border rounded-lg bg-gray-200 hover:bg-gray-400 font-semibold ${
            currentPage === i ? "bg-gray-300" : ""
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumber;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-6">
        <Spinner />
        <p className="font-semibold ml-2 text-xl">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center mt-6">
        <p className="font-semibold">Error: {error}</p>
      </div>
    );

  return (
    <div className="flex flex-col justify-center items-center mt-8">
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchQuery}
        onChange={handleSearch}
        className="border-2 p-2 rounded-lg w-5/12 hover:border-black hover:shadow-xl font-semibold mb-5"
      />
      <div>
        <ul className="grid grid-cols-5 gap-4 mt-10">
          {displayedPokemons.map((pokemon, index) => (
            <li
              key={index}
              className="bg-gray-200 p-2 rounded text-center font-semibold hover:bg-gray-400"
            >
              <Link to={`/pokemon/${pokemon.url.split("/")[6]}`} key={index}>
                <img
                  src={pokemon.imageUrl}
                  alt={pokemon.name}
                  className="w-20 h-20 object-contain mx-auto mb-2"
                />
                {pokemon.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-10">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 border rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer font-semibold"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 border rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer font-semibold"
        >
          Prev
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 border rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer font-semibold"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 border rounded-lg bg-gray-200 hover:bg-gray-400 cursor-pointer font-semibold"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default PokemonComponent;
