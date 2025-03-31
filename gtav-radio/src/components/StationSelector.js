import React from 'react';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
  gap: 1.5rem;
`;

const StationButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 50%;
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  
  ${({ active }) => active && `
    box-shadow: 0 0 20px 5px rgba(255, 215, 0, 0.7);
    transform: scale(1.1);
  `}
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const StationImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border: 3px solid ${props => props.active ? '#fcba03' : '#333'};
  box-sizing: border-box;
`;

const StationName = styled.div`
  color: ${props => props.active ? '#fcba03' : '#fff'};
  font-size: 0.8rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  margin-top: 0.5rem;
  text-align: center;
  max-width: 120px;
  text-shadow: ${props => props.active ? '0 0 5px rgba(252, 186, 3, 0.7)' : 'none'};
`;

const StationItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StationSelector = ({ stations, currentStation, onStationChange }) => {
  return (
    <SelectorContainer>
      {stations.map(station => (
        <StationItem key={station.id}>
          <StationButton 
            onClick={() => onStationChange(station)}
            active={currentStation.id === station.id}
            aria-label={`Select ${station.name}`}
          >
            <StationImage 
              src={station.iconUrl} 
              alt={station.name}
              active={currentStation.id === station.id}
            />
          </StationButton>
          <StationName active={currentStation.id === station.id}>
            {station.name}
          </StationName>
        </StationItem>
      ))}
    </SelectorContainer>
  );
};

export default StationSelector; 