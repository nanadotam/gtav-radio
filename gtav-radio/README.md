# GTA V Radio Stations Web App

This web application simulates the radio station experience from Grand Theft Auto V, allowing users to:

- Browse and select from different GTA V radio stations
- Play the station's soundtrack from YouTube
- View the currently playing song information
- Jump to random points in the broadcast (like when entering a car in GTA)
- View the complete tracklist for each station

## Features

- **Station Selection**: Choose from multiple GTA V radio stations with circular station logos
- **YouTube Integration**: Each station streams its soundtrack from YouTube
- **Real-time Song Info**: Displays the currently playing song based on timestamp
- **Random Entry**: Enter at random points in the broadcast, just like in GTA
- **Full Tracklist**: View the complete tracklist for each station
- **Volume Control**: Adjust the volume to your preference

## Setup and Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Prepare the station data and icons:
   ```
   npm run prepareData
   ```
   This will:
   - Parse the station markdown files
   - Generate a JSON database of stations and tracks
   - Download and crop the station icons to circles

3. Start the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Data Structure

The app uses the following data structure for each radio station:

```json
{
  "id": "radio_los_santos",
  "name": "Radio Los Santos",
  "youtubeUrl": "https://www.youtube.com/watch?v=C3_FSXZtRe8",
  "iconUrl": "path/to/icon.png",
  "tracklist": [
    {
      "trackNumber": 1,
      "start": "0:00:10",
      "end": "0:03:22",
      "artist": "Artist Name",
      "title": "Song Title"
    },
    // More tracks...
  ]
}
```

## Adding New Stations

To add a new station, create a markdown file in the `Radio Stations` folder with the following format:

1. First line: YouTube URL to the station soundtrack
2. PNG: URL to the station logo image
3. Tracklist in the format: `XX. 0:00:00 Artist — Title`

Then run `npm run prepareData` to process the new station.

## Technologies Used

- React
- Styled Components
- react-youtube
- Node.js (for data processing)
- Canvas (for image processing)

## License

MIT License 