import { LuCalendarCheck, LuUserCheck } from 'react-icons/lu';
import styles from './navigation.module.scss';
import Link from 'next/link';
import { Tooltip } from 'flowbite-react';

export default function Navigation() {
  return (
    <section className={styles.navigation}>
      <Tooltip content="Reservations">
        <Link className={styles.link} href="/reservations">
          <LuCalendarCheck className="text-xl"></LuCalendarCheck>
        </Link>
      </Tooltip>
      <Tooltip content="Guests">
        <Link className={styles.link} href="/guests">
          <LuUserCheck className="text-xl"></LuUserCheck>
        </Link>
      </Tooltip>
    </section>
  );
}
