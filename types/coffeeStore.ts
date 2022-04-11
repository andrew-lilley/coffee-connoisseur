/**
 * Define a coffee store.
 */
export type CoffeeStore = {
  id: string;
  name: string;
  imgUrl: string;
  websiteUrl: string;
  address: string;
  neighbourhood: string;
  voting?: number;
};

/**
 * Define the location type for foursquare.
 */
export type FourSquareLocation = {
  formatted_address: string;
  neighborhood?: [string];
};

/**
 * Define a Foursquare nearby place.
 */
export type FourSquarePlace = {
  fsq_id: '50b4cd39e4b08d17ffc7de09';
  categories?: unknown;
  chains?: unknown;
  distance?: number;
  geocodes?: unknown;
  location?: FourSquareLocation;
  name: string;
  related_places?: unknown;
  timezone?: string;
};

/**
 * Define a set of results for Foursquare nearby places.
 */
export type FourSquarePlaces = {
  results: FourSquarePlace[];
};

/**
 * Define the available store actions.
 */
export enum StoreActionTypes {
  SET_LAT_LONG = 'SET_LAT_LONG',
  SET_COFFEE_STORES = 'SET_COFFEE_STORES',
}

/**
 * Define the store default action.
 */
export type StoreActionDefault = {
  type: '';
};

/**
 * Define the store set lat lang action.
 */
export type StoreActionSetLatLang = {
  type: StoreActionTypes.SET_LAT_LONG;
  payload: string;
};

/**
 * Define the store set coffee stores action.
 */
export type StoreActionSetCoffeeStores = {
  type: StoreActionTypes.SET_COFFEE_STORES;
  payload: CoffeeStore[];
};

/**
 * Define the available store actions for the reducer.
 */
export type StoreActions =
  | StoreActionDefault
  | StoreActionSetLatLang
  | StoreActionSetCoffeeStores;


/**
 * Set the store state type.
 */
export type StoreState = {
  latLong: string;
  coffeeStores: CoffeeStore[];
};

/**
 * Define the store context type.
 */
export type StoreContextType = {
  coffeeStoresData: StoreState;
  setCoffeeStoresData: React.Dispatch<React.SetStateAction<StoreActions>>;
};

/**
 * Define the store provider for the store context type.
 */
export type StoreProvider = {
  children?: React.ReactNode;
};

/** 
 * Define the Geo Location type from the Geolocation API reaponse. 
 */
export type GeoLocationPosition = {
  coords: {
    latitude: number;
    longitude: number;
  };
};