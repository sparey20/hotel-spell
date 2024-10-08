import { useEffect, useState } from 'react';
import styles from './Modal.module.scss';
import { IoCloseOutline } from 'react-icons/io5';

type ModalProps = {
  isVisible: boolean;
  header?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  children?: string | JSX.Element | JSX.Element[];
};

export default function Modal({
  header,
  onClose,
  onConfirm,
  children,
  isVisible,
}: ModalProps) {
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
      <section className={styles.modal}>
        <section
          className={`${styles.modalBackdrop} ${
            isActive ? `${styles.active}` : ''
          }`}
          onClick={onClose}
        >
          <section
            className={styles.modalContent}
            onClick={(event) => event.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <h3>{header}</h3>
              <button className="buttonIcon" onClick={onClose}>
                <IoCloseOutline className="text-xl" />
              </button>
            </header>
            <section className={styles.modalBody}>{children}</section>
            <footer className={styles.modalFooter}>
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
