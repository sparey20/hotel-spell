import { Tooltip } from 'flowbite-react';
import { useAppSelector } from '../../lib/hooks';
import styles from './header.module.scss';
import { LuWand2, LuUser } from 'react-icons/lu';

export default function Header() {
  const { hotel } = useAppSelector((state) => state.hotel);

  return (
    <section className={styles.header}>
      <div className="flex-row flex gap-2 justify-center items-center">
        <LuWand2 color="#047857" />
        <h3 className="text-emerald-900 font-bold text-lg">Hotel Spell</h3>
      </div>
      <div className="flex flex-row">
        <Tooltip content="User Menu">
          <button className={styles.userMenuButton}>
            <LuUser color="#FFFFFF" />
          </button>
        </Tooltip>
      </div>
    </section>
  );
}
