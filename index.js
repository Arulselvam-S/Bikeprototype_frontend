let currentSpeed = 0;
let crashed = false;
let latitude = null;
let longitude = null;

const CRASH_SPEED = 80; // speed threshold for crash
const speedDiv = document.getElementById('speed');
const locationDiv = document.getElementById('location'); // display location

// Start live tracking instead of manual interval
function startLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                console.log('Live location:', latitude, longitude);
                locationDiv.innerText = `📍 Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`;
            },
            (err) => console.error('Error getting location:', err.message),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
    } else {
        console.error('Geolocation not supported.');
    }
}

// start live tracking
startLiveLocation();

// Update speed display
function updateSpeedDisplay() {
    speedDiv.innerText = `Speed: ${currentSpeed} km/h`;
}

// Accelerate button
document.getElementById('accelerate-btn').onclick = () => {
    currentSpeed += 10;
    if (currentSpeed > 120) currentSpeed = 120;
    updateSpeedDisplay();
};

// Crash button
document.getElementById('crash-btn').onclick = () => {
    if (!crashed && currentSpeed >= CRASH_SPEED) {
        crashed = true;
        sendCrashSOS(currentSpeed);
        alert("🚨 Crash detected! SOS sent.");
    } else if (currentSpeed < CRASH_SPEED) {
        alert("Speed too low for a crash!");
    } else {
        alert("Crash already reported!");
    }
};

// Reset button
document.getElementById('reset-btn').onclick = () => {
    currentSpeed = 0;
    crashed = false;
    updateSpeedDisplay();
};

// Send crash SOS to backend
function sendCrashSOS(speed) {
    if (!latitude || !longitude) {
        console.warn("⚠ Location not ready yet. Sending without coordinates.");
    }

    fetch('/api/crash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed, latitude, longitude })
    })
    .then(res => res.json())
    .then(data => console.log('Crash reported:', data))
    .catch(err => console.error('Error sending crash SOS:', err));
}