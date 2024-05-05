import styles from './modal.module.scss';
import { IoCloseOutline } from 'react-icons/io5';

type ModalProps = {
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
}: ModalProps) {
  return (
    <section className={styles.modal}>
      <section className={styles.modalBackdrop} onClick={onClose}>
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
            <button className="buttonPrimary" onClick={onConfirm}>
              Confirm
            </button>
            <button className="buttonDefault" onClick={onClose}>
              Cancel
            </button>
          </footer>
        </section>
      </section>
    </section>
  );
}
