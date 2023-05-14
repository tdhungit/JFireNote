import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface Props {
  setMessage: (message: string) => void;
  message: string;
}

function AlertModal({ setMessage, message }: Props) {
  const footerContent = (
    <div>
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => setMessage('')}
        autoFocus
      />
    </div>
  );

  return (
    <div>
      <Dialog
        className="alert-modal"
        visible={message ? true : false}
        onHide={() => setMessage('')}
        header="Information"
        footer={footerContent}
      >
        {message}
      </Dialog>
    </div>
  );
}

export default AlertModal;
