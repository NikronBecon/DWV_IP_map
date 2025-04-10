import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import ThreeGlobe from 'three-globe';

export function initGlobe() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 300;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  const globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .pointsData([])
    .pointAltitude(0.005)  // 🔸 low = dot-like, not cylinder
    .pointRadius(0.4)      // 🔸 slightly visible
    .pointColor(() => 'red'); // 🔴 flat red

  scene.add(globe);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);  // bright globe
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  new OrbitControls(camera, renderer.domElement);

  return { scene, globe, renderer, camera };
}

export function updateMarkers(globe, data) {
  globe.pointsData(data.map(d => ({
    lat: parseFloat(d.latitude),
    lng: parseFloat(d.longitude),
    size: 0.4,
    color: 'red',
  })));
}
