import { useAppSelector } from '../../lib/hooks';
import styles from './header.module.scss';
import { LuWand2 } from 'react-icons/lu';

export default function Header() {
  const { hotel } = useAppSelector((state) => state.hotel);

  return (
    <section className={styles.header}>
      <div className="flex-row flex gap-2 justify-center items-center">
        <LuWand2 color="#047857" />
        <h3 className="text-emerald-900 font-bold text-lg">Hotel Spell</h3>
        <p>{hotel?.['name']}</p>
      </div>
      <div className="flex flex-row">User Menu</div>
    </section>
  );
}
