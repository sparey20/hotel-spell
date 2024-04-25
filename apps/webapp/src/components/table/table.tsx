import { ITableProps } from './interfaces';
import styles from './table.module.scss';

export default function Table({ items, columns, idKey }: ITableProps) {
  const columnWidthClassMapping: Record<string, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
  };
  const headerClass = `${styles.headerContainer} ${
    columnWidthClassMapping[columns.length]
  }`;
  const rowItemClass = `${styles.rowItem} ${
    columnWidthClassMapping[columns.length]
  }`;

  return (
    <section className={styles.table}>
      <div className={headerClass}>
        {columns.map((column) => (
          <h4 key={column.key}>{column.label}</h4>
        ))}
      </div>
      <ul className={styles.rowContainer}>
        {items.map((item) => (
          <li key={item[idKey]} className={rowItemClass}>
            {columns.map((column) => (
              <div key={`${item[idKey]}-${column.key}`}>{item[column.key]}</div>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
