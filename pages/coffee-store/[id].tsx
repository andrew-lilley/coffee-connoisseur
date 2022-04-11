import { useState, useRef, useEffect } from 'react';
import type {
  GetStaticProps,
  GetStaticPaths,
  NextPage,
} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CoffeeStore } from '../../types/coffeeStore';
import { fetchCoffeeStores } from '../../lib/coffee-stores';
import { useStoreContext } from '../../store/store-context';
import { isEmpty } from '../../utils/helper-functions';
import styles from '../../styles/CoffeeStore.module.scss';

/**
 * Define the props for the component.
 */
type Props = {
  coffeeStore: CoffeeStore;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;

  // Get the coffee stores.
  const coffeeStores = await fetchCoffeeStores();

  // Find the coffee store by id from pre rendered data.
  const findCoffeeStoreById = coffeeStores.find((coffeeStore) => params && coffeeStore.id.toString() === params.id)

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the coffee stores.
  const coffeeStores = await fetchCoffeeStores();
 
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore: NextPage<Props> = (initialProps) => {
  const {
    coffeeStoresData: { coffeeStores },
  } = useStoreContext();

  const router = useRouter();
  const id = router.query.id;

  // Make sure that we don't look through useEffect while states are
  // being set.
  const currentCoffeeStoreSet = useRef(false);

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  // Create the coffee store.
  const handleCreateCoffeeStore = async (coffeeStore: CoffeeStore) => {
    try {
      const { id, name, address, neighbourhood, imgUrl } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || '',
          address: address || '',
        }),
      });

      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  // Set the current coffee store to state.
  useEffect(() => {
    // If the id has changed, we can run through the set state code below.
    if (!isEmpty(coffeeStore) && coffeeStore.id !== id) {
      currentCoffeeStoreSet.current = false;
    }

    // If coffee store is not SSG, save to store state.
    if (isEmpty(initialProps.coffeeStore)) {
      // Set the coffee store state if it can be loccated in the store context.
      if (!currentCoffeeStoreSet.current && coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find(
          (coffeeStore) => coffeeStore.id.toString() === id
        );
        if (findCoffeeStoreById) {
          setCoffeeStore(findCoffeeStoreById);
          handleCreateCoffeeStore(findCoffeeStoreById);
          currentCoffeeStoreSet.current = true;
        }
      }
    } else if (!currentCoffeeStoreSet.current) {
      // SSG (Statix Site Generation) data can also be saved so that we can save
      // voting stats against the record.
      handleCreateCoffeeStore(initialProps.coffeeStore);
      currentCoffeeStoreSet.current = true;
    }
  }, [initialProps, coffeeStore, coffeeStores, id]);

  // Deconstruct the coffee store.
  const { address, name, neighbourhood, imgUrl } = coffeeStore as CoffeeStore;

  const handleUpvoteButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // todo.
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name} | Coffee Connoisseur</title>
        <meta name='description' content={`${name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
            }
            width={600}
            height={360}
            layout='intrinsic'
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>

        <div className={`glass ${styles.col2}`}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                width='24'
                height='24'
                alt='places icon'
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src='/static/icons/nearMe.svg'
                width='24'
                height='24'
                alt='near me icon'
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width='24'
              height='24'
              alt='star icon'
            />
            <p className={styles.text}>0</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore