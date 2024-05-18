import {
  FETCH_POKEMONS_REQUEST,
  FETCH_POKEMONS_SUCCESS,
  FETCH_POKEMONS_FAILURE,
  PokemonActionTypes,
  Pokemon,
} from "../actions";

interface PokemonState {
  loading: boolean;
  pokemons: Pokemon[];
  error: string | null;
}

const initialState: PokemonState = {
  loading: false,
  pokemons: [],
  error: null,
};

const pokemonReducer = (
  state = initialState,
  action: PokemonActionTypes
): PokemonState => {
  switch (action.type) {
    case FETCH_POKEMONS_REQUEST:
      return { ...state, loading: true };
    case FETCH_POKEMONS_SUCCESS:
      return { ...state, loading: false, pokemons: action.payload };
    case FETCH_POKEMONS_FAILURE:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

export default pokemonReducer;
