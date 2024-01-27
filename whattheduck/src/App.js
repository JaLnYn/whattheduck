import React, { useState, useEffect } from 'react';
import './App.css';
import whatTheDuck from './whattheduck.svg'; // Assuming the SVG is in the src directory
import whatTheDuckChoose from './whattheduckchoose.svg'; // Assuming the SVG is in the src directory
import favoritegoose from './favoritegoose.svg'; // Assuming the SVG is in the src directory
import rolodex from './rolodex.svg'; // Assuming the SVG is in the src directory
import matching from './matching.svg'; // Assuming the SVG is in the src directory
import chatting from './chatting.svg'; // Assuming the SVG is in the src directory
import appearance from './appearance.svg'; // Assuming the SVG is in the src directory

function FirstPage({ isPopping, onImageClick }) {
  return (
    <div className="Page" onClick={onImageClick}>
      <img
        src={whatTheDuck}
        alt="What the Duck"
        className={isPopping ? 'pop-animation' : ''}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

function SecondPage() {
  return (
    <div className="Page Container">
      <img src={favoritegoose} alt="Goose" className="favoritegoose" />
      <img src={rolodex} alt="Text" className="rolodex" />
      <div className="Menu">
        <img src={matching} alt="Goose" className="matching" />
        <img src={chatting} alt="Text" className="chatting" />
        <img src={appearance} alt="Text" className="appearance" />
      </div>
      {/* <img
        src={whatTheDuckChoose}
        alt="Choose Gentleman Goose"
        className="ease-in"
        style={{ height: '700px' }}
      /> */}
    </div>
  );
}


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPopping, setIsPopping] = useState(false);
  const [showSecondPage, setShowSecondPage] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsPopping(true); // Start the popping animation after loading
      setTimeout(() => setIsPopping(false), 600); // Reset the animation state after it completes
    }, 3000);
  }, []);

  function handleImageClick() {
    setShowSecondPage(true); // Change the state to show the second image
  }

  let content;
  if (isLoading) {
    content = <div className="LoadingScreen"><p>Loading...</p></div>;
  } else if (showSecondPage) {
    content = <SecondPage />;
  } else {
    content = <FirstPage isPopping={isPopping} onImageClick={handleImageClick} />;
  }

  return <div className="App">{content}</div>;
}

export default App;
