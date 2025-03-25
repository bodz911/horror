// Game State
let timeInStudio = 0;
let isSpeaking = false;
let staticTimer = null;
let voiceStream = null;

// DOM Elements
const radioText = document.getElementById('radio-text');
const timerElement = document.getElementById('timer');
const micStatus = document.getElementById('mic-status');
const staticOverlay = document.getElementById('static');

// Creepy radio lines
const radioLines = [
    "CALLER: 'Turn back... you don't belong here'",
    "RADIO HOST: 'The show must go on...'",
    "STATIC: '...K̸i̷l̴l̸ ̸t̷h̷e̸ ̷h̴o̴s̷t̴...'",
    "ANNOUNCER: 'Contestant... you're NEXT'",
    "WHISPER: 'They're watching through the screen'"
];

// Initialize microphone
async function initMicrophone() {
    try {
        voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStatus.textContent = "MIC: READY (Hold SPACE to speak)";
    } catch (err) {
        micStatus.textContent = "MIC: BLOCKED (Check permissions)";
    }
}

// Update timer every second
function updateTimer() {
    timeInStudio++;
    timerElement.textContent = `TIME IN STUDIO: ${timeInStudio}s`;
    
    // Every 15 seconds, change radio text
    if (timeInStudio % 15 === 0) {
        const randomLine = radioLines[Math.floor(Math.random() * radioLines.length)];
        radioText.textContent = randomLine;
        radioText.classList.add('glitch');
        setTimeout(() => radioText.classList.remove('glitch'), 1000);
    }
    
    // After 30 seconds, static jumpscare chance increases
    if (timeInStudio > 30 && Math.random() > 0.7 && !staticOverlay.classList.contains('hidden')) {
        triggerStatic();
    }
}

// Trigger static screen
function triggerStatic() {
    staticOverlay.classList.remove('hidden');
    setTimeout(() => {
        staticOverlay.classList.add('hidden');
    }, 500 + Math.random() * 1000);
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && voiceStream) {
        isSpeaking = true;
        micStatus.textContent = "MIC: TRANSMITTING (They hear you...)";
        // Speaking keeps the static away
        if (staticTimer) clearTimeout(staticTimer);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        isSpeaking = false;
        micStatus.textContent = "MIC: READY (Hold SPACE to speak)";
        // Not speaking? Danger increases...
        staticTimer = setTimeout(triggerStatic, 3000);
    }
});

// Start game
initMicrophone();
setInterval(updateTimer, 1000);
staticTimer = setTimeout(triggerStatic, 10000); // First static after 10s