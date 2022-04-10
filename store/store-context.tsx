import { createContext, Reducer, useContext, useReducer } from 'react';
import {
  StoreActionTypes,
  StoreActions,
  StoreState,
  StoreContextType,
  StoreProvider,
} from '../types/coffeeStore';

// Context.
export const StoreContext = createContext<StoreContextType | null>(null);

// Custom hook.
export const useStoreContext = () => useContext(StoreContext) as StoreContextType;

// Reducer.
const storeReducer: Reducer<StoreState, StoreActions> = (state, action) => {
  switch (action.type) {
    case StoreActionTypes.SET_LAT_LONG:
      return {
        ...state,
        latLong: action.payload,
      };
    case StoreActionTypes.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStores: action.payload,
      };
    default:
      return state;
  }
};

// Provider.
const StoreProvider = ({ children }: StoreProvider) => {
  const initialState = {
    latLong: '',
    coffeeStores: [],
  } as StoreState;

  const [coffeeStoresData, setCoffeeStoresData] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider
      value={{ coffeeStoresData, setCoffeeStoresData } as StoreContextType}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
