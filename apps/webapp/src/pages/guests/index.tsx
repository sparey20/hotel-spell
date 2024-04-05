import { useAppSelector } from '../../lib/hooks';
import styles from './index.module.scss';

export default function Guests() {
  const { hotel } = useAppSelector((state) => state.hotel);

  return (
    <div className={styles.guests}>
      <h1 className={styles.header}>Guests</h1>
    </div>
  );
}
