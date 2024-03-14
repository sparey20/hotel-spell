import { useAppSelector } from '../../lib/hooks';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface DashboardProps {}

export default function Dashboard(props: DashboardProps) {
  const { hotel } = useAppSelector((state) => state.hotel);

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.header}>Welcome to {hotel?.['name']}!</h1>
      <p>Come in and stay awhile</p>
    </div>
  );
}
