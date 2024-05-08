import { KeyboardEventHandler, useState } from 'react';
import styles from './search.module.scss';
import { LuSearch } from 'react-icons/lu';

type SearchProps = {
  onSearch: (search: string) => void;
  initialValue?: string;
};

export default function Search({ initialValue, onSearch }: SearchProps) {
  const [search, setSearch] = useState(initialValue ?? '');

  const keyUpHandler = (event: any) => {
    if (event.key === 'Enter') {
      onSearch(search ?? '');
    }
  };

  return (
    <div className={styles.search}>
      <input
        className={styles.input}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Type in to search"
        onKeyUp={(event) => keyUpHandler(event)}
      />
      <button className={styles.button} onClick={() => onSearch(search ?? '')}>
        <LuSearch></LuSearch>
      </button>
    </div>
  );
}
