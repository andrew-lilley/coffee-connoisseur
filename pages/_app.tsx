import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import StoreProvider from '../store/store-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </div>
  );
}

export default MyApp
