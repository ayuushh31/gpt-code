import { createContext, useState,useEffect } from "react";
import runChat from "../config/gemini"; 

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(""); 
  const [videos, setVideos] = useState([]);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  
  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setVideos([]);
    setInput("");
  };

  const onSent = async (prompt, username) => {
    setResultData("");  
    setLoading(true);    
    setShowResult(true);
    setRecentPrompt("");
    setVideos([]);
    let response;
    
    try {
      if (prompt !== undefined) {
        setPrevPrompts((prev) => [...prev, prompt]);
        response = await runChat(prompt);
        setRecentPrompt(prompt);
        searchVideos(prompt);
      } else {
        setPrevPrompts((prev) => [...prev, input]);
        response = await runChat(input);
        setRecentPrompt(input);
        searchVideos(input);
      }
      console.log(username, input)
      if(username != ""){
        try {
            // Encode the parameters to ensure they are URL safe
            const usernameEncoded = encodeURIComponent(username);
            const chatEncoded = encodeURIComponent(input);
            console.log(input, username)

            // Construct the URL with query parameters
            const url = `http://localhost:5000/update_chat_data?username=${usernameEncoded}&chat=${chatEncoded}`;

            const response = await fetch(url, {
                method: 'GET', // Keep the method as GET
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response)

            // Check for response and handle accordingly
            if (!response.ok) {
                throw new Error(`Error updating chat data: ${response.statusText}`);
            }

        } catch (error) {
            console.error('Error updating chat data:', error);
        }
      }

      console.log("Processed Response:", response);

      // Clean up the response
      let cleanedResponse = response
        .replace(/\*\*/g, "")        // Remove double asterisks
        .replace(/\*/g, "")          // Remove any remaining asterisks
        .replace(/\s+/g, " ")        // Normalize whitespace
        .trim();                     // Remove leading/trailing whitespace

      // Format the cleaned response for better readability
      let formattedResponse = cleanedResponse.split(". ").map(sentence => sentence.trim()).filter(Boolean).join(".<br><br>");

      // Set the formatted result data
      setResultData(formattedResponse);  

      // Display each word with a delay for typing effect
      let newResponseArray = formattedResponse.split(" ");
      newResponseArray.forEach((word, i) => {
        delayPara(i, word + (i < newResponseArray.length - 1 ? " " : "")); // Add a space only between words
      });

      console.log("Videos---------------------", videos);

    } catch (error) {
      console.error("Error processing the response:", error);
      setResultData("Sorry, something went wrong."); 
    } finally {
      setLoading(false); 
      setInput("");      
      setVideos([]);
    }
  };

  const searchVideos = async (input) => {
    const apiKey = 'AIzaSyDPR9IStKyzn3jdSa1IsqXBtZalERRHpj0';  // Replace with your actual API key
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(input)}&type=video&key=${apiKey}&maxResults=5`;

    try {
      // Fetch the initial list of videos from the search query
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData.items && searchData.items.length > 0) {
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Fetch video details (including comment counts)
        const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`;
        const videoDetailsResponse = await fetch(videoDetailsUrl);
        const videoDetailsData = await videoDetailsResponse.json();

        // Merge the search results with their corresponding statistics
        const videosWithComments = searchData.items.map((item, index) => {
          const stats = videoDetailsData.items.find(video => video.id === item.id.videoId);
          return {
            ...item,
            commentCount: stats.statistics.commentCount || 0
          };
        });

        // Sort videos by comment count in descending order
        const sortedVideos = videosWithComments.sort((a, b) => b.commentCount - a.commentCount);

        // Update state with sorted videos
        setVideos(sortedVideos);
      } else {
        setVideos([]);
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      setVideos([]);
    }
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput((prev) => prev + transcript); 
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
        };

        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser.');
      }
    };


    const ChatComponent = ({ username }) => {
      console.log("username",username);
      useEffect(() => {
        const fetchChatData = async () => {
          try {
            const response = await fetch(`http://localhost:5000/get_chat_data?username=${encodeURIComponent(username)}`);
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const data = await response.json();
            console.log("Data:----", data);
      
            if (data.chat) {
              setPrevPrompts(data.chat); // Set all prompts at once
            } else {
              console.log(data.message);
            }
          } catch (error) {
            console.error("Error fetching chat data:", error);
          }
        };
      
        fetchChatData(); // Fetch chat data when the page loads
      
        // Handle pagehide or visibilitychange event instead of unload
        const handlePageHide = () => {
          // Any cleanup or data saving you need to do here
          console.log("Page is being hidden or unloaded.");
        };
      
        window.addEventListener("pagehide", handlePageHide);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") handlePageHide();
        });
      
        return () => {
          window.removeEventListener("pagehide", handlePageHide);
          document.removeEventListener("visibilitychange", handlePageHide);
        };
      }, [username]);
       // Re-run if the username changes
    
   return <></>;
    };

  
  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    loading,
    showResult,
    input,
    setInput,
    newChat,
    resultData,
    setResultData,
    startVoiceRecognition,
    videos,
    setVideos ,
    ChatComponent
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;

