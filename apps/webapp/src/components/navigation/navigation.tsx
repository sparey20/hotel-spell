import { LuCalendarCheck, LuUserCheck } from 'react-icons/lu';
import styles from './navigation.module.scss';
import Link from 'next/link';

export default function Navigation() {
  return (
    <section className={styles.navigation}>
      <Link className={styles.link} href="/reservations">
        <LuCalendarCheck className="text-xl"></LuCalendarCheck>
      </Link>
      <Link className={styles.link} href="/guests">
        <LuUserCheck className="text-xl"></LuUserCheck>
      </Link>
    </section>
  );
}
