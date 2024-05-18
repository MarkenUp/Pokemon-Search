import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";

interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

interface Stat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

interface Type {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface Pokemon {
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  abilities: Ability[];
  stats: Stat[];
  types: Type[];
  sprites: {
    front_default: string;
  };
}

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor] = useState<string>("white");

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${id}`
        );
        setPokemon(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch Pokemon data");
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [id]);

  const typeColors: { [key: string]: string } = {
    grass: "limegreen",
    fire: "orangered",
    water: "deepskyblue",
    poison: "purple",
    flying: "lightskyblue",
    electric: "#FFC000",
    bug: "#A8B820",
    rock: "#B8o38",
    ground: "brown",
    fairy: "pink",
    fighting: "#C03028",
    psychic: "#F85888",
    dark: "#705848",
    steel: "#B8B8D0",
    ice: "#98D8D8",
    ghost: "#705898",
    dragon: "#7038F8",
    // Add other types as needed
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
    <div className="flex justify-center items-center mt-10">
      <div
        className="border w-full md:w-4/12 p-5 rounded-xl shadow-lg"
        style={{ backgroundColor }}
      >
        {pokemon && (
          <>
            <div className="flex justify-center items-center mt-3">
              <h1 className="text-4xl font-bold mb-5 uppercase text-gray-800">
                {pokemon.name}
              </h1>
            </div>
            <div className="flex justify-center items-center mb-5">
              <div className="border-2 p-5 flex justify-center items-center rounded-lg bg-white shadow-inner">
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>
            <div className="flex justify-center items-center mb-5">
              <div className="flex border-2 p-2 rounded-lg bg-white shadow-inner uppercase">
                <h2 className="font-bold text-gray-700">Types:</h2>
                <ul className="flex gap-2 ml-2 font-semibold uppercase text-sm items-center">
                  {pokemon.types.map((type, index) => {
                    const bgColor = typeColors[type.type.name] || "gray";
                    return (
                      <li
                        key={index}
                        className="bg-gray-300 px-2 py-1 rounded-md text-white font-semibold"
                        style={{ backgroundColor: bgColor }}
                      >
                        {type.type.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white shadow-md">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">
                  Information
                </h2>
                <p className="mb-1">
                  <span className="font-semibold">Height:</span>{" "}
                  {pokemon.height}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Weight:</span>{" "}
                  {pokemon.weight}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Base Experience:</span>{" "}
                  {pokemon.base_experience}
                </p>
                <h2 className="text-2xl font-bold mt-4 mb-2 text-gray-800">
                  Abilities
                </h2>
                <ul>
                  {pokemon.abilities.map((ability, index) => (
                    <li
                      key={index}
                      className="uppercase text-sm mb-1 text-gray-700"
                    >
                      {ability.ability.name} {ability.is_hidden && "(Hidden)"}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-md">
                <h2 className="text-2xl font-bold mb-3 text-gray-800">Stats</h2>
                <ul>
                  {pokemon.stats.map((stat, index) => (
                    <li key={index} className="text-gray-700 mb-1">
                      <span className="font-semibold uppercase text-sm">
                        {stat.stat.name}:
                      </span>{" "}
                      {stat.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;
