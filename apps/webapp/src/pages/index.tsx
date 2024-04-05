'use client';

import { ChangeEventHandler, useEffect, useState } from 'react';
import styles from './index.module.scss';
import Header from '../components/header/header';
import axios from 'axios';
import Navigation from '../components/navigation/navigation';

export function Index() {
  return (
    <section className={styles.page}>
      <h1>Default page</h1>
    </section>
  );
}

export default Index;
