import styles from './page.module.scss';

/* eslint-disable-next-line */
export interface MainProps {}

export default function Main(props: MainProps) {
  return (
    <div className={styles.main}>
      <h1 className={styles.header}>Welcome to Hotel Spell!</h1>
      <p>Come in and stay awhile</p>
    </div>
  );
}
