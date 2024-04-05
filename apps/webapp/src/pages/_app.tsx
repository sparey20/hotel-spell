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
      .get('/api/hotels/1d7a53dd-b5a6-4efd-9494-7c776c6ea241')
      .then(({ data }: AxiosResponse<IHotel>) => {
        console.log('data', data);
        dispatch(hotelSlice.actions.updateHotel(data));
      })
      .catch((error) => console.log('error', error));
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
