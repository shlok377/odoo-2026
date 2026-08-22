import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Globe3D() {
  const mountRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const globeGroupRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const loadedModelsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to Create Realistic Continent Map Texture for the Globe Base
  const createWorldMapTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep Burgundy Ocean Base
    ctx.fillStyle = '#42171c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Warm Cream Continent Fill (rgba 0.45)
    ctx.fillStyle = 'rgba(245, 239, 233, 0.45)';
    ctx.strokeStyle = 'rgba(245, 239, 233, 0.6)';
    ctx.lineWidth = 3;

    const mapCoords = (lng, lat) => ({
      x: ((lng + 180) / 360) * canvas.width,
      y: ((90 - lat) / 180) * canvas.height
    });

    const drawPolygon = (points) => {
      if (points.length === 0) return;
      ctx.beginPath();
      const first = mapCoords(points[0][0], points[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const pt = mapCoords(points[i][0], points[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Realistic Continent Coordinates
    const northAmerica = [[-168,66], [-140,60], [-125,48], [-120,34], [-105,20], [-90,15], [-80,8], [-77,8], [-80,25], [-75,35], [-60,46], [-64,60], [-80,68], [-115,70], [-130,70]];
    const southAmerica = [[-80,8], [-70,-10], [-40,-10], [-35,-5], [-40,-20], [-50,-30], [-70,-55], [-75,-45], [-80,-20]];
    const europe = [[-10,36], [0,44], [10,45], [30,40], [30,60], [20,65], [10,70], [-10,65], [-10,50]];
    const africa = [[-17,35], [10,37], [32,32], [43,12], [51,11], [40,-15], [33,-35], [18,-35], [12,-5], [-17,15]];
    const asia = [[30,40], [60,40], [70,20], [80,10], [100,5], [120,20], [140,35], [140,60], [170,65], [180,70], [100,75], [60,75], [40,65]];
    const australia = [[113,-15], [130,-12], [142,-11], [153,-28], [148,-38], [135,-35], [115,-35], [113,-25]];
    const greenland = [[-55,60], [-40,65], [-20,70], [-25,82], [-60,82], [-70,75]];
    const indiaSub = [[68,24], [78,32], [88,26], [80,8], [72,12]];

    drawPolygon(northAmerica);
    drawPolygon(southAmerica);
    drawPolygon(europe);
    drawPolygon(africa);
    drawPolygon(asia);
    drawPolygon(australia);
    drawPolygon(greenland);
    drawPolygon(indiaSub);

    return new THREE.CanvasTexture(canvas);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Main Globe Group with Right-Tilt (23.5 degrees)
    const globeGroup = new THREE.Group();
    globeGroup.rotation.z = -0.41; // Right-tilted axis
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 3. Globe Sphere Mesh
    const worldTexture = createWorldMapTexture();
    const globeGeometry = new THREE.SphereGeometry(2.05, 128, 128);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: worldTexture,
      specular: 0x66242a,
      shininess: 25,
      transparent: true,
      opacity: 0.98
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 4. Atmosphere Glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.18, 128, 128);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x7e2a33,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // 5. Flight Paths & City Pins
    const cityCoords = [
      { lat: 40.7128, lng: -74.0060 }, // NYC
      { lat: 51.5074, lng: -0.1278 },  // London
      { lat: 48.8566, lng: 2.3522 },   // Paris
      { lat: 35.6762, lng: 139.6503 }, // Tokyo
      { lat: 25.2048, lng: 55.2708 },  // Dubai
      { lat: 20.5937, lng: 78.9629 }   // India
    ];

    const convertLatLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    cityCoords.forEach((city) => {
      const pos = convertLatLngToVector3(city.lat, city.lng, 2.06);
      const pinGeometry = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xf5efe9 });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    for (let i = 0; i < cityCoords.length - 1; i++) {
      const start = convertLatLngToVector3(cityCoords[i].lat, cityCoords[i].lng, 2.06);
      const end = convertLatLngToVector3(cityCoords[i + 1].lat, cityCoords[i + 1].lng, 2.06);
      
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.55);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(40);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({ color: 0xf5efe9, transparent: true, opacity: 0.55 });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);
    }

    // 6. Real 3D Models Group from /models/ with Bounding Box Bounding Normalization
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    const gltfLoader = new GLTFLoader();

    // Target visual size matching compass perfectly (0.70 units) across ALL elements
    const TARGET_MODEL_SIZE = 0.70;

    // Symmetrical, perfectly balanced 8-point orbit positions (4 left, 4 right) around the globe
    const modelConfigs = [
      // Left Column (Top to Bottom)
      { name: 'balloon', path: '/models/balloon.glb', basePos: [-3.6, 1.8, 0], rot: [0.1, 0.4, 0], dir: [-0.4, 0.2] },
      { name: 'plane', path: '/models/plane.glb', basePos: [-3.9, 0.6, 0], rot: [0.2, 0.4, -0.2], dir: [-0.4, 0.1] },
      { name: 'cowboyhat', path: '/models/cowboyhat.glb', basePos: [-3.9, -0.6, 0], rot: [0.3, 0.3, 0.1], dir: [-0.4, -0.1] },
      { name: 'pin', path: '/models/pin.glb', basePos: [-3.6, -1.8, 0], rot: [0.1, 0.5, 0], dir: [-0.4, -0.2] },
      
      // Right Column (Top to Bottom)
      { name: 'compass', path: '/models/compass.glb', basePos: [3.6, 1.8, 0], rot: [0.3, -0.3, 0.1], dir: [0.4, 0.2] },
      { name: 'camera', path: '/models/camera.glb', basePos: [3.9, 0.6, 0], rot: [0.2, -0.4, 0.1], dir: [0.4, 0.1] },
      { name: 'palmtree', path: '/models/palmtree.glb', basePos: [3.9, -0.6, 0], rot: [0.1, -0.3, 0], dir: [0.4, -0.1] },
      { name: 'island', path: '/models/island.glb', basePos: [3.6, -1.8, 0], rot: [0.3, -0.4, 0.1], dir: [0.4, -0.2] }
    ];

    const loadedList = [];

    modelConfigs.forEach((cfg) => {
      gltfLoader.load(
        cfg.path,
        (gltf) => {
          const rawMesh = gltf.scene;

          // Compute exact natural bounding box
          const box = new THREE.Box3().setFromObject(rawMesh);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);

          // Equalize scale so EVERY model matches TARGET_MODEL_SIZE (compass size)
          const normScale = maxDim > 0 ? (TARGET_MODEL_SIZE / maxDim) : 1;
          rawMesh.scale.set(normScale, normScale, normScale);

          // Center the geometry origin
          const center = new THREE.Vector3();
          box.getCenter(center);
          rawMesh.position.sub(center.multiplyScalar(normScale));

          // Pivot wrapper at balanced position
          const wrapper = new THREE.Group();
          wrapper.position.set(...cfg.basePos);
          wrapper.rotation.set(...cfg.rot);
          wrapper.add(rawMesh);

          modelsGroup.add(wrapper);
          loadedList.push({ wrapper, basePos: cfg.basePos, dir: cfg.dir });
        },
        undefined,
        (err) => {
          console.warn(`Could not load GLB model ${cfg.path}:`, err);
        }
      );
    });

    loadedModelsRef.current = loadedList;

    // 7. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf5efe9, 1.2);
    dirLight1.position.set(5, 4, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7e2a33, 0.8);
    dirLight2.position.set(-5, -4, -6);
    scene.add(dirLight2);

    // 8. Render Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Gentle floating levitation animation
      const time = Date.now() * 0.0015;
      loadedList.forEach((item, idx) => {
        if (item.wrapper) {
          item.wrapper.position.y = item.basePos[1] + Math.sin(time + idx * 1.5) * 0.1;
          item.wrapper.rotation.y += 0.005;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Compute Scroll Metrics
  const maxScroll = 550;
  const scrollProgress = Math.min(scrollY / maxScroll, 1);

  // Scroll Down -> Globe Rotates Right (+Y) and Zooms in
  useEffect(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = scrollProgress * Math.PI * 1.25;
    }

    // Smoothly distribute models gently outward on scroll down without going off-screen
    loadedModelsRef.current.forEach((item) => {
      if (item.wrapper) {
        item.wrapper.position.x = item.basePos[0] + item.dir[0] * scrollProgress * 0.6;
        item.wrapper.position.y = item.basePos[1] + item.dir[1] * scrollProgress * 0.4;
      }
    });
  }, [scrollProgress]);

  // Clamped Zoom Scale (1.0 to 1.15)
  const globeScale = 1 + scrollProgress * 0.15;

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center" style={{ height: '560px', overflow: 'hidden' }}>
      
      {/* 3D WebGL Globe & Bounding-Box Equalized 3D Models Canvas */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          transform: `scale(${globeScale})`,
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'none'
        }} 
      />

    </div>
  );
}
