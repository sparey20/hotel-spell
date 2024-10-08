import { useEffect, useState } from 'react';
import styles from './SidePanel.module.scss';
import { IoCloseOutline } from 'react-icons/io5';

type SidePanelProps = {
  isVisible: boolean;
  header?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  children?: string | JSX.Element | JSX.Element[];
};

export default function SidePanel({
  header,
  onClose,
  onConfirm,
  children,
  isVisible,
}: SidePanelProps) {
  const [isActive, setIsActive] = useState(false);

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
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.header}>
              <h3>{header}</h3>
              <button className="buttonIcon" onClick={onClose}>
                <IoCloseOutline className="text-xl" />
              </button>
            </header>
            <section className={styles.body}>{children}</section>
            <footer className={styles.footer}>
              <button
                className="buttonDefault flex justify-center items-center flex-1"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="buttonPrimary flex justify-center items-center flex-1"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </footer>
          </section>
        </section>
      </section>
    )
  );
}
