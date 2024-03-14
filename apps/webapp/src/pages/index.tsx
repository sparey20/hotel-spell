'use client';

import { ChangeEventHandler, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Header from '../components/header/header';
import axios from 'axios';
import Navigation from '../components/navigation/navigation';

export function Index() {
  const [inputValue, setInput] = useState('Hey');
  const [headerClickCounter, setHeaderClickCounter] = useState(0);
  const [dataToDisplay, setDataToDisplay] = useState(null);

  const fetchData = () => {
    axios.get('/api').then(({ data }) => {
      console.log('response', data.message);
      setDataToDisplay(data.message);
    });
  };

  useEffect(() => {
    console.log('Index, I am running on mount');
    fetchData();
  }, []);

  return (
    <section className={styles.page}>
      <h1>Default page</h1>
    </section>
  );
}

export default Index;
