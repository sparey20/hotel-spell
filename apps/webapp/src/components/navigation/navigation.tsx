import { LuCalendarCheck, LuUserCheck, LuHome } from 'react-icons/lu';
import styles from './navigation.module.scss';
import Link from 'next/link';
import { Tooltip } from 'flowbite-react';
import { useState } from 'react';

export default function Navigation() {
  const [page, setPage] = useState('home');

  return (
    <section className={styles.navigation}>
      <Tooltip content="Home">
        <Link
          className={`${page === 'home' ? `${styles.selected}` : ''} ${
            styles.link
          }`}
          href="/"
          onClick={() => setPage('home')}
        >
          <LuHome className="text-xl"></LuHome>
        </Link>
      </Tooltip>
      <Tooltip content="Reservations">
        <Link
          className={`${page === 'reservations' ? `${styles.selected}` : ''} ${
            styles.link
          }`}
          href="/reservations"
          onClick={() => setPage('reservations')}
        >
          <LuCalendarCheck className="text-xl"></LuCalendarCheck>
        </Link>
      </Tooltip>
      <Tooltip content="Guests">
        <Link
          className={`${page === 'guests' ? `${styles.selected}` : ''} ${
            styles.link
          }`}
          href="/guests"
          onClick={() => setPage('guests')}
        >
          <LuUserCheck className="text-xl"></LuUserCheck>
        </Link>
      </Tooltip>
    </section>
  );
}
