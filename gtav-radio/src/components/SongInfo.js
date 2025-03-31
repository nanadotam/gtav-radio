import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 600px;
`;

const NowPlaying = styled.div`
  font-size: 0.8rem;
  color: #fcba03;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const SongTitle = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ArtistName = styled.div`
  font-size: 1.2rem;
  color: #ccc;
`;

const StationInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #888;
  display: flex;
  justify-content: space-between;
`;

const NoSongInfo = styled.div`
  font-size: 1.2rem;
  font-style: italic;
  color: #888;
  text-align: center;
  padding: 1rem 0;
`;

const TracklistButton = styled.button`
  background: transparent;
  color: #fcba03;
  border: 1px solid #fcba03;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #fcba03;
    color: black;
  }
`;

const TracklistContainer = styled.div`
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: #222;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const TrackItem = styled.div`
  padding: 0.5rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #333;
  display: flex;
  
  &:last-child {
    border-bottom: none;
  }
  
  ${({ current }) => current && `
    background-color: rgba(252, 186, 3, 0.1);
    font-weight: bold;
  `}
`;

const TrackNumber = styled.div`
  color: #fcba03;
  width: 30px;
`;

const TrackInfo = styled.div`
  flex: 1;
`;

const SongInfo = ({ song, station }) => {
  const [showTracklist, setShowTracklist] = React.useState(false);
  
  const toggleTracklist = () => {
    setShowTracklist(!showTracklist);
  };
  
  return (
    <InfoContainer>
      {song ? (
        <>
          <NowPlaying>Now Playing on {station.name}</NowPlaying>
          <SongTitle>{song.title}</SongTitle>
          <ArtistName>{song.artist}</ArtistName>
          
          <StationInfo>
            <div>Track {song.trackNumber} of {station.tracklist.length}</div>
            <div>Timestamp: {song.start}</div>
          </StationInfo>
          
          <TracklistButton onClick={toggleTracklist}>
            {showTracklist ? 'Hide Tracklist' : 'Show Full Tracklist'}
          </TracklistButton>
          
          {showTracklist && (
            <TracklistContainer>
              {station.tracklist.map(track => (
                <TrackItem 
                  key={track.trackNumber}
                  current={track.trackNumber === song.trackNumber}
                >
                  <TrackNumber>{track.trackNumber}.</TrackNumber>
                  <TrackInfo>
                    {track.artist} — {track.title}
                  </TrackInfo>
                </TrackItem>
              ))}
            </TracklistContainer>
          )}
        </>
      ) : (
        <NoSongInfo>
          Loading song information...
        </NoSongInfo>
      )}
    </InfoContainer>
  );
};

export default SongInfo; 