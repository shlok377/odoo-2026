import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function Globe3D() {
  const mountRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const globeGroupRef = useRef(null);
  const cloudMeshRef = useRef(null);
  const modelsGroupRef = useRef(null);
  const loadedModelsRef = useRef([]);
  const pulseParticlesRef = useRef([]);
  const shockwavesRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track Mouse Movement for Interactive Hover Tilt
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current.targetX = x * 0.30;
      mousePosRef.current.targetY = y * 0.20;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Helper to Create Refined Detailed World Map Texture (Warm Cream & Rich Burgundy Theme)
  const createDetailedWorldMapTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Rich Deep Burgundy Ocean Base
    const oceanGrad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, canvas.width / 1.2);
    oceanGrad.addColorStop(0, '#361216');
    oceanGrad.addColorStop(0.5, '#220a0d');
    oceanGrad.addColorStop(1, '#130507');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Lat / Long Graticule Coordinate Grid (15-degree grid)
    ctx.strokeStyle = 'rgba(239, 226, 211, 0.07)';
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

    // Equator & Prime Meridian Grid Lines
    ctx.strokeStyle = 'rgba(239, 226, 211, 0.18)';
    ctx.lineWidth = 1.5;
    const equatorY = canvas.height / 2;
    const primeX = canvas.width / 2;
    ctx.beginPath(); ctx.moveTo(0, equatorY); ctx.lineTo(canvas.width, equatorY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(primeX, 0); ctx.lineTo(primeX, canvas.height); ctx.stroke();

    // 3. Detailed Continent Polygon Drawer
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

      // Refined Vector Continent Fill (Subtle Rose Burgundy Tint)
      ctx.fillStyle = isIsland ? 'rgba(217, 107, 116, 0.16)' : 'rgba(217, 107, 116, 0.10)';
      ctx.fill();

      // Refined Vector Coastline Contour (Subtle Warm Cream Gold Outline)
      ctx.strokeStyle = 'rgba(239, 226, 211, 0.38)';
      ctx.lineWidth = 1.0;
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

    // 4. Subtle Cream City Night Light Dots
    const majorCities = [
      [-74, 40.7], [-0.1, 51.5], [2.35, 48.8], [139.6, 35.6], [55.2, 25.2], [72.8, 18.9],
      [116.4, 39.9], [151.2, -33.8], [-43.1, -22.9], [-99.1, 19.4], [-122.4, 37.7],
      [37.6, 55.7], [31.2, 30.0], [103.8, 1.3], [126.9, 37.5], [77.2, 28.6], [100.5, 13.7]
    ];
    majorCities.forEach(([lng, lat]) => {
      const pt = mapCoords(lng, lat);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#efe2d3';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 226, 211, 0.3)';
      ctx.fill();
    });

    return new THREE.CanvasTexture(canvas);
  };

  // Helper to Create Procedural Semi-Transparent Cloud Texture
  const createCloudTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const rx = 35 + Math.random() * 70;
      const ry = 12 + Math.random() * 25;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Camera Setup
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

    // 3. High-Definition Globe Sphere Mesh with Rich Burgundy Specular Shading
    const worldTexture = createDetailedWorldMapTexture();
    const globeGeometry = new THREE.SphereGeometry(2.05, 128, 128);
    const globeMaterial = new THREE.MeshPhongMaterial({
      map: worldTexture,
      specular: 0x8c353f,
      shininess: 40,
      transparent: true,
      opacity: 0.98
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // 4. Clean Globe Surface (Cloud mesh removed for sleek theme alignment)
    cloudMeshRef.current = null;

    // 5. Dual-Layer Atmospheric Glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.19, 128, 128);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xd96b74,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.32
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Outer Warm Cream Aura Ring
    const outerAuraGeometry = new THREE.SphereGeometry(2.28, 64, 64);
    const outerAuraMaterial = new THREE.MeshBasicMaterial({
      color: 0xefe2d3,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.08
    });
    const outerAuraMesh = new THREE.Mesh(outerAuraGeometry, outerAuraMaterial);
    globeGroup.add(outerAuraMesh);

    // 6. Subtle Warm Cream Orbital Ring
    const ringGeometry = new THREE.RingGeometry(2.50, 2.53, 128);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xefe2d3,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.20
    });
    const orbitalRing = new THREE.Mesh(ringGeometry, ringMaterial);
    orbitalRing.rotation.x = Math.PI / 2.8;
    orbitalRing.rotation.y = Math.PI / 6;
    globeGroup.add(orbitalRing);

    // 7. 3D City Beacons with Soft Cream Nodes & Burgundy Rays
    const cityCoords = [
      { name: 'NYC', lat: 40.7128, lng: -74.0060 },
      { name: 'London', lat: 51.5074, lng: -0.1278 },
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
      { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
      { name: 'Rio', lat: -22.9068, lng: -43.1729 }
    ];

    const convertLatLngToVector3 = (lat, lng, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const shockwavesList = [];

    cityCoords.forEach((city) => {
      const surfacePos = convertLatLngToVector3(city.lat, city.lng, 2.06);
      const rayEndPos = convertLatLngToVector3(city.lat, city.lng, 2.28);

      // Glowing Cream Node Sphere
      const pinGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0xf5efe9 });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(surfacePos);
      globeGroup.add(pinMesh);

      // Vertical Light Ray Beam (Rose Burgundy)
      const rayGeo = new THREE.BufferGeometry().setFromPoints([surfacePos, rayEndPos]);
      const rayMat = new THREE.LineBasicMaterial({ color: 0xd96b74, transparent: true, opacity: 0.75 });
      const rayLine = new THREE.Line(rayGeo, rayMat);
      globeGroup.add(rayLine);

      // Pulsing Shockwave Ring on Surface
      const waveGeo = new THREE.RingGeometry(0.02, 0.07, 32);
      const waveMat = new THREE.MeshBasicMaterial({ color: 0xefe2d3, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const waveMesh = new THREE.Mesh(waveGeo, waveMat);
      waveMesh.position.copy(surfacePos);
      waveMesh.lookAt(surfacePos.clone().multiplyScalar(2));
      globeGroup.add(waveMesh);

      shockwavesList.push({ mesh: waveMesh, scale: 1, opacity: 0.6 });
    });

    shockwavesRef.current = shockwavesList;

    // 8. Intercontinental Flight Curves & Cream Pulse Particles
    const flightPairs = [
      [0, 1], // NYC -> London
      [1, 2], // London -> Paris
      [2, 3], // Paris -> Dubai
      [3, 4], // Dubai -> Mumbai
      [4, 5], // Mumbai -> Tokyo
      [5, 6], // Tokyo -> Sydney
      [0, 7]  // NYC -> Rio
    ];

    const pulsesList = [];

    flightPairs.forEach(([sIdx, eIdx], fIndex) => {
      const start = convertLatLngToVector3(cityCoords[sIdx].lat, cityCoords[sIdx].lng, 2.06);
      const end = convertLatLngToVector3(cityCoords[eIdx].lat, cityCoords[eIdx].lng, 2.06);
      
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(2.60);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(60);
      const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const arcMaterial = new THREE.LineBasicMaterial({ color: 0xefe2d3, transparent: true, opacity: 0.5 });
      const arcLine = new THREE.Line(arcGeometry, arcMaterial);
      globeGroup.add(arcLine);

      // 2 Cream Pulse Particles per Arc
      for (let p = 0; p < 2; p++) {
        const pulseGeo = new THREE.SphereGeometry(0.035 - p * 0.01, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xf5efe9 });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        globeGroup.add(pulseMesh);

        pulsesList.push({ mesh: pulseMesh, curve, speed: 0.003 + fIndex * 0.0005, progress: (fIndex * 0.15 + p * 0.08) % 1 });
      }
    });

    pulseParticlesRef.current = pulsesList;

    // 9. Floating Ambient Space Dust Particles
    const dustCount = 100;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPositions[i] = (Math.random() - 0.5) * 16;
      dustPositions[i + 1] = (Math.random() - 0.5) * 12;
      dustPositions[i + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({ color: 0xefe2d3, size: 0.032, transparent: true, opacity: 0.35 });
    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustPoints);

    // 10. Real 3D Side Models with Bounding-Box Normalization & Organic Staggered Arc Positioning
    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);
    modelsGroupRef.current = modelsGroup;

    const gltfLoader = new GLTFLoader();

    // Equalized scale (0.70 units) across ALL 8 side elements
    const TARGET_MODEL_SIZE = 0.70;

    // Equal vertical gap = 1.20 units (+1.85, +0.65, -0.55, -1.75)
    // Organic staggered horizontal X offsets (-3.3, -4.1, -3.4, -3.9) to eliminate straight line feel
    const modelConfigs = [
      // Left Side (Organic Arc)
      { name: 'balloon', path: '/models/balloon.glb', basePos: [-3.3, 1.85, 0], rot: [0.1, 0.4, 0], dir: [-0.3, 0.15] },
      { name: 'plane', path: '/models/plane.glb', basePos: [-4.1, 0.65, 0], rot: [0.2, 0.4, -0.2], dir: [-0.3, 0.05] },
      { name: 'cowboyhat', path: '/models/cowboyhat.glb', basePos: [-3.4, -0.55, 0], rot: [0.3, 0.3, 0.1], dir: [-0.3, -0.05] },
      { name: 'pin', path: '/models/pin.glb', basePos: [-3.9, -1.75, 0], rot: [0.1, 0.5, 0], dir: [-0.3, -0.15] },
      
      // Right Side (Organic Arc)
      { name: 'compass', path: '/models/compass.glb', basePos: [3.3, 1.85, 0], rot: [0.3, -0.3, 0.1], dir: [0.3, 0.15] },
      { name: 'taxi', path: '/models/taxi.glb', basePos: [4.1, 0.65, 0], rot: [0.2, -0.6, 0.1], dir: [0.3, 0.05] },
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

    // 11. Multi-Point Lighting Architecture (Warm Cream & Rose Burgundy)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf5efe9, 1.7);
    dirLight1.position.set(7, 6, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd96b74, 1.1);
    dirLight2.position.set(-7, -5, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xefe2d3, 1.1, 10);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    // 12. Master Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Interactive Mouse Tilt Lerp
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

      // Continuous Globe & Cloud Rotation
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.y += 0.0015;
        globeGroupRef.current.rotation.x = mousePosRef.current.y * 0.15;
      }
      if (cloudMeshRef.current) {
        cloudMeshRef.current.rotation.y += 0.0022;
      }
      orbitalRing.rotation.z += 0.0018;

      // Animate City Beacon Shockwaves
      shockwavesList.forEach((sw) => {
        sw.scale += 0.012;
        sw.opacity -= 0.012;
        if (sw.scale > 2.4) {
          sw.scale = 1;
          sw.opacity = 0.6;
        }
        sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
        sw.mesh.material.opacity = sw.opacity;
      });

      // Animate Flight Arc Energy Pulses
      pulsesList.forEach((pulse) => {
        pulse.progress = (pulse.progress + pulse.speed) % 1;
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

    // 13. Resize Handler
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
    // Smoothly distribute side models outward on scroll down without going off-screen
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
      
      {/* Refined Globe Canvas (Warm Vanilla Cream & Rich Burgundy Theme) */}
      <div 
        ref={mountRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          transform: `scale(${globeScale})`,
          transition: 'transform 0.1s ease-out',
          pointerEvents: 'auto'
        }} 
      />

    </div>
  );
}
