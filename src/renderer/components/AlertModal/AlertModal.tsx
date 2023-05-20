import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import ReactLinkify from 'react-linkify';

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
        <ReactLinkify>{message}</ReactLinkify>
      </Dialog>
    </div>
  );
}

export default AlertModal;
