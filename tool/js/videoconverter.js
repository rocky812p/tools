// DOM Elements
const youtubeUrlInput = document.getElementById('youtubeUrl');
const fetchVideoBtn = document.getElementById('fetchVideo');
const videoPreview = document.getElementById('videoPreview');
const previewPlayer = document.getElementById('previewPlayer');
const clipDuration = document.getElementById('clipDuration');
const durationValue = document.getElementById('durationValue');
const startTime = document.getElementById('startTime');
const generateReelBtn = document.getElementById('generateReel');
const downloadReelBtn = document.getElementById('downloadReel');
const conversionProgress = document.getElementById('conversionProgress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const effectButtons = document.querySelectorAll('.effect-btn');
const outputQuality = document.getElementById('outputQuality');
const aspectRatio = document.getElementById('aspectRatio');
const watermarkText = document.getElementById('watermarkText');
const toggleWatermark = document.getElementById('toggleWatermark');
const watermarkPreview = document.getElementById('watermarkPreview');
const autoDetectViral = document.getElementById('autoDetectViral');

// State
let currentVideo = null;
let selectedEffects = new Set();
let videoAnalysis = null;

// Server configuration
const SERVER_URL = 'http://localhost:3000';

// Initialize
async function init() {
    setupEventListeners();
    updateDurationValue();
    
    // Check server status
    try {
        const response = await fetch(`${SERVER_URL}/status`);
        const data = await response.json();
        if (data.status !== 'ok') {
            showNotification('Server error: ' + data.message, 'error');
        }
    } catch (error) {
        showNotification('Cannot connect to server. Please make sure the server is running.', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    fetchVideoBtn.addEventListener('click', handleFetchVideo);
    clipDuration.addEventListener('input', updateDurationValue);
    generateReelBtn.addEventListener('click', handleGenerateReel);
    downloadReelBtn.addEventListener('click', handleDownload);
    effectButtons.forEach(btn => {
        btn.addEventListener('click', () => toggleEffect(btn));
    });
    
    aspectRatio.addEventListener('change', updateVideoPreview);
    watermarkText.addEventListener('input', updateWatermark);
    toggleWatermark.addEventListener('click', toggleWatermarkVisibility);
    autoDetectViral.addEventListener('change', handleViralDetection);

    // Add keyboard support for URL input
    youtubeUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchVideoBtn.click();
        }
    });
}

// Update duration value display
function updateDurationValue() {
    durationValue.textContent = `${clipDuration.value}s`;
}

// Toggle effect selection
function toggleEffect(button) {
    button.classList.toggle('bg-blue-500');
    button.classList.toggle('text-white');
    const effect = button.textContent.trim().toLowerCase();
    if (selectedEffects.has(effect)) {
        selectedEffects.delete(effect);
    } else {
        selectedEffects.add(effect);
    }
    applyEffectsPreview();
}

// Update video preview based on aspect ratio
function updateVideoPreview() {
    if (!previewPlayer.src && !previewPlayer.poster) return;

    const ratio = aspectRatio.value;
    const container = previewPlayer.parentElement;
    
    // Remove previous aspect ratio
    container.className = container.className.replace(/aspect-\[\d+:\d+\]/, '');
    
    // Add new aspect ratio
    container.classList.add(`aspect-[${ratio.replace(':', '/')}]`);
    
    // Update video object-fit based on ratio
    previewPlayer.style.objectFit = 'contain';
}

// Update watermark
function updateWatermark() {
    const text = watermarkText.value;
    watermarkPreview.textContent = text || '@YourWatermark';
    if (text) {
        watermarkPreview.classList.remove('hidden');
    }
}

// Toggle watermark visibility
function toggleWatermarkVisibility() {
    watermarkPreview.classList.toggle('hidden');
    toggleWatermark.querySelector('i').classList.toggle('fa-eye');
    toggleWatermark.querySelector('i').classList.toggle('fa-eye-slash');
}

// Handle viral detection
async function handleViralDetection() {
    if (!currentVideo || !autoDetectViral.checked) return;
    
    try {
        showProgress('Analyzing video for viral segments...');
        
        // Simulate video analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock viral segments detection
        videoAnalysis = {
            viralSegments: [
                { start: 5, duration: 15, confidence: 0.85 },
                { start: 45, duration: 20, confidence: 0.92 }
            ]
        };
        
        // Auto-select the highest confidence segment
        const bestSegment = videoAnalysis.viralSegments.reduce((a, b) => 
            a.confidence > b.confidence ? a : b
        );
        
        startTime.value = bestSegment.start;
        clipDuration.value = bestSegment.duration;
        updateDurationValue();
        
        hideProgress();
        showNotification('Found viral segments! Settings updated.', 'success');
    } catch (error) {
        hideProgress();
        showNotification('Error analyzing video: ' + error.message, 'error');
    }
}

// Apply effects preview
function applyEffectsPreview() {
    previewPlayer.style.transition = 'all 0.3s ease';
    
    // Remove all previous effects
    previewPlayer.className = 'w-full h-full';
    
    // Apply selected effects
    selectedEffects.forEach(effect => {
        switch(effect) {
            case 'zoom':
                previewPlayer.classList.add('hover:scale-110');
                break;
            case 'fade':
                previewPlayer.classList.add('opacity-90');
                break;
            case 'bounce':
                previewPlayer.classList.add('animate-bounce');
                break;
            case 'flash':
                previewPlayer.classList.add('animate-pulse');
                break;
        }
    });
}

// Handle video fetch
async function handleFetchVideo() {
    const url = youtubeUrlInput.value.trim();
    if (!isValidYoutubeUrl(url)) {
        showNotification('Please enter a valid YouTube URL', 'error');
        return;
    }

    try {
        showProgress('Fetching video information...');
        fetchVideoBtn.disabled = true;
        
        const response = await fetch(`${SERVER_URL}/video-info?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch video');
        }

        // Update preview with thumbnail
        const thumbnail = data.thumbnails[data.thumbnails.length - 1].url;
        previewPlayer.src = ''; // Clear any existing video
        previewPlayer.poster = thumbnail;
        videoPreview.classList.remove('hidden');
        
        currentVideo = {
            id: extractVideoId(url),
            url: url,
            title: data.title,
            duration: data.duration
        };
        
        // Enable controls
        generateReelBtn.disabled = false;
        
        // Reset effects
        selectedEffects.clear();
        effectButtons.forEach(btn => {
            btn.classList.remove('bg-blue-500', 'text-white');
        });
        
        // Update max duration based on video length
        clipDuration.max = Math.min(60, data.duration);
        clipDuration.value = Math.min(30, data.duration);
        updateDurationValue();
        
        if (autoDetectViral.checked) {
            handleViralDetection();
        }

        hideProgress();
        showNotification('Video fetched successfully!', 'success');
    } catch (error) {
        hideProgress();
        showNotification('Error fetching video: ' + error.message, 'error');
    } finally {
        fetchVideoBtn.disabled = false;
    }
}

// Handle reel generation
async function handleGenerateReel() {
    if (!currentVideo) {
        showNotification('Please fetch a video first', 'error');
        return;
    }

    try {
        showProgress('Starting video processing...');
        generateReelBtn.disabled = true;
        downloadReelBtn.classList.add('hidden');

        // Prepare request data
        const requestData = {
            videoUrl: currentVideo.url,
            startTime: parseInt(startTime.value) || 0,
            duration: parseInt(clipDuration.value) || 30,
            quality: outputQuality.value,
            aspectRatio: aspectRatio.value,
            watermark: watermarkText.value,
            effects: Array.from(selectedEffects)
        };

        // Send process request to server
        const response = await fetch(`${SERVER_URL}/process-video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to process video');
        }

        // Store download URL
        currentVideo.downloadUrl = data.downloadUrl;
        
        // Show download button
        downloadReelBtn.classList.remove('hidden');
        hideProgress();
        showNotification('Reel generated successfully! Click Download to save.', 'success');
    } catch (error) {
        hideProgress();
        showNotification('Error generating reel: ' + error.message, 'error');
    } finally {
        generateReelBtn.disabled = false;
    }
}

// Handle reel download
async function handleDownload() {
    if (!currentVideo || !currentVideo.downloadUrl) {
        showNotification('Please generate the reel first', 'error');
        return;
    }

    try {
        showProgress('Starting download...');
        downloadReelBtn.disabled = true;

        // Create a download link
        const a = document.createElement('a');
        a.href = currentVideo.downloadUrl;
        a.download = `reel_${currentVideo.title}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        hideProgress();
        showNotification('Download started!', 'success');
    } catch (error) {
        hideProgress();
        showNotification('Error downloading reel: ' + error.message, 'error');
    } finally {
        downloadReelBtn.disabled = false;
    }
}

// Utility functions
function isValidYoutubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
}

function extractVideoId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

// Progress handling
function showProgress(message) {
    conversionProgress.classList.remove('hidden');
    progressText.textContent = message;
    progressBar.style.width = '0%';
    updateProgress(0);
}

function updateProgress(percent) {
    progressBar.style.width = `${percent}%`;
}

function hideProgress() {
    conversionProgress.classList.add('hidden');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
    } text-white z-50 animate-fade-in`;
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${
        type === 'success' ? 'check-circle' :
        type === 'error' ? 'exclamation-circle' :
        'info-circle'
    } mr-2`;
    
    notification.appendChild(icon);
    notification.appendChild(document.createTextNode(message));
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init); 