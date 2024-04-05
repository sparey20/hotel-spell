import styles from './table.module.scss';

export default function Table({ rows }: { rows: any[] }) {
  return (
    <section className={styles.table}>
      <ul>
        {rows.map((row) => (
          <li key={row['id']}>{row['id']}</li>
        ))}
      </ul>
    </section>
  );
}
