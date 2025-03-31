const fs = require('fs');
const path = require('path');

// Function to parse the station markdown files
function parseStationFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  
  // Extract YouTube URL from the first line
  const youtubeUrl = lines[0].trim();
  
  // Extract station name from the file name
  const fileName = path.basename(filePath, path.extname(filePath));
  // Handle special case for Space 103.2 .mp3.md
  const stationName = fileName.replace(' .mp3', '');
  
  // Extract PNG URL from the file (usually on the 3rd or 4th line)
  const pngLine = lines.find(line => line.includes('PNG:'));
  const iconUrl = pngLine ? pngLine.split('PNG:')[1].trim() : '';
  
  // Extract tracklist
  const tracklist = [];
  const trackPattern = /(\d+)\.\s+(\d+:\d+:\d+)\s+(.+?)\s+—\s+(.+)/;
  
  lines.forEach(line => {
    const match = line.match(trackPattern);
    if (match) {
      const [_, trackNumber, timestamp, artist, title] = match;
      
      // Parse the timestamp to get start time
      const startTime = timestamp;
      
      tracklist.push({
        trackNumber: parseInt(trackNumber),
        start: startTime,
        artist,
        title,
      });
    }
  });
  
  // Calculate end times based on the next song's start time
  for (let i = 0; i < tracklist.length - 1; i++) {
    tracklist[i].end = tracklist[i + 1].start;
  }
  
  // For the last track, set a default end time if we don't have it
  if (tracklist.length > 0) {
    const lastTrack = tracklist[tracklist.length - 1];
    if (!lastTrack.end) {
      // If this is part of a tracklist with multiple parts, we might not know the end time
      lastTrack.end = "end";
    }
  }
  
  // Generate a unique ID from the station name
  const id = stationName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  
  return {
    id,
    name: stationName,
    youtubeUrl,
    iconUrl,
    tracklist
  };
}

// Process all station files
function generateStationsDatabase() {
  const stationFiles = [
    '../../../Radio Stations/Radio Los Santos.md',
    '../../../Radio Stations/Los Santos Rock Radio.md',
    '../../../Radio Stations/Non-Stop-Pop FM.md',
    '../../../Radio Stations/Space 103.2 .mp3.md'
  ];
  
  const stations = stationFiles.map(file => parseStationFile(path.resolve(__dirname, file)));
  
  // Write the JSON database
  fs.writeFileSync(
    path.resolve(__dirname, 'stations.json'),
    JSON.stringify({ stations }, null, 2)
  );
  
  console.log(`Generated database with ${stations.length} radio stations.`);
}

generateStationsDatabase(); 