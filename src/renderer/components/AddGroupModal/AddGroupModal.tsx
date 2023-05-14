import { Firestore } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { addGroupNote, updateGroup } from 'renderer/utils/notes';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  db: Firestore;
  nodes: any;
  onFinish?: () => void;
}

function AddGroupModal({ open, onOpenChange, db, id, onFinish, nodes }: Props) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  let node: any = {};
  let title = 'Add Group';
  if (id) {
    title = 'Edit Group';
    node = nodes.find((x: any) => x.key === id);
  }

  useEffect(() => {
    if (id && node && node.label) {
      setName(node.label);
    }
  }, [id]);

  const onClose = () => {
    onOpenChange(false);
  };

  const onSave = async () => {
    if (name) {
      setSubmitting(true);
      try {
        if (id) {
          await updateGroup(db, id, name);
        } else {
          await addGroupNote(db, name);
        }
      } catch (err) {
        console.log(err);
      }
      setSubmitting(false);
      onOpenChange(false);
    }
  };

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => onClose()}
        className="p-button-text"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => onSave()}
        autoFocus
        loading={submitting}
      />
    </div>
  );

  return (
    <Dialog
      visible={open}
      header={title}
      onHide={onClose}
      footer={footerContent}
    >
      <div className="flex flex-column gap-2">
        <label htmlFor="name">Name</label>
        <InputText
          value={name}
          id="name"
          aria-describedby="name-help"
          onChange={(e) => setName(e.target.value)}
        />
        <small id="name-help">Enter your group name.</small>
      </div>
    </Dialog>
  );
}

export default AddGroupModal;
