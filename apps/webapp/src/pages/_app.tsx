import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import Header from '../components/header/header';
import Navigation from '../components/navigation/navigation';
import { useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { IHotel } from '@hotel-spell/api-interfaces';
import { useAppDispatch } from '../lib/hooks';
import hotelSlice from '../lib/features/hotel/hotelSlice';
import { Provider } from 'react-redux';
import { wrapper } from '../lib/store';

function CustomApp({ Component, pageProps }: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps);

  const dispatch = useAppDispatch();

  const getHotel = () => {
    axios
      .get('/api/hotels/fe65e280-e9be-4ba5-8756-00a5fa16b409')
      .then(({ data }: AxiosResponse<IHotel>) => {
        dispatch(hotelSlice.actions.updateHotel(data));
      });
  };

  useEffect(() => {
    getHotel();
  }, []);

  return (
    <>
      <Head>
        <title>Welcome to webapp!</title>
      </Head>
      <Provider store={store}>
        <main className="h-full">
          <Header></Header>
          <section className="flex flex-row h-full">
            <Navigation></Navigation>
            <Component {...pageProps} />
          </section>
        </main>
      </Provider>
    </>
  );
}

export default wrapper.withRedux(CustomApp);
