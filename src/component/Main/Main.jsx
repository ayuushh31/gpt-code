// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets'; 
import { Context } from '../../context/Context';
// eslint-disable-next-line no-unused-vars
import { useAuth0 } from "@auth0/auth0-react";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    startVoiceRecognition,
    videos,
    ChatComponent
  } = useContext(Context);



  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {

      onSent(input, isAuthenticated ? user.name: "");
    }
  };
  // State to manage the visibility of user information
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo); // Toggle the user info visibility
  };


  return (
    <div className='main'>
      <div className="nav">
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <li>
            {isAuthenticated ? (
              <>
                {/* Clickable user image */}
                <ChatComponent username={user.name} />
                <img
                  style={{
                    width: '40px',       // Set width
                    height: '40px',      // Set height
                    cursor: 'pointer',   // Make it clickable
                    borderRadius: '50%', // Make it round
                    border: '2px solid #ccc', // Light border around the image
                    borderColor: '#ffffff'
                  }}
                  src={user.picture}
                  alt={user.name}
                  onClick={toggleInfo} // Toggle user info when clicked
                />

                {/* Conditionally render user info in a rectangular box */}
                {showInfo && (
                  <div 
                  style={{
                    position: 'absolute',
                    top: '50px',  // Adjust position below the image
                    right: '0',   // Align to the right
                    
                    backgroundColor: '#1A1A1A', // White background
                    border: '1px solid #ccc', // Light grey border
                    borderRadius: '8px', // Rounded corners
                    padding: '15px', // Padding for spacing
                    width: '200px',  // Set width to control size
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // Light shadow
                    zIndex: 1, // Ensure it's above other content
                    wordWrap: 'break-word', // Ensure long words break to fit
                    textOverflow: 'ellipsis', // Show ellipsis for long text
                    whiteSpace: 'normal', // Allow text to wrap to the next line
                    overflow: 'hidden' // Hide anything that overflows
                  }}
                >
                  <h4 
                    style={{
                      margin: '0 0 10px 0', 
                      fontSize: '16px', 
                      textAlign: 'center', 
                      maxWidth: '100%', // Ensures text doesn’t overflow
                      wordWrap: 'break-word', // Break long words
                    }}
                  >
                    {user.name}
                  </h4>
                  <hr />
                  <p 
                    style={{ 
                      margin: '0 0 10px 0', 
                      fontSize: '12px', 
                      textAlign: 'center', 
                      color: '#ffff', 
                      maxWidth: '100%', // Ensures email doesn’t overflow
                      wordWrap: 'break-word', // Break long emails or words
                    }}
                  >
                    <h4>Email:-</h4> 
                    {user.email}
                  </p>
                  <hr />
                  
                  <button
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#ff4d4d", // Red for logout
                      color: "#fff", // White text
                      border: "none", // No border
                      borderRadius: "5px", // Rounded corners
                      cursor: "pointer", // Hand cursor on hover
                      marginTop: '10px', // Margin to move the button below the user info
                      width: "100%", // Make the button full width inside the info box
                    }}
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  >
                    Log Out
                  </button>
                </div>
                )}
              </>
            ) : (
              
              <button
                style={{
                  padding: "8px 12px",
                  backgroundColor: "fff", // Green for login
                  color: "#1A1A1A", // White text
                  border: "none", // No border
                  borderRadius: "5px", // Rounded corners
                  cursor: "pointer", // Hand cursor on hover
                  // textAlign: "justify",
                  fontWeight: 'bold'
                }}
                onClick={() => loginWithRedirect()}
              >
                Log in
              </button>
            )}
          </li>
        </div>
      </div>

      <div className="main_container">
        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello</span></p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places for an upcoming road trip</p>
                <img src={assets.compass_icon} alt='Compass' />
              </div>
              <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt='Bulb' />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt='Message' />
              </div>
              <div className="card">
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt='Code' />
              </div>
              <br />
            </div>
          </>
        ) : (
          <div className='result'>
            <div className="result-title">
              <img src={assets.user_icon} alt='User' />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {/* <img src={assets.gemini_icon} alt='Gemini' /> */}
              {loading ? (
                <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
            <div className="video-results">
  {videos.map((video, index) => (
    <div key={video.id.videoId} className="video-item">
      <h4>{index + 1}. {video.snippet.title}</h4> {/* Add numbering here */}
      <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
      <p>{video.snippet.description}</p>
      <a href={`https://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
        Watch Video
      </a>
      <br></br>
      <br></br>
    </div>
  ))}
</div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={handleEnterPress}
              type="text"
              placeholder='Enter a prompt here'
            />
            <div className="search-actions">
              <button onClick={startVoiceRecognition}><img src={assets.mic_icon} alt="Mic" /></button>
              {input && <img onClick={() => onSent(input, isAuthenticated ? user.name: "")} src={assets.send_icon} alt="Send" />}
            </div>
          </div>
          <p className="bottom-info">
            Intelli Search Machine may display inaccurate info, including about people, so double-check its response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;

