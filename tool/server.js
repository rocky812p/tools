const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Check if FFmpeg is installed
function checkFFmpeg() {
    return new Promise((resolve, reject) => {
        ffmpeg.getAvailableFormats((err, formats) => {
            if (err) {
                console.error('FFmpeg is not installed or not properly configured');
                reject(new Error('FFmpeg is not installed. Please install FFmpeg first.'));
            } else {
                resolve(true);
            }
        });
    });
}

// Endpoint to check server status and FFmpeg
app.get('/status', async (req, res) => {
    try {
        await checkFFmpeg();
        res.json({ 
            status: 'ok', 
            message: 'Server is running and FFmpeg is installed',
            version: require('./package.json').version
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Endpoint to get video info
app.get('/video-info', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        const info = await ytdl.getInfo(videoUrl);
        
        // Check video duration
        const maxDuration = process.env.MAX_VIDEO_DURATION || 300; // 5 minutes
        if (parseInt(info.videoDetails.lengthSeconds) > maxDuration) {
            return res.status(400).json({ 
                error: `Video is too long. Maximum duration is ${maxDuration} seconds.` 
            });
        }

        res.json({
            title: info.videoDetails.title,
            duration: info.videoDetails.lengthSeconds,
            thumbnails: info.videoDetails.thumbnails,
            formats: info.formats.filter(f => f.hasVideo && f.hasAudio)
        });
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to process video
app.post('/process-video', async (req, res) => {
    try {
        await checkFFmpeg();

        const {
            videoUrl,
            startTime,
            duration,
            quality,
            aspectRatio,
            watermark,
            effects
        } = req.body;

        if (!videoUrl) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        // Validate duration
        const maxOutputDuration = process.env.MAX_OUTPUT_DURATION || 60;
        if (duration > maxOutputDuration) {
            return res.status(400).json({ 
                error: `Output duration cannot exceed ${maxOutputDuration} seconds` 
            });
        }

        // Generate unique filename
        const filename = `reel_${Date.now()}.mp4`;
        const outputPath = path.join(uploadsDir, filename);
        const tempPath = path.join(uploadsDir, `temp_${filename}`);

        console.log('Downloading video...');
        // Download video first
        const videoStream = ytdl(videoUrl, {
            quality: 'highest',
            filter: format => format.hasVideo && format.hasAudio
        });

        // Save original video first
        const writeStream = fs.createWriteStream(tempPath);
        videoStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            videoStream.on('error', reject);
        });

        console.log('Processing video...');
        // Process the downloaded video
        let ffmpegCommand = ffmpeg(tempPath)
            .setStartTime(startTime)
            .duration(duration)
            .outputOptions('-movflags faststart') // Enable streaming
            .outputOptions('-pix_fmt yuv420p'); // Ensure compatibility

        // Apply quality settings
        const qualities = {
            high: { width: 1080, height: 1920, bitrate: '4000k' },
            medium: { width: 720, height: 1280, bitrate: '2500k' },
            low: { width: 480, height: 854, bitrate: '1000k' }
        };

        const qualitySettings = qualities[quality] || qualities.medium;
        ffmpegCommand
            .size(`${qualitySettings.width}x${qualitySettings.height}`)
            .videoBitrate(qualitySettings.bitrate);

        // Apply aspect ratio with padding
        ffmpegCommand.videoFilters([
            {
                filter: 'scale',
                options: `w=${qualitySettings.width}:h=${qualitySettings.height}:force_original_aspect_ratio=decrease`
            },
            {
                filter: 'pad',
                options: `${qualitySettings.width}:${qualitySettings.height}:(ow-iw)/2:(oh-ih)/2`
            }
        ]);

        // Add watermark if provided
        if (watermark) {
            ffmpegCommand.videoFilters({
                filter: 'drawtext',
                options: {
                    text: watermark,
                    fontsize: Math.floor(qualitySettings.width / 20),
                    fontcolor: 'white',
                    x: '(w-text_w)-20',
                    y: '(h-text_h)-20',
                    shadowcolor: 'black',
                    shadowx: 2,
                    shadowy: 2
                }
            });
        }

        // Apply effects
        if (effects && effects.length > 0) {
            effects.forEach(effect => {
                switch (effect) {
                    case 'zoom':
                        ffmpegCommand.videoFilters('zoompan=z=1.2:d=1:s=1280x720');
                        break;
                    case 'fade':
                        ffmpegCommand.videoFilters(['fade=in:0:30', 'fade=out:end:30']);
                        break;
                    case 'flash':
                        ffmpegCommand.videoFilters('curves=lighter');
                        break;
                }
            });
        }

        // Process the video
        await new Promise((resolve, reject) => {
            ffmpegCommand
                .on('progress', progress => {
                    console.log('Processing: ' + progress.percent + '% done');
                })
                .on('end', () => {
                    console.log('Processing finished');
                    // Delete temp file
                    fs.unlink(tempPath, () => {});
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error:', err);
                    // Delete temp file
                    fs.unlink(tempPath, () => {});
                    reject(err);
                })
                .save(outputPath);
        });

        res.json({
            success: true,
            filename: filename,
            downloadUrl: `/download/${filename}`
        });

    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to download processed video
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (!err) {
                // Delete the file after download
                fs.unlink(filePath, () => {});
            }
        });
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Cleanup old files periodically
const cleanupInterval = parseInt(process.env.CLEANUP_INTERVAL) || 3600000; // 1 hour
setInterval(() => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) return;
        
        const now = Date.now();
        files.forEach(file => {
            if (file === '.gitkeep') return;
            
            const filePath = path.join(uploadsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                
                // Delete files older than 1 hour
                if (now - stats.mtime.getTime() > cleanupInterval) {
                    fs.unlink(filePath, () => {});
                }
            });
        });
    });
}, cleanupInterval);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
}); 