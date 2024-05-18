import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import axios from "axios";

interface Pokemon {
  name: string;
  url: string;
  imageUrl?: string;
  types?: string[];
  height?: number;
  weight?: number;
  baseExperience: number;
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

const ITEMS_PER_PAGE = 10;

const PokemonComponent: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [sortCriteria, setSortCriteria] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<string>("asc");

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
              const types = details.data.types.map(
                (type: PokemonType) => type.type.name
              );
              return {
                ...pokemon,
                imageUrl: details.data.sprites.front_default,
                types,
                height: details.data.height,
                weight: details.data.weight,
                baseExperience: details.data.base_experience,
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

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortCriteria = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(e.target.value);
    setCurrentPage(1);
  };

  const handleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
    setCurrentPage(1);
  };

  // Filter pokemon by type
  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery) &&
      (typeFilter ? pokemon.types?.includes(typeFilter) : true)
  );

  // Sort the filtered Pokémon list based on the selected criteria and direction
  const sortedPokemons = filteredPokemons.sort((a, b) => {
    switch (sortCriteria) {
      case "name":
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case "height":
        return sortDirection === "asc"
          ? (a.height ?? 0) - (b.height ?? 0)
          : (b.height ?? 0) - (a.height ?? 0);
      case "weight":
        return sortDirection === "asc"
          ? (a.weight ?? 0) - (b.weight ?? 0)
          : (b.weight ?? 0) - (a.weight ?? 0);
      case "baseExperience":
        return sortDirection === "asc"
          ? (a.baseExperience ?? 0) - (a.baseExperience ?? 0)
          : (b.baseExperience ?? 0) - (a.baseExperience ?? 0);
      default:
        return 0;
    }
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(sortedPokemons.length / ITEMS_PER_PAGE);
  const displayedPokemons = sortedPokemons.slice(
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
      <select
        value={typeFilter}
        onChange={handleTypeFilter}
        className="border-2 p-2 rounded-lg mb-5"
      >
        <option value="">All</option>
        <option value="grass">Grass</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="poison">Poison</option>
        <option value="bug">Bug</option>
        <option value="rock">Rock</option>
        <option value="electric">Electric</option>
        <option value="fairy">Fairy</option>
        <option value="psychic">Psychic</option>
        <option value="ghost">Ghost</option>
        <option value="ground">Ground</option>
        <option value="dark">Dark</option>
        <option value="steel">Steel</option>
        <option value="ice">Ice</option>
        <option value="flying">Flying</option>
        <option value="normal">Normal</option>
        <option value="fighting">Fighting</option>
        <option value="dragon">Dragon</option>
      </select>
      <div className="flex justify-between items-center w-5/12 mb-5">
        <select
          value={sortCriteria}
          onChange={handleSortCriteria}
          className="border-2 p-2 rounded-lg"
        >
          <option value="name">Name</option>
          <option value="height">Height</option>
          <option value="weight">Weight</option>
          <option value="baseExperience">Base Experience</option>
        </select>
        <button
          onClick={handleSortDirection}
          className=" bg-gray-200 p-3 rounded-lg"
        >
          Sort Direction: {sortDirection === "asc" ? "Ascending" : "Descending"}
        </button>
      </div>
      <div>
        <ul className="grid grid-cols-5 gap-6 mt-10">
          {displayedPokemons.map((pokemon, index) => (
            <li key={index} className="p-4">
              <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
                <Link to={`/pokemon/${pokemon.url.split("/")[6]}`} key={index}>
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="object-contain mx-auto"
                  />
                  <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 text-center capitalize">
                      {pokemon.name}
                    </div>
                  </div>
                </Link>
              </div>
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
