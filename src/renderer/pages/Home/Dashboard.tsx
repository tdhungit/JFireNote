import { Card } from 'primereact/card';
import { confirmDialog } from 'primereact/confirmdialog';
import { MenuItem } from 'primereact/menuitem';
import { Skeleton } from 'primereact/skeleton';
import { SpeedDial } from 'primereact/speeddial';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Toast } from 'primereact/toast';
import { Tree } from 'primereact/tree';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddGroupModal from 'renderer/components/AddGroupModal/AddGroupModal';
import AddNoteModal from 'renderer/components/AddNoteModal/AddNoteModal';
import AlertModal from 'renderer/components/AlertModal/AlertModal';
import DeleteGroupFormModal from 'renderer/components/DeleteGroupFormModal/DeleteGroupFormModal';
import EditNoteForm from 'renderer/components/EditNoteForm/EditNoteForm';
import { getDatabase } from 'renderer/config/firebase';
import { deleteNote, getGroups, getNote, getNotes } from 'renderer/utils/notes';

interface Props {
  toast?: Toast;
}

function Dashboard({ toast }: Props) {
  const nav = useNavigate();

  const [welcomeMessage, setWelcomeMessage] = useState('Welcome to JFireNote');

  const [alertMessage, setAlertMessage] = useState('');

  const [isAddGroup, setIsAddGroup] = useState(false);
  const [isDeleteGroup, setIsDeleteGroup] = useState(false);
  const [isAddNote, setIsAddNote] = useState(false);

  const [activeGroupId, setActiveGroupId] = useState<any>('');
  const [activeNodeId, setActiveNodeId] = useState<any>('');
  const [activeNote, setActiveNote] = useState<any>(null);
  const [noteLoading, setNoteLoading] = useState(false);

  const [nodes, setNodes] = useState<any>([]);
  const [nodeLoading, setNodeLoading] = useState(true);

  const defaultMenuItems: MenuItem[] = [
    {
      label: 'Add Group',
      icon: 'pi pi-book',
      command: () => onAddGroup(),
    },
  ];

  const groupMenuItems: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        setIsAddGroup(true);
      },
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => onDeleteGroup(),
    },
    {
      label: 'Add Note',
      icon: 'pi pi-file',
      command: () => onAddNote(),
    },
    {
      label: 'Add Group',
      icon: 'pi pi-book',
      command: () => onAddGroup(),
    },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);

  const { app, auth, db } = getDatabase();

  const onDeleteGroup = () => {
    const group = nodes.find((x: any) => x.key === activeGroupId);
    if (group) {
      confirmDialog({
        message: `Are you sure you want to delete group "${group.label}"?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          setIsDeleteGroup(true);
        },
        reject: () => {},
      });
    }
  };

  const onDeleteNote = async (noteId: string) => {
    const tmpNodes = [...nodes];
    const groupIndex = tmpNodes.findIndex((x: any) => x.key === activeGroupId);
    if (tmpNodes[groupIndex]) {
      const index = tmpNodes[groupIndex].children.findIndex(
        (x: any) => x.key === `${activeGroupId}-${noteId}`
      );
      if (index >= 0) {
        const node = tmpNodes[groupIndex].children[index];
        confirmDialog({
          message: `Are you sure you want to delete note "${node.label}"?`,
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: async () => {
            await deleteNote(db, noteId);
            toast?.show({ severity: 'info', detail: 'Delete note success!' });
            tmpNodes[groupIndex].children.splice(index, 1);
            setNodes(tmpNodes);
            setActiveNote(null);
            setActiveGroupId(activeGroupId);
            setActiveNodeId(activeGroupId);
          },
          reject: () => {},
        });
      }
    }
  };

  useEffect(() => {
    if (!app) {
      return nav('/settings/firebase');
    }

    getGroups(db, (groups) => {
      let tmp: any = [];
      groups.forEach((group: any) => {
        tmp.push({
          key: group.id,
          label: group.name,
          data: group.id,
          leaf: false,
        });
      });
      setNodes(tmp);
      setNodeLoading(false);
    });
  }, []);

  useEffect(() => {
    setActiveGroupId(activeGroupId || '');
    setActiveNodeId('');
    setActiveNote(null);
    if (!activeGroupId) {
      setMenuItems(defaultMenuItems);
    } else {
      const group = nodes.find((x: any) => x.key === activeGroupId);
      setWelcomeMessage(`Current group: "${group.label}"`);
      setMenuItems(groupMenuItems);
    }
  }, [activeGroupId]);

  useEffect(() => {
    if (activeNote && activeNote.id) {
      setMenuItems([
        {
          label: 'Edit',
          icon: 'pi pi-pencil',
          command: () => {
            setIsAddNote(true);
          },
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => onDeleteNote(activeNote.id),
        },
      ]);
    } else if (activeGroupId) {
      setMenuItems(groupMenuItems);
    } else {
      setMenuItems(defaultMenuItems);
    }
  }, [activeNote]);

  const onAddNote = () => {
    setActiveNodeId('');
    setActiveNote(null);
    setIsAddNote(true);
  };

  const onAddGroup = () => {
    setActiveGroupId('');
    setIsAddGroup(true);
  };

  const onLoadNotesInGroup = (event: any) => {
    setActiveNote(null);
    if (!event.node.children) {
      setNodeLoading(true);
      let node = { ...event.node };
      setActiveGroupId(node.key);
      node.children = [];
      getNotes(db, node.data, (notes, err) => {
        if (err) {
          setAlertMessage(err.message);
          setNodeLoading(false);
        } else {
          notes.forEach((note: any) => {
            const found = node.children.find(
              (x: any) => x.key === `${node.data}-${note.id}`
            );
            if (!found) {
              node.children.push({
                key: `${node.data}-${note.id}`,
                label: note.name,
                data: note.id,
                icon: 'pi pi-fw pi-eye',
              });
            }
          });
          let value = [...nodes];
          const index = value.findIndex((x: any) => x.data === node.data);
          value[index] = node;
          setNodes(value);
          setNodeLoading(false);
        }
      });
    }
  };

  const onLoadNote = async (nodeId: any) => {
    setActiveNote(null);
    setActiveNodeId(nodeId);
    if (nodeId.indexOf('-') >= 0) {
      const ids = nodeId.split('-');
      const id = (ids && ids[1]) || '';
      if (id) {
        setNoteLoading(true);
        const note = await getNote(db, id);
        setActiveNote(note);
        setNoteLoading(false);
      }
    } else {
      setActiveGroupId(nodeId);
    }
  };

  const onFinishEditNote = (note: any) => {
    const noteId = note.id;
    const tmpNodes = [...nodes];
    const groupIndex = tmpNodes.findIndex((x: any) => x.key === activeGroupId);
    if (tmpNodes[groupIndex]) {
      const index = tmpNodes[groupIndex].children.findIndex(
        (x: any) => x.key === `${activeGroupId}-${noteId}`
      );
      if (index >= 0) {
        tmpNodes[groupIndex].children[index].label = note.name;
      }
    }
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <AddGroupModal
        open={isAddGroup}
        onOpenChange={setIsAddGroup}
        db={db}
        id={activeGroupId}
        nodes={nodes}
      />
      <AddNoteModal
        open={isAddNote}
        onOpenChange={setIsAddNote}
        db={db}
        groupId={activeGroupId}
        id={activeNodeId}
        note={activeNote}
        onFinish={onFinishEditNote}
      />
      {toast && (
        <DeleteGroupFormModal
          db={db}
          toast={toast || undefined}
          open={isDeleteGroup}
          nodes={nodes}
          groupId={activeGroupId}
          onOpenChange={setIsDeleteGroup}
          onFinish={() => {
            setActiveGroupId('');
          }}
        />
      )}
      <AlertModal message={alertMessage} setMessage={setAlertMessage} />
      <Splitter style={{ borderRadius: 0, border: 0, height: '100vh' }}>
        <SplitterPanel size={25} minSize={20}>
          <div className="card">
            <Tree
              value={nodes}
              selectionMode="single"
              selectionKeys={activeNodeId}
              onSelectionChange={(e) => {
                setActiveNote(null);
                onLoadNote(e.value);
              }}
              className="w-full h-full"
              style={{ padding: 2, height: '100vh' }}
              onExpand={onLoadNotesInGroup}
              loading={nodeLoading}
            />
          </div>
        </SplitterPanel>
        <SplitterPanel size={75}>
          {noteLoading && (
            <Card style={{ height: '100vh' }}>
              <div>
                <Skeleton width="100%" className="mb-2"></Skeleton>
                <div style={{ marginTop: 5 }}>
                  <Skeleton width="75%"></Skeleton>
                </div>
              </div>
            </Card>
          )}
          {activeNote && <EditNoteForm note={activeNote} db={db} />}
          {!activeNote && !noteLoading && <Card>{welcomeMessage}</Card>}
        </SplitterPanel>
      </Splitter>
      <SpeedDial
        model={menuItems}
        direction="up"
        style={{ bottom: 15, right: 15 }}
        showIcon="pi pi-bars"
        hideIcon="pi pi-times"
      />
    </div>
  );
}

export default Dashboard;
