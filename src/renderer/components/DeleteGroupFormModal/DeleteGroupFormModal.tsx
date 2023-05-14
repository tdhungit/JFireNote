import { Firestore } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useState } from 'react';
import { deleteGroup } from 'renderer/utils/notes';

interface Props {
  db: Firestore;
  toast?: Toast;
  open: boolean;
  nodes: any;
  groupId: string;
  onOpenChange: (open: boolean) => void;
  onFinish: () => void;
}

function DeleteGroupFormModal({
  db,
  toast,
  open,
  nodes,
  groupId,
  onOpenChange,
  onFinish,
}: Props) {
  const [id, setId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onClose = () => {
    onOpenChange(false);
  };

  const onDelete = async () => {
    setSubmitting(true);
    await deleteGroup(db, groupId, id, () => {
      setSubmitting(false);
      onClose();
      toast?.show({ severity: 'info', detail: 'Deleted success!' });
      onFinish();
    });
  };

  let choices: any = [];
  nodes.map((node: any) => {
    if (node.key !== groupId) {
      choices.push({
        name: node.label,
        code: node.key,
      });
    }
  });

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
        onClick={() => onDelete()}
        autoFocus
        loading={submitting}
      />
    </div>
  );

  return (
    <div>
      <Dialog
        visible={open}
        onHide={onClose}
        header="Move notes to other group"
        footer={footerContent}
      >
        <div className="flex flex-column gap-2">
          <label htmlFor="name">Change Notes To</label>
          <Dropdown
            value={id}
            onChange={(e: DropdownChangeEvent) => setId(e.value)}
            options={choices}
            optionLabel="name"
            placeholder="Select a Group"
            className="w-full md:w-14rem"
          />
        </div>
      </Dialog>
    </div>
  );
}

export default DeleteGroupFormModal;
