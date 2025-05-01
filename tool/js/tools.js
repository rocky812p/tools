// Calculator Functionality
function initCalculator() {
    const calcDisplay = document.getElementById('calcDisplay');
    let currentCalc = '';

    document.querySelectorAll('.calculator-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.textContent.trim();
            if (value === 'C') {
                currentCalc = '';
            } else if (value === '←') {
                currentCalc = currentCalc.slice(0, -1);
            } else if (value === '=') {
                try {
                    // Using Function instead of eval for better security
                    currentCalc = new Function('return ' + currentCalc)().toString();
                } catch {
                    currentCalc = 'Error';
                }
            } else {
                currentCalc += value;
            }
            calcDisplay.value = currentCalc;
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', (e) => {
        if (!document.getElementById('calculator').classList.contains('active')) return;
        
        const key = e.key;
        if (/[\d+\-*/.=]/.test(key)) {
            e.preventDefault();
            const btn = Array.from(document.querySelectorAll('.calculator-btn'))
                .find(b => b.textContent.trim() === key);
            if (btn) btn.click();
        } else if (key === 'Enter') {
            e.preventDefault();
            document.querySelector('.calculator-btn[data-key="="]').click();
        } else if (key === 'Backspace') {
            e.preventDefault();
            document.querySelector('.calculator-btn[data-key="←"]').click();
        }
    });
}

// Timer Functionality
function initTimer() {
    let timerInterval;
    let timerRunning = false;
    let timerTime = 0;
    const timerDisplay = document.getElementById('timerDisplay');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');

    function updateTimerDisplay() {
        const minutes = Math.floor(timerTime / 60);
        const seconds = timerTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    document.getElementById('startTimer').addEventListener('click', () => {
        if (!timerRunning) {
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            timerTime = minutes * 60 + seconds;
            
            if (timerTime > 0) {
                timerRunning = true;
                timerInterval = setInterval(() => {
                    if (timerTime <= 0) {
                        clearInterval(timerInterval);
                        timerRunning = false;
                        // Play sound when timer ends
                        const audio = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
                        audio.play();
                        return;
                    }
                    timerTime--;
                    updateTimerDisplay();
                }, 1000);
            }
        }
    });

    document.getElementById('pauseTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerRunning = false;
    });

    document.getElementById('resetTimer').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerRunning = false;
        timerTime = 0;
        minutesInput.value = '';
        secondsInput.value = '';
        updateTimerDisplay();
    });

    // Input validation
    minutesInput.addEventListener('input', () => {
        if (minutesInput.value < 0) minutesInput.value = 0;
    });

    secondsInput.addEventListener('input', () => {
        if (secondsInput.value < 0) secondsInput.value = 0;
        if (secondsInput.value > 59) secondsInput.value = 59;
    });
}

// Currency Converter
function initCurrencyConverter() {
    const exchangeRates = {
        USD: { EUR: 0.85, INR: 74.5, USD: 1 },
        EUR: { USD: 1.18, INR: 87.5, EUR: 1 },
        INR: { USD: 0.013, EUR: 0.011, INR: 1 }
    };

    const amount = document.getElementById('currencyAmount');
    const from = document.getElementById('fromCurrency');
    const to = document.getElementById('toCurrency');
    const result = document.getElementById('conversionResult');

    document.getElementById('convertCurrency').addEventListener('click', () => {
        if (!amount.value) {
            result.textContent = 'Please enter an amount';
            return;
        }

        const value = parseFloat(amount.value);
        const rate = exchangeRates[from.value][to.value];
        const converted = (value * rate).toFixed(2);
        result.textContent = `${value} ${from.value} = ${converted} ${to.value}`;
    });

    // Auto-convert on input
    amount.addEventListener('input', () => {
        if (amount.value) {
            document.getElementById('convertCurrency').click();
        }
    });
}

// Stopwatch
function initStopwatch() {
    let stopwatchInterval;
    let stopwatchRunning = false;
    let stopwatchTime = 0;
    let laps = [];
    const display = document.getElementById('stopwatchDisplay');
    const lapList = document.getElementById('lapTimes');

    function updateDisplay() {
        const hours = Math.floor(stopwatchTime / 360000);
        const minutes = Math.floor((stopwatchTime % 360000) / 6000);
        const seconds = Math.floor((stopwatchTime % 6000) / 100);
        const hundredths = stopwatchTime % 100;
        display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    document.getElementById('startStopwatch').addEventListener('click', () => {
        if (!stopwatchRunning) {
            stopwatchRunning = true;
            stopwatchInterval = setInterval(() => {
                stopwatchTime++;
                updateDisplay();
            }, 10);
        }
    });

    document.getElementById('stopStopwatch').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
    });

    document.getElementById('resetStopwatch').addEventListener('click', () => {
        clearInterval(stopwatchInterval);
        stopwatchRunning = false;
        stopwatchTime = 0;
        laps = [];
        updateDisplay();
        lapList.innerHTML = '';
    });

    document.getElementById('lapStopwatch').addEventListener('click', () => {
        if (stopwatchRunning) {
            laps.push(stopwatchTime);
            const lapElement = document.createElement('div');
            lapElement.classList.add('lap-time', 'py-2', 'border-b', 'border-gray-200', 'dark:border-gray-700');
            lapElement.textContent = `Lap ${laps.length}: ${display.textContent}`;
            lapList.insertBefore(lapElement, lapList.firstChild);
        }
    });
}

// Unit Converter
function initUnitConverter() {
    const unitTypes = {
        length: {
            units: ['cm', 'm', 'inch'],
            conversions: {
                cm: { m: 0.01, inch: 0.393701 },
                m: { cm: 100, inch: 39.3701 },
                inch: { cm: 2.54, m: 0.0254 }
            }
        },
        weight: {
            units: ['kg', 'lb'],
            conversions: {
                kg: { lb: 2.20462 },
                lb: { kg: 0.453592 }
            }
        },
        temperature: {
            units: ['Celsius', 'Fahrenheit'],
            conversions: {
                Celsius: { Fahrenheit: (c) => c * 9/5 + 32 },
                Fahrenheit: { Celsius: (f) => (f - 32) * 5/9 }
            }
        }
    };

    const typeSelect = document.getElementById('unitType');
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    const input = document.getElementById('unitInput');
    const result = document.getElementById('unitResult');

    function updateUnitSelects() {
        const type = typeSelect.value;
        const units = unitTypes[type].units;
        
        fromSelect.innerHTML = '';
        toSelect.innerHTML = '';
        
        units.forEach(unit => {
            fromSelect.add(new Option(unit, unit));
            toSelect.add(new Option(unit, unit));
        });

        // Trigger conversion if there's a value
        if (input.value) convert();
    }

    function convert() {
        const type = typeSelect.value;
        const fromUnit = fromSelect.value;
        const toUnit = toSelect.value;
        const value = parseFloat(input.value);

        if (isNaN(value)) {
            result.value = '';
            return;
        }

        if (fromUnit === toUnit) {
            result.value = value;
            return;
        }

        let converted;
        if (type === 'temperature') {
            converted = unitTypes[type].conversions[fromUnit][toUnit](value);
        } else {
            const conversions = unitTypes[type].conversions;
            if (conversions[fromUnit][toUnit]) {
                converted = value * conversions[fromUnit][toUnit];
            } else {
                converted = value / conversions[toUnit][fromUnit];
            }
        }

        result.value = converted.toFixed(4);
    }

    typeSelect.addEventListener('change', updateUnitSelects);
    input.addEventListener('input', convert);
    fromSelect.addEventListener('change', convert);
    toSelect.addEventListener('change', convert);
    document.getElementById('convertUnit').addEventListener('click', convert);

    // Initialize unit selects
    updateUnitSelects();
}

// Notepad
function initNotepad() {
    const notepad = document.getElementById('notepadContent');
    const savedNote = localStorage.getItem('note');

    if (savedNote) {
        notepad.value = savedNote;
    }

    document.getElementById('saveNote').addEventListener('click', () => {
        localStorage.setItem('note', notepad.value);
        // Show success message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg';
        message.textContent = 'Note saved successfully!';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 2000);
    });

    document.getElementById('clearNote').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the notepad?')) {
            notepad.value = '';
            localStorage.removeItem('note');
        }
    });

    // Auto-save functionality
    let autoSaveTimeout;
    notepad.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            localStorage.setItem('note', notepad.value);
        }, 1000);
    });
}

// Bill Maker
function initBillMaker() {
    let items = [];
    let billCounter = 1;

    // Initialize bill number
    const billNumber = document.getElementById('billNumber');
    const today = new Date();
    billNumber.value = `BILL${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(billCounter).padStart(3, '0')}`;

    // Set default date
    document.getElementById('billDate').valueAsDate = today;

    // Add new item row
    document.getElementById('addItem').addEventListener('click', () => {
        const tbody = document.getElementById('itemsTableBody');
        const tr = document.createElement('tr');
        const itemId = `item-${Date.now()}`;
        tr.id = itemId;
        tr.className = 'border-b dark:border-gray-700';
        tr.innerHTML = `
            <td class="px-4 py-3">
                <input type="text" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" placeholder="Item name">
            </td>
            <td class="px-4 py-3">
                <input type="number" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" value="1" min="1">
            </td>
            <td class="px-4 py-3">
                <input type="number" class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white" value="0.00" step="0.01">
            </td>
            <td class="px-4 py-3">
                <span class="font-semibold">₹0.00</span>
            </td>
            <td class="px-4 py-3">
                <button class="text-red-500 hover:text-red-600" onclick="deleteItem('${itemId}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);

        // Add event listeners for calculation
        const inputs = tr.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateTotals);
        });

        items.push({
            id: itemId,
            name: '',
            quantity: 1,
            price: 0
        });
    });

    // Delete item
    window.deleteItem = (itemId) => {
        const item = document.getElementById(itemId);
        item.remove();
        items = items.filter(i => i.id !== itemId);
        calculateTotals();
    };

    // Calculate totals
    function calculateTotals() {
        let subtotal = 0;
        const rows = document.getElementById('itemsTableBody').getElementsByTagName('tr');
        
        Array.from(rows).forEach(row => {
            const quantity = parseFloat(row.querySelectorAll('input')[1].value) || 0;
            const price = parseFloat(row.querySelectorAll('input')[2].value) || 0;
            const total = quantity * price;
            row.querySelector('span').textContent = `₹${total.toFixed(2)}`;
            subtotal += total;
        });

        const gstAmount = subtotal * 0.18;
        const total = subtotal + gstAmount;

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('gst').textContent = `₹${gstAmount.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    // Download PDF
    document.getElementById('downloadBill').addEventListener('click', async () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const billContent = document.getElementById('billContent');

        // Save current styles
        const originalStyles = {
            backgroundColor: billContent.style.backgroundColor,
            color: billContent.style.color
        };

        // Set white background for PDF
        billContent.style.backgroundColor = 'white';
        billContent.style.color = 'black';

        try {
            const canvas = await html2canvas(billContent);
            const imgData = canvas.toDataURL('image/png');
            
            // Add company header
            doc.setFontSize(20);
            doc.setTextColor(0, 0, 255);
            doc.text('Your Company Name', 105, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text('Address: Your Company Address', 105, 22, { align: 'center' });
            doc.text('Phone: +1234567890 | Email: contact@company.com', 105, 27, { align: 'center' });
            
            // Add bill content
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            doc.addImage(imgData, 'PNG', 0, 35, pdfWidth, pdfHeight);

            // Add footer
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.setFontSize(8);
            doc.setTextColor(100);
            doc.text('Thank you for your business!', 105, pageHeight - 10, { align: 'center' });

            // Save PDF
            const customerName = document.getElementById('customerName').value || 'Customer';
            const billDate = document.getElementById('billDate').value;
            doc.save(`Bill-${customerName}-${billDate}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }

        // Restore original styles
        billContent.style.backgroundColor = originalStyles.backgroundColor;
        billContent.style.color = originalStyles.color;
    });

    // Add first item row by default
    document.getElementById('addItem').click();
}

// Video Player
function initVideoPlayer() {
    let player;
    let currentVideo = null;
    const watchHistory = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    const uploadSection = document.getElementById('uploadSection');
    const playerSection = document.getElementById('playerSection');
    const historySection = document.getElementById('historySection');
    const videoUpload = document.getElementById('videoUpload');
    const qualitySelect = document.getElementById('qualitySelect');
    const speedSelect = document.getElementById('speedSelect');
    const subtitleSelect = document.getElementById('subtitleSelect');
    const audioSelect = document.getElementById('audioSelect');
    const toggleHistory = document.getElementById('toggleHistory');
    const clearHistory = document.getElementById('clearHistory');
    const historyList = document.getElementById('historyList');

    // Initialize Plyr player
    player = new Plyr('#player', {
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'pip',
            'fullscreen'
        ],
        settings: ['quality', 'speed'],
        quality: {
            default: 720,
            options: [360, 480, 720, 1080]
        }
    });

    // Handle file upload
    videoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleVideoUpload(file);
        }
    });

    // Drag and drop functionality
    uploadSection.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadSection.classList.add('border-blue-500');
    });

    uploadSection.addEventListener('dragleave', () => {
        uploadSection.classList.remove('border-blue-500');
    });

    uploadSection.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadSection.classList.remove('border-blue-500');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('video/')) {
            videoUpload.files = e.dataTransfer.files;
            handleVideoUpload(file);
        }
    });

    // Handle video upload
    function handleVideoUpload(file) {
        const videoURL = URL.createObjectURL(file);
        const videoElement = document.querySelector('#player');
        videoElement.src = videoURL;
        
        // Update video information
        document.getElementById('videoTitle').textContent = file.name;
        document.getElementById('videoSize').textContent = formatFileSize(file.size);
        document.getElementById('videoFormat').textContent = file.type.split('/')[1].toUpperCase();
        
        // Get video duration and resolution when metadata is loaded
        videoElement.onloadedmetadata = () => {
            document.getElementById('videoDuration').textContent = formatDuration(videoElement.duration);
            document.getElementById('videoResolution').textContent = `${videoElement.videoWidth}x${videoElement.videoHeight}`;
        };

        // Show player section and hide upload section
        uploadSection.classList.add('hidden');
        playerSection.classList.remove('hidden');
        historySection.classList.add('hidden');

        // Add to watch history
        addToHistory(file.name, videoURL);
        
        // Reset player
        player.source = {
            type: 'video',
            sources: [{
                src: videoURL,
                type: file.type
            }]
        };
        currentVideo = file;
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Format duration
    function formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Handle quality change
    qualitySelect.addEventListener('change', () => {
        const quality = parseInt(qualitySelect.value);
        if (quality && player) {
            player.quality = quality;
        }
    });

    // Handle speed change
    speedSelect.addEventListener('change', () => {
        const speed = parseFloat(speedSelect.value);
        if (speed && player) {
            player.speed = speed;
        }
    });

    // Handle subtitle change
    subtitleSelect.addEventListener('change', () => {
        // In a real implementation, you would load the appropriate subtitle file here
        console.log('Selected subtitle:', subtitleSelect.value);
    });

    // Handle audio track change
    audioSelect.addEventListener('change', () => {
        // In a real implementation, you would switch audio tracks here
        console.log('Selected audio track:', audioSelect.value);
    });

    // Toggle history section
    toggleHistory.addEventListener('click', () => {
        if (historySection.classList.contains('hidden')) {
            uploadSection.classList.add('hidden');
            playerSection.classList.add('hidden');
            historySection.classList.remove('hidden');
            updateHistoryList();
        } else {
            historySection.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            if (currentVideo) {
                playerSection.classList.remove('hidden');
            }
        }
    });

    // Clear history
    clearHistory.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your watch history?')) {
            localStorage.setItem('watchHistory', '[]');
            updateHistoryList();
        }
    });

    // Add to watch history
    function addToHistory(title, url) {
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        const timestamp = new Date().toISOString();
        
        // Remove duplicate if exists
        const index = history.findIndex(item => item.title === title);
        if (index !== -1) {
            history.splice(index, 1);
        }
        
        // Add new entry at the beginning
        history.unshift({ title, url, timestamp });
        
        // Keep only last 50 entries
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('watchHistory', JSON.stringify(history));
        updateHistoryList();
    }

    // Update history list
    function updateHistoryList() {
        const history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">No watch history</p>';
            return;
        }

        history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
            div.innerHTML = `
                <div class="flex items-center space-x-4">
                    <i class="fas fa-play-circle text-blue-500 text-xl"></i>
                    <div>
                        <h4 class="text-gray-800 dark:text-white font-medium">${item.title}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                </div>
                <button class="text-blue-500 hover:text-blue-600" onclick="playHistoryVideo('${item.url}', '${item.title}')">
                    <i class="fas fa-play"></i>
                </button>
            `;
            historyList.appendChild(div);
        });
    }

    // Play video from history
    window.playHistoryVideo = (url, title) => {
        const videoElement = document.querySelector('#player');
        videoElement.src = url;
        document.getElementById('videoTitle').textContent = title;
        
        historySection.classList.add('hidden');
        playerSection.classList.remove('hidden');
        uploadSection.classList.add('hidden');

        player.source = {
            type: 'video',
            sources: [{
                src: url,
                type: 'video/mp4' // Assuming MP4 format for history videos
            }]
        };
    };

    // Update history list on init
    updateHistoryList();
}

// Initialize all tools
document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
    initTimer();
    initCurrencyConverter();
    initStopwatch();
    initUnitConverter();
    initNotepad();
    initBillMaker();
    initVideoPlayer();
    
    // Initialize video converter
    if (document.getElementById('videoconverter')) {
        loadToolScript('videoconverter');
    }
});

// Tool Scripts
const toolScripts = {
    calculator: '/js/calculator.js',
    timer: '/js/timer.js',
    currencyconverter: '/js/currencyconverter.js',
    stopwatch: '/js/stopwatch.js',
    unitconverter: '/js/unitconverter.js',
    notepad: '/js/notepad.js',
    billmaker: '/js/billmaker.js',
    videoplayer: '/js/videoplayer.js',
    videoconverter: '/js/videoconverter.js'
}; 