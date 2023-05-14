import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export function saveFbSettings(settings: string) {
  localStorage.setItem('firebase', settings);
}

export function getFbSettings() {
  return localStorage.getItem('firebase');
}

export function getFirebaseConfig() {
  let configStr = getFbSettings();
  if (configStr) {
    configStr = configStr.replace('const firebaseConfig = ', '');
    configStr = configStr.replace(';', '');
    try {
      const correctJson = configStr
        .replace(/(\w+)(: )/g, '"$1" $2')
        .replace(/(:\s+)['](\w+)['](,\n)/g, '$1"$2"$3');
      return JSON.parse(correctJson);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  return null;
}

export function getDatabase(): any {
  const config: any = getFirebaseConfig();
  if (config) {
    try {
      const app = initializeApp(config);
      const auth = getAuth(app);
      const db = getFirestore(app);
      return {
        app,
        auth,
        db,
      };
    } catch (err) {
      return {};
    }
  }

  return {};
}

export const DbCollections = {
  category: 'jfirenote-categories',
  note: 'jfirenote-notes',
};
