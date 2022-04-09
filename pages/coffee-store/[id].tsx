import type {
  GetStaticProps,
  GetStaticPaths,
  NextPage,
} from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import cls from 'classnames';
import { CoffeeStore } from '../../types/coffeeStore';
import styles from '../../styles/CoffeeStore.module.scss';
import coffeeStoresData from '../../data/coffee-stores.json';

/**
 * Define the props for the component.
 */
type Props = {
  coffeeStore: CoffeeStore;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params;
  return {
    props: {
      coffeeStore: coffeeStoresData.find(
        (coffeeStore) => params && coffeeStore.id.toString() === params.id
      ),
    },
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = coffeeStoresData.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      }
    }
  });
  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore: NextPage<Props> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const { address, name, neighbourhood, imgUrl } =
    props.coffeeStore as CoffeeStore;


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
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/places.svg'
              width='24'
              height='24'
              alt='places icon'
            />
            <p className={styles.text}>{address}</p>
          </div>
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