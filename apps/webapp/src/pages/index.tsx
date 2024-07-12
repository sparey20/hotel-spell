import { IHotel } from '@hotel-spell/api-interfaces';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import styles from './index.module.scss';

export function Index() {
  const { hotel } = useAppSelector((state) => state.hotel) as {
    hotel: IHotel | null;
  };
  const dispatch = useAppDispatch();

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{hotel?.name}</h1>
      </header>
    </section>
  );
}

export default Index;
