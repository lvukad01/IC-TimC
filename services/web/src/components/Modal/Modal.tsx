import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';
interface ModalProps {
  children: React.ReactNode;
}

const Modal = ({ children }: ModalProps) => {
  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>{children}</div>
    </div>,
    document.getElementById('modal-root')!,
  );
};

export default Modal;
