import { CoffeeStore, FourSquarePlace } from "../types/coffeeStore";
import { createApi } from "unsplash-js";

// Use createApi as the code will be exected server side.
const unsplashApi = createApi({
  accessKey: (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) ? process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: '',
});

const getUrlForCoffeeStores = (latLong: string, query: string, limit: number) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

/**
 * Get images from unspash using the same search term.
 *
 * @returns 
 */
const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee cafe',
    perPage: 40,
    orientation: 'landscape',
  });
  const unsplashResults = photos.response?.results || [];
  return unsplashResults.map((result) => result.urls['small']);
};

/**
 * Get 6 nearby coffee cafes from Foursquare.
 *
 * @returns 
 */
export const fetchCoffeeStores = async (
  latLong = '51.5131768,-0.1399411',
  limit = 6,
  query = 'coffee'
) => {
  try {
    const photos = await getListOfCoffeeStorePhotos();
    const response = await fetch(getUrlForCoffeeStores(latLong, query, limit), {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
          ? process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
          : '',
      },
    });

    const coffeeStoresRes = await response.json();
    const coffeeStores = coffeeStoresRes.results as FourSquarePlace[];
    return coffeeStores.map((coffeeStore, idx) => {
      return {
        id: coffeeStore.fsq_id,
        name: coffeeStore.name,
        imgUrl: photos[idx],
        websiteUrl: '',
        address: coffeeStore.location?.formatted_address
          ? coffeeStore.location?.formatted_address
          : '',
        neighbourhood: coffeeStore.location?.neighborhood
          ? coffeeStore.location?.neighborhood?.join(', ')
          : '',
      } as CoffeeStore;
    });
  } catch (error) {
    if (
      !process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY ||
      !process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    ) {
      console.error('Make sure to setup your API keys');
    }
    console.log('Something went wrong fetching coffee cafes', error);
    return [];
  }
};