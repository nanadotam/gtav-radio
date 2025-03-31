import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';

const PlayerContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-bottom: 2rem;
  position: relative;
`;

const StyledYouTube = styled(YouTube)`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  
  iframe {
    width: 100%;
    height: 100%;
  }
`;

const RadioControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  gap: 1.5rem;
`;

const ControlButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid #fcba03;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #fcba03;
    color: black;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100px;
  height: 4px;
  background: #333;
  border-radius: 2px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fcba03;
    cursor: pointer;
  }
  
  &:focus {
    outline: none;
  }
`;

const RandomButton = styled(ControlButton)`
  font-size: 1.2rem;
`;

// Define YouTube URL parser to extract video ID
const getYoutubeVideoId = (url) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Generate a random time in seconds (up to 1 hour for most GTA radio stations)
const getRandomTime = () => {
  // Most GTA radio stations are 1-3 hours long, so we'll cap at 1 hour
  return Math.floor(Math.random() * 3600);
};

const RadioPlayer = ({ station, onReady, onTimeUpdate }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [videoId, setVideoId] = useState('');
  const timeUpdateInterval = useRef(null);
  
  // Update video ID when station changes
  useEffect(() => {
    if (station && station.youtubeUrl) {
      const id = getYoutubeVideoId(station.youtubeUrl);
      setVideoId(id);
    }
    
    // Clear any existing interval
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
    
    setIsPlaying(false);
  }, [station]);
  
  const handleReady = (event) => {
    playerRef.current = event.target;
    
    // Set initial volume
    playerRef.current.setVolume(volume);
    
    // Go to a random time to simulate GTA radio behavior
    const randomTime = getRandomTime();
    playerRef.current.seekTo(randomTime, true);
    
    // Inform parent component
    onReady();
    
    // Start playing
    playerRef.current.playVideo();
    setIsPlaying(true);
    
    // Set up time update interval
    timeUpdateInterval.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        onTimeUpdate(currentTime);
      }
    }, 1000);
  };
  
  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };
  
  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  };
  
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };
  
  const handleRandomTime = () => {
    if (playerRef.current) {
      const randomTime = getRandomTime();
      playerRef.current.seekTo(randomTime, true);
      
      // If not playing, start playing
      if (!isPlaying) {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, []);
  
  const opts = {
    height: '360',
    width: '640',
    playerVars: {
      // Hide controls, related videos, and info
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      disablekb: 1
    },
  };
  
  return (
    <PlayerContainer>
      {videoId && (
        <StyledYouTube
          videoId={videoId}
          opts={opts}
          onReady={handleReady}
        />
      )}
      
      <RadioControls>
        {isPlaying ? (
          <ControlButton onClick={handlePause} aria-label="Pause">
            ||
          </ControlButton>
        ) : (
          <ControlButton onClick={handlePlay} aria-label="Play">
            ▶
          </ControlButton>
        )}
        
        <RandomButton onClick={handleRandomTime} aria-label="Random Song">
          🔄
        </RandomButton>
        
        <VolumeControl>
          <span>🔈</span>
          <VolumeSlider
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume"
          />
          <span>🔊</span>
        </VolumeControl>
      </RadioControls>
    </PlayerContainer>
  );
};

export default RadioPlayer; 