const fs = require('fs');
const https = require('https');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Import the stations data (either from our JSON or placeholder)
let stationsData;
try {
  stationsData = require('./stations.json');
} catch (e) {
  stationsData = require('./stationsPlaceholder');
}

// Function to download an image from a URL
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close(() => resolve(filepath));
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => reject(err));
        });
      } else {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to crop an image to a circle
async function cropToCircle(imagePath, outputPath, size = 200) {
  try {
    // Load the image
    const image = await loadImage(imagePath);
    
    // Create a canvas with the desired dimensions
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create a circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    // Draw the image centered in the circle
    const aspectRatio = image.width / image.height;
    let drawWidth, drawHeight, drawX, drawY;
    
    if (aspectRatio > 1) {
      // Image is wider than tall
      drawHeight = size;
      drawWidth = size * aspectRatio;
      drawX = (size - drawWidth) / 2;
      drawY = 0;
    } else {
      // Image is taller than wide or square
      drawWidth = size;
      drawHeight = size / aspectRatio;
      drawX = 0;
      drawY = (size - drawHeight) / 2;
    }
    
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    
    // Save the result
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    
    return new Promise((resolve, reject) => {
      out.on('finish', () => resolve(outputPath));
      out.on('error', reject);
    });
  } catch (error) {
    console.error('Error cropping image:', error);
    throw error;
  }
}

// Main function to process all stations
async function processStationIcons() {
  const iconsDir = path.resolve(__dirname, '../../public/icons');
  
  // Create the icons directory if it doesn't exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  console.log('Processing station icons...');
  
  // Process each station
  for (const station of stationsData.stations) {
    if (!station.iconUrl) {
      console.log(`Skipping ${station.name} - No icon URL found`);
      continue;
    }
    
    try {
      // File paths
      const rawImagePath = path.join(iconsDir, `${station.id}_raw.png`);
      const croppedImagePath = path.join(iconsDir, `${station.id}.png`);
      
      // Download the image
      console.log(`Downloading ${station.name} icon...`);
      await downloadImage(station.iconUrl, rawImagePath);
      
      // Crop to circle
      console.log(`Cropping ${station.name} icon to circle...`);
      await cropToCircle(rawImagePath, croppedImagePath);
      
      // Clean up the raw image
      fs.unlinkSync(rawImagePath);
      
      console.log(`Processed ${station.name} icon successfully.`);
    } catch (error) {
      console.error(`Error processing ${station.name} icon:`, error);
    }
  }
  
  console.log('All stations processed.');
}

// Run the main function
processStationIcons(); 