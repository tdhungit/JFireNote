import { Firestore } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { addNote, saveNote } from 'renderer/utils/notes';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  db: Firestore;
  groupId: string;
  note?: any;
  onFinish?: (note: any) => void;
}

function AddNoteModal({
  open,
  onOpenChange,
  id,
  db,
  groupId,
  note,
  onFinish,
}: Props) {
  let title = 'Add Note';
  if (id) {
    title = 'Edit Note';
  }

  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setName(note.name);
    }
  }, [note]);

  const onClose = () => {
    onOpenChange(false);
  };

  const onSave = async () => {
    if (name) {
      setSubmitting(true);
      try {
        if (note && note.id) {
          const newNote = await saveNote(db, note.id, name);
          console.log(newNote);
          onFinish && onFinish(newNote);
        } else {
          await addNote(db, name, groupId);
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
        <small id="name-help">Enter your note name.</small>
      </div>
    </Dialog>
  );
}

export default AddNoteModal;
