import styles from './navigation.module.scss';
import Link from 'next/link';

export default function Navigation() {
  return (
    <section className={styles.navigation}>
      <Link href="/reservations">Reservations</Link>
    </section>
  );
}
