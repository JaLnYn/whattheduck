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
import inputstart from "./inputstart.svg";
import AutoGrowingTextarea from "./AutoGrowingTextarea";

import callCohereApi from "./scripts/cohereAPI";
import processPrompts from "./scripts/diffAPI";

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

function Notepad({
  myBio,
  setMyBio,
  onButtonClick,
  myName,
  setMyName,
  myAge,
  setMyAge,
}) {
  return (
    <div className="Page Container">
      <div className="title">
        <img src={welcome} alt="welcome" className="welcome" />
      </div>

      <div className="notepad_input">
        <img src={inputstart} className="inputstart" />

        {/* Asking Name */}
        {/* temperature */}
        <div className="askname">
          <span className="question">What's your name?</span>
          <div className="initial_information">
            <span className="question semicolon">:</span>
            <AutoGrowingTextarea
              type="text"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              placeholder="Enter some text"
              className="input_text"
            />
          </div>
        </div>

        {/* //temp */}

        {/* Asking Age */}
        {/* temperature */}
        <div className="askage">
          <span className="question">What's your age?</span>
          <div className="initial_information">
            <span className="question semicolon">:</span>
            <AutoGrowingTextarea
              type="text"
              value={myAge}
              onChange={(e) => setMyAge(e.target.value)}
              placeholder="Enter some text"
              className="input_text"
              rows={2}
            />
          </div>
        </div>
        {/* //temp */}

        {/* This one is bio */}
        {/* temperature */}
        <div className="askbio">
          <span className="question">Share your bio!</span>
          <div className="initial_information">
            <span className="question semicolon">:</span>
            <AutoGrowingTextarea
              type="text"
              value={myBio}
              onChange={(e) => setMyBio(e.target.value)}
              placeholder="Enter some text"
              className="input_text"
            />
          </div>
        </div>
        {/* //temp */}

        <div className="submit" onClick={onButtonClick}>
          Let's Start!
        </div>

        <div className="notepad-wrapper">
          <img src={notepad} alt="notepad" className="notepad-image" />
        </div>
      </div>
    </div>
  );
}

function BufferToImage({ buffer }) {
  console.log(buffer);
  // Convert the buffer to a Base64 string
  const base64String = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  return (
    <img
      src={`data:image/jpeg;base64,${base64String}`}
      alt="Goose"
      className="favoritegoose"
    />
  );
}

function GooseSelector({ currentGoose, onButtonClick }) {
  return (
    <div className="Page Container">
      <div className="title">
        <img src={favoritegoose.images} alt="Goose" className="favoritegoose" />
      </div>

      <div className="photo">
        <div className="rolodex">
          <BufferToImage key={"hello"} buffer={currentGoose.images[9][0]} />
          <p> {currentGoose.prompt} </p>

          <div className="yesorno">
            <img src={yesorno} className="pagebackground" />
            <div className="buttons">
              <img
                src={yes}
                alt="yes"
                className="yes"
                onClick={() => onButtonClick("yes")}
              />
              <img src={no} alt="no" onClick={() => onButtonClick("no")} />
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
  const [myName, setMyName] = useState("");
  const [myAge, setMyAge] = useState("");
  const [currentPage, setCurrentPage] = useState("first");
  const [gooseImages, setGooseImages] = useState([null]); // initialGooseImages is an array of image URLs
  const [currentGooseIndex, setCurrentGooseIndex] = useState(0);

  const removeGooseImage = (response) => {
    if (response === "yes" || response === "no") {
      // Remove the current goose image from the list
      setGooseImages((prevImages) =>
        prevImages.filter((_, index) => index !== currentGooseIndex)
      );
      // Optionally, update the current goose index
      setCurrentGooseIndex((prevIndex) =>
        prevIndex === gooseImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      setIsPopping(true); // Start the popping animation after loading
      setTimeout(() => setIsPopping(false), 600); // Reset the animation state after it completes
    }, 1000);
  }, []);

  function handleImageClick() {
    setCurrentPage("second"); // Change the state to show the second page
  }

  let content;
  switch (currentPage) {
    case "first":
      content = isLoading ? (
        <div class="loading-container">
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      ) : (
        <Splash isPopping={isPopping} onImageClick={handleImageClick} />
      );
      break;
    case "second":
      content = (
        <Notepad
          myBio={myBio}
          setMyBio={setMyBio}
          myName={myName}
          setMyName={setMyName}
          myAge={myAge}
          setMyAge={setMyAge}
          onButtonClick={async () => {
            setIsLoading(true);
            setCurrentPage("third");
            console.log("Calling Cohere API with bio:", myBio);
            let resp = await callCohereApi(myBio);
            console.log("Response from Cohere:", resp);
            const results = await processPrompts(resp);
            setGooseImages(results);
            console.log(results);
            // remove items if more than 5
            if (results.length > 5) {
              results.splice(5, results.length - 5);
            }
            setIsLoading(false);
          }}
        />
      );
      break;
    case "third":
      content = isLoading ? (
        <div class="loading-container">
          <div class="loading-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
      </div>
      ) : (
        <GooseSelector
          currentGoose={gooseImages[currentGooseIndex]}
          onButtonClick={removeGooseImage}
        />
      );
      break;

    default:
      content = <div>Page not found</div>;
  }

  return <div className="App">{content}</div>;
}

export default App;
