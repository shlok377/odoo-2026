import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Globe3D() {
  const mountRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const globeGroupRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const loadedModelsRef = useRef([]);
  const pulseParticlesRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to Create Ultra-Detailed World Map Texture for the Masterpiece Globe
  const createDetailedWorldMapTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Rich Warm Burgundy Ocean Base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#2e0f13');
    oceanGrad.addColorStop(0.5, '#4a191f');
    oceanGrad.addColorStop(1, '#2e0f13');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Global Lat / Long Graticule Lines (15-degree grid)
    ctx.strokeStyle = 'rgba(239, 226, 211, 0.08)';
    ctx.lineWidth = 1;
    for (let lng = -180; lng <= 180; lng += 15) {
      const x = ((lng + 180) / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let lat = -90; lat <= 90; lat += 15) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Faint Equator & Prime Meridian Grid Lines
    ctx.strokeStyle = 'rgba(239, 226, 211, 0.22)';
    ctx.lineWidth = 2;
    const equatorY = canvas.height / 2;
    const primeX = canvas.width / 2;
    ctx.beginPath(); ctx.moveTo(0, equatorY); ctx.lineTo(canvas.width, equatorY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(primeX, 0); ctx.lineTo(primeX, canvas.height); ctx.stroke();

    // 3. High-Detail Landmass Polygon Coordinates & Drawer
    const mapCoords = (lng, lat) => ({
      x: ((lng + 180) / 360) * canvas.width,
      y: ((90 - lat) / 180) * canvas.height
    });

    const drawLandmass = (points, isIsland = false) => {
      if (!points || points.length === 0) return;
      ctx.beginPath();
      const first = mapCoords(points[0][0], points[0][1]);
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const pt = mapCoords(points[i][0], points[i][1]);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      // Warm Cream Continent Fill
      ctx.fillStyle = isIsland ? 'rgba(245, 239, 233, 0.58)' : 'rgba(245, 239, 233, 0.48)';
      ctx.fill();

      // Glowing Coastline Outline
      ctx.strokeStyle = 'rgba(245, 239, 233, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    };

    // Realistic Continent Coordinates
    const northAmerica = [[-168,66], [-150,60], [-140,58], [-130,52], [-125,48], [-124,40], [-117,32.5], [-110,23], [-105,20], [-90,15], [-88,15], [-83,9], [-77,8], [-80,25], [-81,30], [-75,35], [-70,41], [-60,46], [-64,55], [-68,60], [-80,68], [-95,70], [-115,70], [-130,70], [-145,68]];
    const centralAmerica = [[-90,16], [-88,13], [-83,9], [-77,8], [-80,9], [-85,13], [-91,15]];
    const southAmerica = [[-77,8], [-72,12], [-60,8], [-50,0], [-35,-5], [-35,-10], [-40,-20], [-48,-28], [-55,-38], [-65,-50], [-70,-55], [-75,-48], [-73,-40], [-72,-30], [-75,-20], [-80,-5], [-80,5]];
    const ukIreland = [[-10,50], [-6,50], [-4,58], [-3,58], [1,51], [-5,50]];
    const europe = [[-9,38], [-9,43], [-1,43], [3,47], [5,53], [10,54], [10,58], [25,60], [30,60], [30,45], [20,40], [15,38], [12,44], [15,38], [0,38]];
    const africa = [[-17,35], [-5,36], [10,37], [25,32], [33,31], [33,28], [43,12], [51,11], [48,8], [40,-15], [33,-35], [20,-35], [15,-30], [12,-5], [8,4], [-17,15]];
    const madagascar = [[43,-12], [50,-13], [47,-25], [43,-25]];
    const arabia = [[35,32], [43,30], [55,25], [59,23], [54,16], [43,12], [38,15], [35,32]];
    const asia = [[35,32], [45,35], [60,40], [70,30], [75,20], [80,10], [95,8], [105,10], [110,20], [120,25], [122,30], [130,35], [140,40], [140,55], [170,60], [180,68], [140,75], [100,78], [70,75], [40,65], [35,45]];
    const indiaSub = [[68,24], [72,20], [75,15], [77,8], [80,13], [85,20], [90,22], [88,26], [78,31]];
    const indochina = [[95,18], [102,10], [105,10], [108,15], [105,20], [100,20]];
    const japan = [[130,31], [135,34], [140,36], [142,43], [140,40], [133,33]];
    const indonesia = [[95,5], [105,-5], [115,-8], [125,-8], [140,-3], [140,-8], [120,-10], [100,0]];
    const australia = [[113,-15], [125,-12], [135,-12], [142,-11], [145,-15], [153,-28], [148,-38], [135,-35], [115,-35], [113,-25]];
    const greenland = [[-55,60], [-40,65], [-20,70], [-25,82], [-60,82], [-70,75]];

    drawLandmass(northAmerica);
    drawLandmass(centralAmerica);
    drawLandmass(southAmerica);
    drawLandmass(ukIreland, true);
    drawLandmass(europe);
    drawLandmass(africa);
    drawLandmass(madagascar, true);
    drawLandmass(arabia);
    drawLandmass(asia);
    drawLandmass(indiaSub);
    drawLandmass(indochina);
    drawLandmass(japan, true);
    drawLandmass(indonesia, true);
    drawLandmass(australia);
    drawLandmass(greenland, true);

    // 4. Glowing City Night Light Dots (Amber Gold)
    const majorCities = [
      [-74, 40.7], [-0.1, 51.5], [2.35, 48.8], [139.6, 35.6], [55.2, 25.2], [72.8, 18.9],
      [116.4, 39.9], [151.2, -33.8], [-43.1, -22.9], [-99.1, 19.4], [-122.4, 37.7],
      [37.6, 55.7], [31.2, 30.0], [103.8, 1.3], [126.9, 37.5]
    ];
    majorCities.forEach(([lng, lat]) => {
      const pt = mapCoords(lng, lat);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.95)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.35)';
      ctx.fill();
    });

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

    // 3. Detailed Globe Sphere Mesh
    const worldTexture = createDetailedWorldMapTexture();
    const globeGeometry = new THREE.SphereGeometry(2.05, 128, 128);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: worldTexture,
      specular: 0x8c353f,
      shininess: 30,
      transparent: true,
      opacity: 0.98
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 4. Multi-Layer Atmosphere Glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.18, 128, 128);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x8c353f,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.35
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Outer Soft Ambient Aura
    const outerAuraGeometry = new THREE.SphereGeometry(2.26, 64, 64);
    const outerAuraMaterial = new THREE.MeshBasicMaterial({
      color: 0xefe2d3,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.08
    });
    const outerAuraMesh = new THREE.Mesh(outerAuraGeometry, outerAuraMaterial);
    globeGroup.add(outerAuraMesh);

    // 5. 3D Flight Arcs & Moving Energy Pulse Particles
    const cityCoords = [
      { lat: 40.7128, lng: -74.0060 }, // NYC
      { lat: 51.5074, lng: -0.1278 },  // London
      { lat: 48.8566, lng: 2.3522 },   // Paris
      { lat: 25.2048, lng: 55.2708 },  // Dubai
      { lat: 20.5937, lng: 78.9629 },  // India
      { lat: 35.6762, lng: 139.6503 }  // Tokyo
    ];

    const convertLatLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // City Marker Nodes
    cityCoords.forEach((city) => {
      const pos = convertLatLngToVector3(city.lat, city.lng, 2.06);
      const pinGeometry = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const pinMesh = new THREE.Mesh(pinGeometry, pinMaterial);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
    });

    const pulsesList = [];

    // Animated Curved Flight Paths
    for (let i = 0; i < cityCoords.length - 1; i++) {
      const start = convertLatLngToVector3(cityCoords[i].lat, cityCoords[i].lng, 2.06);
      const end = convertLatLngToVector3(cityCoords[i + 1].lat, cityCoords[i + 1].lng, 2.06);
      
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.55);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({ color: 0xefe2d3, transparent: true, opacity: 0.6 });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);

      // Moving Pulse Particle on Arc Path
      const pulseGeo = new THREE.SphereGeometry(0.035, 16, 16);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      globeGroup.add(pulseMesh);

      pulsesList.push({ mesh: pulseMesh, curve, progress: i * 0.16 });
    }

    pulseParticlesRef.current = pulsesList;

    // 6. Real 3D Models Group with Bounding-Box Normalization & Organic Staggered Arc Positioning
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    const gltfLoader = new GLTFLoader();

    // Equalized scale (0.70 units) across ALL elements
    const TARGET_MODEL_SIZE = 0.70;

    // Equal vertical step = 1.20 units (1.85, 0.65, -0.55, -1.75)
    // Organic staggered horizontal X offsets (-3.3, -4.1, -3.4, -3.9) to eliminate straight line feel
    const modelConfigs = [
      // Left Side (Organic Arc)
      { name: 'balloon', path: '/models/balloon.glb', basePos: [-3.3, 1.85, 0], rot: [0.1, 0.4, 0], dir: [-0.3, 0.15] },
      { name: 'plane', path: '/models/plane.glb', basePos: [-4.1, 0.65, 0], rot: [0.2, 0.4, -0.2], dir: [-0.3, 0.05] },
      { name: 'cowboyhat', path: '/models/cowboyhat.glb', basePos: [-3.4, -0.55, 0], rot: [0.3, 0.3, 0.1], dir: [-0.3, -0.05] },
      { name: 'pin', path: '/models/pin.glb', basePos: [-3.9, -1.75, 0], rot: [0.1, 0.5, 0], dir: [-0.3, -0.15] },
      
      // Right Side (Organic Arc)
      { name: 'compass', path: '/models/compass.glb', basePos: [3.3, 1.85, 0], rot: [0.3, -0.3, 0.1], dir: [0.3, 0.15] },
      { name: 'earth', path: '/models/earth.glb', basePos: [4.1, 0.65, 0], rot: [0.2, -0.4, 0.1], dir: [0.3, 0.05] },
      { name: 'palmtree', path: '/models/palmtree.glb', basePos: [3.4, -0.55, 0], rot: [0.1, -0.3, 0], dir: [0.3, -0.05] },
      { name: 'island', path: '/models/island.glb', basePos: [3.9, -1.75, 0], rot: [0.3, -0.4, 0.1], dir: [0.3, -0.15] }
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

          // Equalize scale so EVERY model matches TARGET_MODEL_SIZE (0.70)
          const normScale = maxDim > 0 ? (TARGET_MODEL_SIZE / maxDim) : 1;
          rawMesh.scale.set(normScale, normScale, normScale);

          // Center geometry origin
          const center = new THREE.Vector3();
          box.getCenter(center);
          rawMesh.position.sub(center.multiplyScalar(normScale));

          // Wrapper group at organic staggered position
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

    // 7. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff5ea, 1.5);
    dirLight1.position.set(6, 5, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8c353f, 1.0);
    dirLight2.position.set(-6, -4, -6);
    scene.add(dirLight2);

    // 8. Render & Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Continuous subtle globe rotation
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0012;
      }

      // Animate Flight Arc Energy Pulses
      pulsesList.forEach((pulse) => {
        pulse.progress = (pulse.progress + 0.004) % 1;
        const pt = pulse.curve.getPoint(pulse.progress);
        pulse.mesh.position.copy(pt);
      });

      // Gentle floating levitation for side 3D models
      const time = Date.now() * 0.0015;
      loadedList.forEach((item, idx) => {
        if (item.wrapper) {
          item.wrapper.position.y = item.basePos[1] + Math.sin(time + idx * 1.5) * 0.08;
          item.wrapper.rotation.y += 0.006;
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

  // Scroll Down -> Globe Rotates & Zooms smoothly
  useEffect(() => {
    // Smoothly distribute models gently outward on scroll down without going off-screen
    loadedModelsRef.current.forEach((item) => {
      if (item.wrapper) {
        item.wrapper.position.x = item.basePos[0] + item.dir[0] * scrollProgress * 0.5;
        item.wrapper.position.y = item.basePos[1] + item.dir[1] * scrollProgress * 0.3;
      }
    });
  }, [scrollProgress]);

  // Clamped Zoom Scale (1.0 to 1.15)
  const globeScale = 1 + scrollProgress * 0.12;

  return (
    <div className="position-relative w-100 d-flex align-items-center justify-content-center" style={{ height: '560px', overflow: 'hidden' }}>
      
      {/* 3D WebGL Globe & Organic Staggered 3D Models Canvas */}
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
