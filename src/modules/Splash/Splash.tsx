import * as React from 'react';
import Button from '../../components/Button/Button';
import './Splash.css'

function Splash() {
  return (
    <main className="splash">
      <h2>Ripple</h2>
      <p>a series of ripples formed in a pond</p>
      <Button label={'Continue'} link={'https://www.google.ca/'}/>
    </main>
  );
}

export default Splash;