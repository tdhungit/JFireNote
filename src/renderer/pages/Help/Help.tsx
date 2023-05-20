import { Card } from 'primereact/card';
import { Fieldset } from 'primereact/fieldset';
import install_1 from '../../../../assets/install_1.png';
import install_2 from '../../../../assets/install_2.png';
import install_3 from '../../../../assets/install_3.png';
import install_4 from '../../../../assets/install_4.png';

function Help() {
  return (
    <Card title="How to use?">
      <Fieldset legend="Firebase Account">
        <strong>
          Go to{' '}
          <a href="https://console.firebase.google.com">Firebase Console</a>
        </strong>
        <p>Create Firebase Account and FireStore project</p>
      </Fieldset>

      <Fieldset legend="Firebase Project" style={{ marginTop: 10 }}>
        <strong>Go To project setting</strong>
        <p>
          <img src={install_1} style={{ width: '100%' }} />
        </p>
      </Fieldset>

      <Fieldset legend="Project General" style={{ marginTop: 10 }}>
        <strong>In General tab</strong>
        <p>
          <img src={install_2} style={{ width: '100%' }} />
        </p>
      </Fieldset>

      <Fieldset legend="Project Config" style={{ marginTop: 10 }}>
        <strong>
          Choose project {'-->'} choose config {'-->'} click copy
        </strong>
        <p>
          <img src={install_3} style={{ width: '100%' }} />
        </p>
      </Fieldset>

      <Fieldset legend="App Setting" style={{ marginTop: 10 }}>
        <strong>
          Go to JFireNote Setting and Paste to setting {'-->'} click save
        </strong>
        <p>
          <img src={install_4} style={{ width: '100%' }} />
        </p>
      </Fieldset>
    </Card>
  );
}

export default Help;
