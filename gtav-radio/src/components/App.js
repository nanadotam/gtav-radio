import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RadioPlayer from './RadioPlayer';
import StationSelector from './StationSelector';
import SongInfo from './SongInfo';

// Import stations data - this would normally be loaded from our JSON file
// For now, we'll use a placeholder and implement actual data loading later
import stationsData from '../data/stationsPlaceholder';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #fcba03;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
`;

const App = () => {
  const [stations, setStations] = useState(stationsData.stations);
  const [currentStation, setCurrentStation] = useState(stations[0]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  // When the station changes, reset song information
  useEffect(() => {
    setCurrentSong(null);
    setPlayerReady(false);
  }, [currentStation]);

  // Update current song based on timestamp
  useEffect(() => {
    if (!playerReady || !currentStation) return;
    
    // Find the song that corresponds to the current timestamp
    const song = currentStation.tracklist.find(
      track => {
        const startSeconds = convertTimestampToSeconds(track.start);
        const endSeconds = track.end === "end" 
          ? Infinity 
          : convertTimestampToSeconds(track.end);
        
        return currentTime >= startSeconds && currentTime < endSeconds;
      }
    );
    
    if (song && (!currentSong || song.trackNumber !== currentSong.trackNumber)) {
      setCurrentSong(song);
    }
  }, [currentTime, currentStation, playerReady, currentSong]);

  // Helper function to convert timestamp to seconds
  const convertTimestampToSeconds = (timestamp) => {
    if (!timestamp) return 0;
    
    const parts = timestamp.split(':');
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    } else if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return parseInt(minutes) * 60 + parseInt(seconds);
    }
    return 0;
  };

  const handleStationChange = (station) => {
    setCurrentStation(station);
  };

  const handlePlayerReady = () => {
    setPlayerReady(true);
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  return (
    <AppContainer>
      <Title>GTA V Radio Stations</Title>
      
      <StationSelector 
        stations={stations} 
        currentStation={currentStation}
        onStationChange={handleStationChange} 
      />
      
      <RadioPlayer
        station={currentStation}
        onReady={handlePlayerReady}
        onTimeUpdate={handleTimeUpdate}
      />
      
      <SongInfo song={currentSong} station={currentStation} />
    </AppContainer>
  );
};

export default App; 