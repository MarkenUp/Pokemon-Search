import { ThunkAction } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../store";

export const FETCH_POKEMONS_REQUEST = "FETCH_POKEMONS_REQUEST";
export const FETCH_POKEMONS_SUCCESS = "FETCH_POKEMONS_SUCCESS";
export const FETCH_POKEMONS_FAILURE = "FETCH_POKEMONS_FAILURE";

interface FetchPokemonsRequestAction {
  type: typeof FETCH_POKEMONS_REQUEST;
}

interface FetchPokemonsSuccessAction {
  type: typeof FETCH_POKEMONS_SUCCESS;
  payload: Pokemon[];
}

interface FetchPokemonsFailureAction {
  type: typeof FETCH_POKEMONS_FAILURE;
  error: string;
}

export type PokemonActionTypes =
  | FetchPokemonsRequestAction
  | FetchPokemonsSuccessAction
  | FetchPokemonsFailureAction;

export interface Pokemon {
  name: string;
  url: string;
}

export const fetchPokemons = (): ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> => {
  return async (dispatch) => {
    dispatch({ type: FETCH_POKEMONS_REQUEST });

    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1320"
      );
      const data = await response.json();
      dispatch({ type: FETCH_POKEMONS_SUCCESS, payload: data.results });
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch({ type: FETCH_POKEMONS_FAILURE, error: errorMessage });
    }
  };
};
