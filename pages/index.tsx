import { useState, useEffect } from 'react';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Banner } from '../components/Banner';
import { Card } from '../components/Card';
import { StoreActionTypes, CoffeeStore } from '../types/coffeeStore';
import { fetchCoffeeStores } from '../lib/coffee-stores';
import { useStoreContext } from '../store/store-context';
import useTrackLocation from '../hooks/use-track-location';

import styles from '../styles/Home.module.scss';

/**
 * Define the props for the component.
 */
type Props = {
  coffeeStores: CoffeeStore[];
};

export const getStaticProps: GetStaticProps = async () => {
  // Write server-side code directly, see https://nextjs.org/docs/basic-features/data-fetching/get-static-props#write-server-side-code-directly.
  
  // Get the coffee stores.
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
};

const Home: NextPage<Props> = (props) => {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  const [coffeeStoresError, setCoffeeStoresError] = useState('');

  const { coffeeStoresData, setCoffeeStoresData } = useStoreContext();

  const { coffeeStores, latLong } = coffeeStoresData;

  // Get and save the nearby coffee stores when the user location is provided.
  useEffect(() => {
    const fetchNearbyCoffeeStores = async() => {

      // Make call to serverless function (API).
      const response = await fetch(
        `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=12`
      );

      const nearbyCoffeeStores = await response.json();

      setCoffeeStoresData({
        type: StoreActionTypes.SET_COFFEE_STORES,
        payload: nearbyCoffeeStores,
      });

      // Unset error if it has been set.
      setCoffeeStoresError('');
    }

    if (latLong) {
      try {
        fetchNearbyCoffeeStores();
      } catch (error) {
        let message;
        if (error instanceof Error) {
          message = error.message;
        } else {
          message = String(error);
        }
        setCoffeeStoresError(message);
        console.error(error);
      }
    }
  }, [latLong, setCoffeeStoresData]);

  const handleOnBannerButtonClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name='description' content='Discover your local coffee shops!' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerButtonClick}
        />
        {locationErrorMsg && (
          <p>
            There has been an error identifying your location:{' '}
            {locationErrorMsg}
          </p>
        )}
        {coffeeStoresError && (
          <p>
            There has been an error locating nearby coffee cafes:{' '}
            {coffeeStoresError}
          </p>
        )}
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            alt='Girl drinking coffee'
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    neighbourhood={coffeeStore.neighbourhood}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Soho, London</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    neighbourhood={coffeeStore.neighbourhood}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
