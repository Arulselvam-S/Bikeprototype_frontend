let currentSpeed = 0;
let crashed = false;
let latitude = null;
let longitude = null;

const CRASH_SPEED = 80;
const speedDiv = document.getElementById('speed');
const locationDiv = document.getElementById('location');

// 🛰️ Start live tracking
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
    locationDiv.innerText = "📍 Location not supported";
  }
}

startLiveLocation();

// 🏎️ Update speed display
function updateSpeedDisplay() {
  speedDiv.innerText = `Speed: ${currentSpeed} km/h`;
}

// 🚀 Accelerate
document.getElementById('accelerate-btn').onclick = () => {
  if (crashed) return alert("Bike crashed! Reset before accelerating again.");
  currentSpeed += 10;
  if (currentSpeed > 120) currentSpeed = 120;
  updateSpeedDisplay();
};

// 🛑 Brake
document.getElementById('brake-btn').onclick = () => {
  if (crashed) return alert("Bike crashed! Reset before braking again.");
  currentSpeed = Math.max(0, currentSpeed - 10);
  updateSpeedDisplay();
};

// 💥 Crash
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

// 🔄 Reset
document.getElementById('reset-btn').onclick = () => {
  currentSpeed = 0;
  crashed = false;
  updateSpeedDisplay();
};

// 📡 Send crash SOS
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
