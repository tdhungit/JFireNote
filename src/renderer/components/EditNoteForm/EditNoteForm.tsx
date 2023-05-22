import { Firestore } from 'firebase/firestore';
import { Editor } from 'primereact/editor';
import { Message } from 'primereact/message';
import { useEffect, useState } from 'react';
import { saveNote } from 'renderer/utils/notes';

interface Props {
  db: Firestore;
  note: any;
}

function EditNoteForm({ db, note }: Props) {
  const [text, setText] = useState((note && note.content) || '');
  const [saving, setSaving] = useState(false);

  const saveNoteContent = async () => {
    setSaving(true);
    await saveNote(db, note.id, null, text);
    setSaving(false);
  };

  useEffect(() => {
    saveNoteContent();
  }, [text]);

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
        <button className="ql-link" aria-label="Link"></button>
        <select className="ql-color" aria-label="Char color"></select>
        <select className="ql-background" aria-label="Bg color"></select>
        <button
          className="ql-list"
          value="ordered"
          aria-label="Ordered"
        ></button>
        <button className="ql-list" value="bullet" aria-label="Bullet"></button>
        {/* <select className="ql-align" aria-label="Align"></select> */}
        <button className="ql-code-block" aria-label="Code"></button>
        <select className="ql-font"></select>
        <select className="ql-size"></select>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <>
      <Editor
        value={text}
        onTextChange={(e: any) => setText(e.htmlValue)}
        style={{ height: '100%', minHeight: '90vh' }}
        headerTemplate={header}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
        }}
      >
        {saving && <Message text="Saving..." />}
      </div>
    </>
  );
}

export default EditNoteForm;
