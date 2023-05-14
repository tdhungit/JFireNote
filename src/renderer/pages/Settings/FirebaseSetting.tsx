import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { useEffect, useState } from 'react';
import { getFbSettings, saveFbSettings } from 'renderer/config/firebase';

interface Props {
  toast?: Toast;
}

function FirebaseSetting({ toast }: Props) {
  const [firebaseConfig, setFirebaseConfig] = useState('');

  useEffect(() => {
    const settings = getFbSettings();
    if (settings) {
      setFirebaseConfig(settings);
    }
  }, []);

  const onSave = () => {
    saveFbSettings(firebaseConfig);
  };

  return (
    <Card
      title="Firebase Settings"
      footer={
        <div className="flex flex-wrap justify-content-end gap-2">
          <Button
            type="button"
            label="Submit"
            icon="pi pi-check"
            onClick={onSave}
          />
        </div>
      }
    >
      <div>
        <InputTextarea
          value={firebaseConfig}
          onChange={(e) => setFirebaseConfig(e.target.value)}
          rows={10}
          style={{ width: '100%' }}
        />
      </div>
    </Card>
  );
}

export default FirebaseSetting;
