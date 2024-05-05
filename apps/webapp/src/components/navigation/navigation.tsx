import styles from './navigation.module.scss';
import Link from 'next/link';

export default function Navigation() {
  return (
    <section className={styles.navigation}>
      <Link className={styles.link} href="/reservations">
        Reservations
      </Link>
      <Link className={styles.link} href="/guests">
        Guests
      </Link>
    </section>
  );
}
