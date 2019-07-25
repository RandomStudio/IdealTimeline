import React from 'react';
import './App.css';
import Timeline from './Timeline/Timeline';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        Timeline Demo
      </header>
      <main>
        <Timeline />
      </main>
    </div>
  );
}

export default App;
