import { useEffect, useState } from 'react';
import styles from './SidePanel.module.scss';
import { IoCloseOutline } from 'react-icons/io5';

type SidePanelProps = {
  isVisible: boolean;
  header?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  children?: string | JSX.Element | JSX.Element[];
  width?: number;
};

export default function SidePanel({
  onClose,
  children,
  isVisible,
  width,
}: SidePanelProps) {
  const [isActive, setIsActive] = useState(false);
  const customStyle = {
    width: `${width ?? 600}px`
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setIsActive(true), 10);
      return;
    }

    setIsActive(false);
  }, [isVisible]);

  return (
    isVisible && (
      <section className={styles.sidePanel}>
        <section
          className={`${styles.backdrop} ${isActive ? `${styles.active}` : ''}`}
          onClick={onClose}
        >
          <section
            className={styles.content}
            style={customStyle}
            onClick={(event) => event.stopPropagation()}
          >
            {children}
          </section>
        </section>
      </section>
    )
  );
}
