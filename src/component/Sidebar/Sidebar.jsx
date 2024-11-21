// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets'; 
import { Context } from '../../context/Context';

const Sidebar = () => {
  const [extended, setExtended] = useState(false);
  const { onSent, prevPrompts, setRecentPrompt, newChat, setVideos } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    setVideos([]);
    await onSent(prompt);
  };

  return (
    <div className='sidebar'>
      <div className='top'>
        <img
          onClick={() => setExtended(prev => !prev)}
          className='menu'
          src={assets.menu_icon}
          alt='' />
        <div onClick={newChat} className='new-chat'>
          <img src={assets.plus_icon} alt='New Chat' />
          {extended ? <p>New Chat</p> : null}
        </div>
        {extended && (
          <div className='recent'>
            <p className='recent-title'>Recent</p>
            {prevPrompts.map((item, index) => (
              <div onClick={() => loadPrompt(item)} className='recent-entry' key={index}>
                <img src={assets.message_icon} alt='Message Icon' />
                <p>{item.slice(0, 18)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='bottom'>
        <div className='bottom-item recent-entry'>
          <img src={assets.question_icon} alt='Question Icon' />
          {extended ? <p>Help</p> : null}
        </div>
        <div className='bottom-item recent-entry'>
          <img src={assets.history_icon} alt='History Icon' />
          {extended ? <p>Activity</p> : null}
        </div>
        <div className='bottom-item recent-entry'>
          <img src={assets.setting_icon} alt='Settings Icon' />
          {extended ? <p>Setting</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
