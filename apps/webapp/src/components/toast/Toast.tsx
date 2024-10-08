import styles from './Toast.module.scss';
import { IoCloseOutline } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import toastSlice from '../../lib/features/toast/toastSlice';

export default function Toast() {
  const { toast } = useAppSelector((state) => state.toast);
  const { isVisible, message, type } = toast;
  const dispatch = useAppDispatch();

  const closeToast = () => {
    dispatch(toastSlice.actions.hide());
  };

  return (
    isVisible && (
      <div className={`${styles.toast} ${styles[type]}`}>
        <div className="flex flex-row justify-between">
          <p>{message}</p>
          <button className="iconButton" onClick={closeToast}>
            <IoCloseOutline></IoCloseOutline>
          </button>
        </div>
      </div>
    )
  );
}
