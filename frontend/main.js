import { initGlobe, updateMarkers } from './globe.js';
import { updateTopLocations } from './utils.js';

const { scene, globe, renderer, camera } = initGlobe();
document.getElementById('container').appendChild(renderer.domElement);

const dataBuffer = []; // accumulates all data
const frontendStart = Date.now(); // when the frontend started
let dataStart = null; // when the data timeline started
let stopTime = 10000; // stop requesting after 10s

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

const poller = setInterval(async () => {
  const now = Date.now();
  const elapsed = now - frontendStart;

  if (elapsed >= stopTime) {
    console.log("🛑 Stopped polling backend after", stopTime / 1000, "seconds.");
    clearInterval(poller);
    return;
  }

  try {
    const res = await fetch('http://localhost:5050/data');
    const allData = await res.json();

    if (!allData.length) {
      console.log("No data from backend yet.");
      return;
    }

    if (!dataStart) {
      dataStart = Date.parse(allData[0].timestamp);
      console.log("Data timeline starts at:", new Date(dataStart).toISOString());
    }

    const newData = allData.filter(d => {
      const ts = Date.parse(d.timestamp);
      const relativeTime = ts - dataStart;
      return relativeTime <= elapsed && !dataBuffer.find(p => p.timestamp === d.timestamp);
    });

    if (newData.length > 0) {
      dataBuffer.push(...newData); // accumulate points
      updateMarkers(globe, dataBuffer);
      updateTopLocations(dataBuffer);
    }

  } catch (err) {
    console.error("Fetch or parsing failed:", err);
  }
}, 1000); // poll more frequently for smooth accumulation
