import { useParams } from 'react-router-dom';
import { Modal, OrderInfo } from '@components';

export const ModalOrder: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { number } = useParams<{ number: string }>();
  return (
    <Modal title={`#${number ?? ''}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
