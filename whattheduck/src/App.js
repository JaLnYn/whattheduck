import React, { useState, useEffect } from "react";
import "./App.css";
import whatTheDuck from "./whattheduck.svg";
import favoritegoose from "./favoritegoose.svg";
import matching from "./matching.svg";
import chatting from "./chatting.svg";
import appearance from "./appearance.svg";
import gentlegoose from "./gentlegoose.svg";
import yesorno from "./yesorno.svg";
import yes from "./yes.svg";
import no from "./no.svg";
import rolodexbody from "./rolodexbody.svg";
import rolodexwheel from "./rolodexwheel.svg";
import welcome from "./welcome.svg";
import notepad from "./notepad.svg";

function Splash({ isPopping, onImageClick }) {
  return (
    <div className="Page" onClick={onImageClick}>
      <img
        src={whatTheDuck}
        alt="What the Duck"
        className={isPopping ? "pop-animation" : ""}
        style={{ cursor: "pointer" }}
      />
    </div>
  );
}

function Notepad({ setMyBio, onButtonClick }) {
  return (
    <div className="Page Container">
      <div className="title">
        <img src={welcome} alt="welcome" className="welcome" />
      </div>

      {/* temperature */}
      <div>
        <input
          type="text"
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          placeholder="Enter some text"
        />
        <button onClick={onButtonClick}>continnue</button>
      </div>
      {/* //temp */}

      <div className="notepad-wrapper">
        <div className="notepad">
          <img src={notepad} alt="notepad" className="notepad-image" />
        </div>
      </div>
    </div>
  );
}

function GooseSelector() {
  return (
    <div className="Page Container">
      <div className="title">
        <img src={favoritegoose} alt="Goose" className="favoritegoose" />
      </div>

      <div className="photo">
        <div className="rolodex">
          <img src={gentlegoose} alt="gentlegoose" className="gentlegoose" />
          <div className="yesorno">
            <img src={yesorno} className="pagebackground" />
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
  const [myBio, setMyBio] = useState("");
  const [currentPage, setCurrentPage] = useState("first");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsPopping(true); // Start the popping animation after loading
      setTimeout(() => setIsPopping(false), 600); // Reset the animation state after it completes
    }, 3000);
  }, []);

  function handleImageClick() {
    setCurrentPage("second"); // Change the state to show the second page
  }

  let content;
  switch (currentPage) {
    case "first":
      content = isLoading ? (
        <div className="LoadingScreen">
          <p>Loading...</p>
        </div>
      ) : (
        <Splash isPopping={isPopping} onImageClick={handleImageClick} />
      );
      break;
    case "second":
      content = <Notepad />;
      break;
    case "third":
      content = <GooseSelector />;
      break;

    default:
      content = <div>Page not found</div>;
  }

  return <div className="App">{content}</div>;
}

export default App;
