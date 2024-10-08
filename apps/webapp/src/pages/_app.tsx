import { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/header/Header';
import Navigation from '../components/navigation/Navigation';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { IHotel } from '@hotel-spell/api-interfaces';
import { useAppDispatch } from '../lib/hooks';
import hotelSlice from '../lib/features/hotel/hotelSlice';
import { Provider } from 'react-redux';
import { wrapper } from '../lib/store';
import '../styles/main.scss';
import { Flowbite } from 'flowbite-react';
import flowbiteTheme from '../lib/flowbiteTheme';
import Toast from '../components/toast/Toast';
import * as apiHotelService from '../lib/features/hotel/apiHotelService';

function CustomApp({ Component, pageProps }: AppProps) {
  const { store } = wrapper.useWrappedStore(pageProps);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const getHotel = () => {
    apiHotelService
      .getHotels()
      .then(({ data }: AxiosResponse<IHotel[]>) => {
        dispatch(hotelSlice.actions.updateHotel(data[0]));
        setIsLoading(false);
      })
      .catch((error) => console.log('error', error));
  };

  useEffect(() => {
    getHotel();
  }, []);

  return (
    <>
      <Head>
        <title>Hotel Spell</title>
      </Head>
      <Provider store={store}>
        {!isLoading && (
          <main className="h-full flex-col flex">
            <Header></Header>
            <Flowbite theme={{ theme: flowbiteTheme }}>
              <section className="flex flex-row h-full overflow-hidden">
                <Navigation></Navigation>
                <Component {...pageProps} />
              </section>
            </Flowbite>
            <Toast></Toast>
          </main>
        )}
      </Provider>
    </>
  );
}

export default wrapper.withRedux(CustomApp);
