import React, { useState, useEffect } from 'react';
import './App.css';
import whatTheDuck from './whattheduck.svg'; 
import favoritegoose from './favoritegoose.svg'; 
import matching from './matching.svg'; 
import chatting from './chatting.svg'; 
import appearance from './appearance.svg'; 
import gentlegoose from './gentlegoose.svg'; 
import yesorno from './yesorno.svg'; 
import yes from './yes.svg'; 
import no from './no.svg'; 
import rolodexbody from './rolodexbody.svg';
import rolodexwheel from './rolodexwheel.svg'; 
import welcome from './welcome.svg'; 
import notepad from './notepad.svg';

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


function ThirdPage() {
  return (
    <div className="Page Container">
      <div className="title">
        <img src={welcome} alt="welcome" className="welcome" />
      </div>

      <div className="notepad-wrapper">
        <div className="notepad">
          <img src={notepad} alt="notepad" className="notepad-image" />
        </div>
      </div>
    </div>
  );
}


function SecondPage() {
  return (
    <div className="Page Container">
      <div className="title">
        <img src={favoritegoose} alt="Goose" className="favoritegoose" />
      </div>
      
      <div className="photo">
        <div className="rolodex">
          <div className="above">
            <img src={gentlegoose} alt="gentlegoose" className="pagebackground2" />
            <div className="info">
              <div className="pic"></div>
              <div className="bio">"This would be the description about the user"</div>
            </div>
          </div>

          <div className="yesorno" >
            <img src={yesorno} className="pagebackground"/>
            <div className="buttons">
              <img src={yes} alt="yes" className="yes" />
              <img src={no} alt="no" />
            </div>
          </div>

          <img src={rolodexbody} alt="rolodexbody" className="rolodexbody" />
          <img src={rolodexwheel} alt="rolodexwheel" className="rolodexwheel" />
        </div>
      </div>
      
      <div className="Menu">
        <img src={matching} alt="matching" className="matching" />
        <img src={chatting} alt="chatting" className="chatting" />
        <img src={appearance} alt="appearance" className="appearance" />
      </div>
    </div>
  );
}


function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPopping, setIsPopping] = useState(false);
  const [currentPage, setCurrentPage] = useState('first');

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsPopping(true); // Start the popping animation after loading
      setTimeout(() => setIsPopping(false), 600); // Reset the animation state after it completes
    }, 3000);
  }, []);

  function handleImageClick() {
    setCurrentPage('second'); // Change the state to show the second page
  }

  let content;
  switch (currentPage) {
    case 'first':
      content = isLoading ? (
        <div className="LoadingScreen"><p>Loading...</p></div>
      ) : (
        <FirstPage isPopping={isPopping} onImageClick={handleImageClick} />
      );
      break;
    case 'second':
      content = <SecondPage />;
      break;
    case 'third':
      content = <ThirdPage />;
      break;
    default:
      content = <div>Page not found</div>;
  }

  return <div className="App">{content}</div>;
}

export default App;