# ToolKit Web App

A comprehensive web toolkit featuring multiple utilities including a YouTube to Instagram Reel converter, calculator, timer, and more.

## Features

- 🎥 YouTube to Instagram Reel Converter
  - Convert YouTube videos to Instagram Reel format
  - Customize aspect ratio (9:16, 1:1, etc.)
  - Add watermarks
  - Apply visual effects
  - High-quality output
- 🧮 Calculator
- ⏲️ Timer
- 💱 Currency Converter
- ⏱️ Stopwatch
- 📝 Notepad
- And more!

## Prerequisites

Before running this project, make sure you have the following installed:

1. [Node.js](https://nodejs.org/) (v14 or higher)
2. [FFmpeg](https://ffmpeg.org/download.html)

### Installing FFmpeg

#### Windows
1. Download FFmpeg from https://www.gyan.dev/ffmpeg/builds/
2. Extract the zip file
3. Add the `bin` folder to your system's PATH environment variable

#### Mac
```bash
brew install ffmpeg
```

#### Linux
```bash
sudo apt update
sudo apt install ffmpeg
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/toolkit-web-app.git
cd toolkit-web-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and visit:
```
http://localhost:3000
```

## Usage

### YouTube to Reel Converter

1. Go to the Tools page
2. Select "Video Converter"
3. Paste a YouTube URL
4. Customize your settings:
   - Clip duration (up to 60 seconds)
   - Quality (High/Medium/Low)
   - Aspect ratio (9:16 for Reels)
   - Add watermark (optional)
   - Apply effects (optional)
5. Click "Generate Reel"
6. Download when ready

### Other Tools

Each tool in the toolkit is designed to be intuitive and easy to use. Simply select the tool you want to use from the Tools page and follow the on-screen instructions.

## Project Structure

```
toolkit-web-app/
├── css/
│   └── styles.css
├── js/
│   ├── calculator.js
│   ├── common.js
│   ├── timer.js
│   ├── tools.js
│   └── videoconverter.js
├── uploads/          # Temporary video storage
├── index.html
├── tools.html
├── server.js
├── package.json
└── README.md
```

## Configuration

The server runs on port 3000 by default. You can change this in `server.js` if needed.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [FFmpeg](https://ffmpeg.org/) for video processing
- [ytdl-core](https://github.com/fent/node-ytdl-core) for YouTube video downloading
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Font Awesome](https://fontawesome.com/) for icons 