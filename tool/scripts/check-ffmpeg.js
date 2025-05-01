const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkFFmpeg() {
    try {
        // Try to execute ffmpeg -version
        execSync('ffmpeg -version', { stdio: 'ignore' });
        console.log('✅ FFmpeg is installed and working correctly.');
        return true;
    } catch (error) {
        console.error('❌ FFmpeg is not installed or not properly configured.');
        console.log('\nPlease install FFmpeg:');
        console.log('\nWindows:');
        console.log('1. Download from https://www.gyan.dev/ffmpeg/builds/');
        console.log('2. Extract the zip file');
        console.log('3. Add the bin folder to your system\'s PATH environment variable');
        console.log('\nMac:');
        console.log('brew install ffmpeg');
        console.log('\nLinux:');
        console.log('sudo apt update && sudo apt install ffmpeg');
        return false;
    }
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('✅ Created uploads directory');
}

// Check FFmpeg installation
const ffmpegInstalled = checkFFmpeg();

// Exit with error if FFmpeg is not installed
if (!ffmpegInstalled) {
    process.exit(1);
} 