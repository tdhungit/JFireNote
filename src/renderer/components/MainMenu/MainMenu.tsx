import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { MenuItem } from 'primereact/menuitem';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function MainMenu() {
  const nav = useNavigate();

  const menuRef = useRef<any>(null);

  const items: MenuItem[] = [
    {
      label: 'Setting',
      icon: 'pi pi-cog',
      command: () => {
        nav('/settings/firebase');
      },
    },
    {
      label: 'Help',
      icon: 'pi pi-question',
      command: () => {
        nav('/help');
      },
    },
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => {
        nav('/');
      },
    },
  ];

  return (
    <>
      <Menu model={items} popup ref={menuRef} />
      <Button
        icon="pi pi-bars"
        onClick={(e) => menuRef?.current.toggle(e)}
        style={{ position: 'fixed', bottom: 5, left: 5 }}
        rounded
        text
      />
    </>
  );
}

export default MainMenu;
