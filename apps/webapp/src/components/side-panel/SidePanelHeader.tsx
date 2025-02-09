import styles from './SidePanel.module.scss';
import { IoCloseOutline } from 'react-icons/io5';

type SidePanelHeaderProps = {
  children: string | JSX.Element | JSX.Element[];
  onClose: () => void;
};

export default function SidePanelHeader({ children, onClose }: SidePanelHeaderProps) {
  return (
    <header className={styles.header}>
      <h3>{children}</h3>
      <button className="buttonIcon" onClick={onClose}>
        <IoCloseOutline className="text-xl" />
      </button>
    </header>
  );
}
