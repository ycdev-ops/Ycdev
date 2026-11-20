import * as THREE from 'three';

export type SemarangMapFocus = 'hq' | 'port' | 'sea';
export type SemarangMapStyle = 'satellite' | 'dark';
export type SemarangMapTilt = '3d' | '2d';

export interface SemarangMapController {
  update: (elapsed: number, delta: number) => void;
  setMapStyle: (style: SemarangMapStyle) => void;
  getTargetLookAt: (
    focus: SemarangMapFocus,
    tilt?: SemarangMapTilt
  ) => {
    camPos: [number, number, number];
    target: [number, number, number];
  };
  dispose: () => void;
}

const MAP_WIDTH = 24;
const MAP_DEPTH = 15;

function worldToCanvas(x: number, z: number, w: number, h: number): [number, number] {
  const u = (x + MAP_WIDTH / 2) / MAP_WIDTH;
  const v = (z + MAP_DEPTH / 2) / MAP_DEPTH;
  return [u * w, v * h];
}

function buildAerialTexture(mode: SemarangMapStyle): THREE.CanvasTexture {
  const w = 2048;
  const h = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  const isSat = mode === 'satellite';

  // 1. Base ocean vs urban coastal ground
  const seaGrad = ctx.createLinearGradient(0, 0, 0, h * 0.52);
  if (isSat) {
    seaGrad.addColorStop(0, '#07223B');
    seaGrad.addColorStop(0.65, '#0D3B5E');
    seaGrad.addColorStop(1, '#195E7A');
  } else {
    seaGrad.addColorStop(0, '#071324');
    seaGrad.addColorStop(1, '#0F2542');
  }
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, 0, w, h);

  // Land polygon (coastline along z ~ -0.45 with bay indentation at Tanjung Emas)
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, worldToCanvas(-12, -0.5, w, h)[1]);
  ctx.lineTo(...worldToCanvas(-7.5, -0.8, w, h));
  ctx.lineTo(...worldToCanvas(-3.2, -0.55, w, h));
  ctx.lineTo(...worldToCanvas(-0.6, -0.45, w, h));
  ctx.lineTo(...worldToCanvas(1.1, -0.55, w, h));
  ctx.lineTo(...worldToCanvas(1.1, -2.05, w, h)); // Tanjung Emas reclaimed pier
  ctx.lineTo(...worldToCanvas(3.85, -2.05, w, h));
  ctx.lineTo(...worldToCanvas(3.85, -0.45, w, h));
  ctx.lineTo(...worldToCanvas(12, -0.35, w, h));
  ctx.lineTo(w, h);
  ctx.closePath();

  const landGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
  if (isSat) {
    landGrad.addColorStop(0, '#273A2B');
    landGrad.addColorStop(0.35, '#2E3B34');
    landGrad.addColorStop(1, '#252B33');
  } else {
    landGrad.addColorStop(0, '#0E1522');
    landGrad.addColorStop(1, '#111827');
  }
  ctx.fillStyle = landGrad;
  ctx.fill();

  // 2. Satellite urban land-cover blocks & parks (Anjasmoro / Marina / Puri Eksekutif)
  const patches: [number, number, number, number, string][] = [
    [-6.2, 1.4, 3.6, 2.2, isSat ? '#2F4833' : '#13211E'], // Pantai Marina greenery
    [-2.5, 2.2, 2.8, 2.0, isSat ? '#33414D' : '#162033'], // Puri Eksekutif estate block
    [0.9, 1.8, 2.6, 2.1, isSat ? '#3D3B38' : '#171E2E'], // Semarang Tengah commercial
    [4.4, 1.9, 3.5, 2.3, isSat ? '#35403B' : '#151D2B'], // Tanjung Emas industrial
    [-6.0, -0.2, 3.3, 0.9, isSat ? '#374151' : '#1E293B'], // Ahmad Yani Airport apron
  ];
  patches.forEach(([px, pz, pw, pd, color]) => {
    const [cx, cy] = worldToCanvas(px, pz, w, h);
    const rw = (pw / MAP_WIDTH) * w;
    const rh = (pd / MAP_DEPTH) * h;
    ctx.fillStyle = color;
    ctx.fillRect(cx - rw / 2, cy - rh / 2, rw, rh);
  });

  // Satellite urban micro-parcel texture grid
  ctx.strokeStyle = isSat ? 'rgba(255,255,255,0.06)' : 'rgba(56,189,248,0.07)';
  ctx.lineWidth = 1.5;
  for (let gx = -11; gx <= 11; gx += 0.75) {
    const [x1, y1] = worldToCanvas(gx, -0.3, w, h);
    const [x2, y2] = worldToCanvas(gx, 7.2, w, h);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  for (let gz = 0; gz <= 7; gz += 0.75) {
    const [x1, y1] = worldToCanvas(-11.5, gz, w, h);
    const [x2, y2] = worldToCanvas(11.5, gz, w, h);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // 3. Banjir Kanal Barat River Channel
  ctx.beginPath();
  ctx.moveTo(...worldToCanvas(-0.25, -0.65, w, h));
  ctx.bezierCurveTo(
    ...worldToCanvas(-0.35, 1.8, w, h),
    ...worldToCanvas(0.05, 4.2, w, h),
    ...worldToCanvas(-0.15, 7.4, w, h)
  );
  ctx.strokeStyle = isSat ? '#165E83' : '#0C4A6E';
  ctx.lineWidth = 30;
  ctx.stroke();

  // 4. Ahmad Yani Airport Runway Strip
  const [rwX1, rwY1] = worldToCanvas(-7.4, -0.15, w, h);
  const [rwX2, rwY2] = worldToCanvas(-4.2, -0.15, w, h);
  ctx.strokeStyle = isSat ? '#4B5563' : '#334155';
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(rwX1, rwY1);
  ctx.lineTo(rwX2, rwY2);
  ctx.stroke();
  ctx.setLineDash([18, 16]);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rwX1 + 20, rwY1);
  ctx.lineTo(rwX2 - 20, rwY2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 5. Google Maps Arterial Road Corridors
  const drawRoad = (
    pts: [number, number][],
    width: number,
    casingColor: string,
    fillColor: string
  ) => {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    pts.forEach(([x, z], idx) => {
      const [cx, cy] = worldToCanvas(x, z, w, h);
      if (idx === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.strokeStyle = casingColor;
    ctx.lineWidth = width + 6;
    ctx.stroke();
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = width;
    ctx.stroke();
  };

  const highwayFill = isSat ? '#FBBF24' : '#D97706';
  const highwayCasing = isSat ? '#78350F' : '#451A03';
  const streetFill = isSat ? '#E2E8F0' : '#475569';
  const streetCasing = isSat ? '#334155' : '#1E293B';

  // Jl. Arteri Yos Sudarso -> Kalibanteng -> Siliwangi
  drawRoad(
    [
      [-11.5, 2.3],
      [-3.5, 2.25],
      [-1.6, 2.45],
      [2.4, 2.15],
      [11.5, 2.3],
    ],
    18,
    highwayCasing,
    highwayFill
  );
  // Jl. Arteri Pelabuhan Tanjung Emas
  drawRoad(
    [
      [2.4, 5.8],
      [2.4, 2.15],
      [2.4, -0.75],
    ],
    14,
    highwayCasing,
    highwayFill
  );
  // Puri Eksekutif / Puri Anjasmoro loop roads
  drawRoad(
    [
      [-3.2, 2.25],
      [-3.2, 0.9],
      [-1.6, 0.9],
      [-1.6, 4.1],
      [0.4, 4.1],
    ],
    9,
    streetCasing,
    streetFill
  );
  // Coastal ring road to Bandara
  drawRoad(
    [
      [-6.5, 2.3],
      [-5.6, 0.4],
      [-3.2, 0.9],
    ],
    9,
    streetCasing,
    streetFill
  );

  // 6. Painted Google Maps Labels with Crisp Halo
  const drawLabel = (
    text: string,
    wx: number,
    wz: number,
    fontSize = 22,
    fill = '#FFFFFF',
    bgHalo = 'rgba(10,15,24,0.88)'
  ) => {
    const [lx, ly] = worldToCanvas(wx, wz, w, h);
    ctx.font = `700 ${fontSize}px system-ui, -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 6;
    ctx.strokeStyle = bgHalo;
    ctx.strokeText(text, lx, ly);
    ctx.fillStyle = fill;
    ctx.fillText(text, lx, ly);
  };

  drawLabel('LAUT JAWA · JALUR PELAYARAN', -0.2, -5.2, 26, '#BAE6FD', 'rgba(7,24,46,0.9)');
  drawLabel('PELABUHAN TANJUNG EMAS', 2.4, -2.55, 23, '#FDE68A');
  drawLabel('Bandara Ahmad Yani', -5.7, -0.85, 21, '#E2E8F0');
  drawLabel('JL. PURI EKSEKUTIF A1 · YcDev HQ', -1.6, 3.65, 22, '#FFFFFF', 'rgba(185,28,28,0.92)');
  drawLabel('Tawangsari · Puri Anjasmoro', -3.6, 1.55, 18, '#CBD5E1');
  drawLabel('Banjir Kanal Barat', -0.2, 5.2, 19, '#7DD3FC');
  drawLabel('Jl. Arteri Yos Sudarso', 5.8, 1.85, 19, '#FDE047');
  drawLabel('Jl. Siliwangi / Kalibanteng', -6.6, 2.75, 19, '#FDE047');

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}

export function createSemarang3DMapScene(scene: THREE.Scene): SemarangMapController {
  const satTexture = buildAerialTexture('satellite');
  const darkTexture = buildAerialTexture('dark');

  // Aerial Ground Plane mapped directly to MAP_WIDTH x MAP_DEPTH
  const groundMat = new THREE.MeshStandardMaterial({
    map: satTexture,
    roughness: 0.78,
    metalness: 0.08,
  });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(MAP_WIDTH, MAP_DEPTH), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, 0);
  scene.add(ground);

  // Subtle 3D terrain slab edge beneath the map
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x0b1220,
    roughness: 0.9,
    metalness: 0.2,
  });
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(MAP_WIDTH, 0.35, MAP_DEPTH), plinthMat);
  plinth.position.set(0, -0.18, 0);
  scene.add(plinth);

  // Extruded Semarang Barat 3D Urban Buildings
  const blockMat = new THREE.MeshStandardMaterial({
    color: 0xd1d5db,
    roughness: 0.55,
    metalness: 0.25,
  });
  const accentBlockMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.45,
    metalness: 0.35,
  });
  const cityCoords: [number, number, number, number, number, boolean][] = [
    [-4.3, 3.0, 0.95, 0.52, 0.75, false],
    [-2.8, 3.3, 0.78, 0.4, 0.72, true],
    [-2.6, 1.35, 0.85, 0.46, 0.65, false],
    [-0.9, 1.3, 0.7, 0.48, 0.7, true],
    [0.85, 3.1, 0.95, 0.65, 0.82, false],
    [1.65, 1.4, 0.85, 0.44, 0.78, true],
    [3.85, 2.9, 1.15, 0.68, 0.95, false],
    [4.6, 1.35, 0.95, 0.42, 0.75, false],
    [-0.75, 4.45, 1.1, 0.45, 0.78, true],
    [5.6, 3.2, 1.0, 0.55, 0.8, false],
  ];
  cityCoords.forEach(([x, z, w, h, d, alt]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), alt ? accentBlockMat : blockMat);
    b.position.set(x, h / 2, z);
    scene.add(b);
  });

  // Hero Building + Iconic Google Maps 3D Red Teardrop Location Pin at YcDev Studio HQ (-1.6, 2.45)
  const hqGroup = new THREE.Group();
  hqGroup.position.set(-1.6, 0, 2.45);

  const hqBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.36, 1.15),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.35 })
  );
  hqBase.position.y = 0.18;
  hqGroup.add(hqBase);

  const hqTower = new THREE.Mesh(
    new THREE.BoxGeometry(0.82, 0.72, 0.82),
    new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.45,
      metalness: 0.55,
      roughness: 0.25,
    })
  );
  hqTower.position.y = 0.72;
  hqGroup.add(hqTower);

  // Google Maps Red 3D Teardrop Pin
  const pinGroup = new THREE.Group();
  pinGroup.position.y = 1.65;

  const pinRedMat = new THREE.MeshStandardMaterial({
    color: 0xea4335,
    emissive: 0x991b1b,
    emissiveIntensity: 0.25,
    roughness: 0.25,
    metalness: 0.2,
  });

  const pinHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 20, 20), pinRedMat);
  pinHead.position.y = 0.36;
  pinGroup.add(pinHead);

  const pinTip = new THREE.Mesh(new THREE.ConeGeometry(0.27, 0.52, 20), pinRedMat);
  pinTip.rotation.x = Math.PI;
  pinTip.position.y = 0.04;
  pinGroup.add(pinTip);

  const pinInnerDot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, 0.38, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  pinInnerDot.rotation.x = Math.PI / 2;
  pinInnerDot.position.y = 0.36;
  pinGroup.add(pinInnerDot);

  hqGroup.add(pinGroup);

  const hqPulseRing = new THREE.Mesh(
    new THREE.RingGeometry(0.72, 0.86, 36),
    new THREE.MeshBasicMaterial({
      color: 0xea4335,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
  );
  hqPulseRing.rotation.x = -Math.PI / 2;
  hqPulseRing.position.y = 0.03;
  hqGroup.add(hqPulseRing);
  scene.add(hqGroup);

  // Tanjung Emas Harbor Pier, Shipping Containers & Gantry Cranes (x=2.4, z=-1.25)
  const portGroup = new THREE.Group();
  portGroup.position.set(2.4, 0, -1.25);

  const pier = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 0.16, 1.55),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7, metalness: 0.2 })
  );
  pier.position.y = 0.08;
  portGroup.add(pier);

  const containerColors = [0xdc2626, 0x2563eb, 0x059669, 0xd97706];
  containerColors.forEach((cHex, i) => {
    const stack = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.22, 0.2),
      new THREE.MeshStandardMaterial({ color: cHex, roughness: 0.5 })
    );
    stack.position.set(-0.75 + i * 0.52, 0.27, 0.32);
    portGroup.add(stack);
  });

  const craneMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.5,
    roughness: 0.35,
  });
  [-0.7, 0.65].forEach((cx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.92, 0.14), craneMat);
    leg.position.set(cx, 0.54, -0.35);
    portGroup.add(leg);
    const boom = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 1.2), craneMat);
    boom.position.set(cx, 0.96, -0.72);
    portGroup.add(boom);
  });

  // Secondary Blue POI Pin at Tanjung Emas
  const portPin = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0x3b82f6 })
  );
  portPin.position.set(0, 1.38, 0);
  portGroup.add(portPin);
  scene.add(portGroup);

  // Ahmad Yani Airport Terminal Landmark (-5.6, 0.3)
  const airportTerminal = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.35, 0.55),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.45, roughness: 0.3 })
  );
  airportTerminal.position.set(-5.6, 0.18, 0.38);
  scene.add(airportTerminal);

  // 2 Live Vessels Patrolling Java Sea with Telemetry Sweeps
  const buildVessel = (colorHex: number) => {
    const ship = new THREE.Group();
    const hull = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 0.2, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.45, roughness: 0.35 })
    );
    hull.position.y = 0.1;
    ship.add(hull);

    const bridge = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.24, 0.24),
      new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
      })
    );
    bridge.position.set(-0.2, 0.28, 0);
    ship.add(bridge);

    const radarRing = new THREE.Mesh(
      new THREE.RingGeometry(0.54, 0.61, 28),
      new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      })
    );
    radarRing.rotation.x = -Math.PI / 2;
    radarRing.position.y = 0.04;
    ship.add(radarRing);
    return { ship, radarRing };
  };

  const vesselA = buildVessel(0x38bdf8);
  vesselA.ship.position.set(-1.5, 0, -3.4);
  scene.add(vesselA.ship);

  const vesselB = buildVessel(0x10b981);
  vesselB.ship.position.set(2.4, 0, -4.6);
  vesselB.ship.rotation.y = Math.PI;
  scene.add(vesselB.ship);

  // Telemetry Link Arc between YcDev NOC & Vessel Offshore
  const nocCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.6, 1.25, 2.45),
    new THREE.Vector3(-1.4, 2.75, -0.4),
    new THREE.Vector3(-1.2, 0.35, -3.4),
  ]);
  const linkTube = new THREE.Mesh(
    new THREE.TubeGeometry(nocCurve, 32, 0.024, 6, false),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65 })
  );
  scene.add(linkTube);

  return {
    update: (elapsed) => {
      // Gentle Google Maps 3D pin hover bob
      pinGroup.position.y = 1.65 + Math.sin(elapsed * 2.2) * 0.08;
      pinGroup.rotation.y = Math.sin(elapsed * 0.7) * 0.22;

      const hqScale = 1 + ((elapsed * 0.65) % 1) * 0.9;
      hqPulseRing.scale.setScalar(hqScale);
      (hqPulseRing.material as THREE.MeshBasicMaterial).opacity =
        0.75 * (1 - ((elapsed * 0.65) % 1));

      vesselA.ship.position.x = -2.2 + Math.sin(elapsed * 0.22) * 3.0;
      vesselA.ship.position.z = -3.4 + Math.cos(elapsed * 0.22) * 0.4;
      vesselA.radarRing.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.12);

      vesselB.ship.position.x = 2.6 - Math.sin(elapsed * 0.18) * 3.2;
      vesselB.ship.position.z = -4.6 + Math.sin(elapsed * 0.25) * 0.35;
      vesselB.radarRing.scale.setScalar(1 + Math.cos(elapsed * 2.6) * 0.12);
    },
    setMapStyle: (style) => {
      const isSat = style === 'satellite';
      groundMat.map = isSat ? satTexture : darkTexture;
      groundMat.needsUpdate = true;
      blockMat.color.setHex(isSat ? 0xd1d5db : 0x1e293b);
      accentBlockMat.color.setHex(isSat ? 0x94a3b8 : 0x334155);
      const bgHex = isSat ? 0x0b1f33 : 0x060b12;
      scene.background = new THREE.Color(bgHex);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.setHex(bgHex);
        scene.fog.density = isSat ? 0.018 : 0.026;
      }
    },
    getTargetLookAt: (focus, tilt = '3d') => {
      const targetCoords: Record<SemarangMapFocus, [number, number, number]> = {
        hq: [-2.2, 0.25, 0.8],
        port: [2.4, 0.2, -1.25],
        sea: [0.0, 0.1, -3.5],
      };
      const t = targetCoords[focus];
      if (tilt === '2d') {
        return {
          camPos: [t[0], 11.2, t[2] + 0.05],
          target: t,
        };
      }
      if (focus === 'port') {
        return { camPos: [5.6, 4.4, 2.3], target: t };
      }
      if (focus === 'sea') {
        return { camPos: [0.4, 4.8, 1.6], target: t };
      }
      return { camPos: [-4.4, 5.5, 8.2], target: [-2.2, 0.25, 0.8] };
    },
    dispose: () => {
      satTexture.dispose();
      darkTexture.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    },
  };
}
