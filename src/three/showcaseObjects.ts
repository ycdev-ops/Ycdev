import * as THREE from 'three';
import { computeExplodedOffset } from '../utils/telemetrySimulation';
import type { ProceduralTextureSet } from './webglUtils';

export type ShowcaseModelId =
  | 'iot-gateway'
  | 'marine-gateway'
  | 'hybrid-satcom'
  | 'cyber-appliance'
  | 'telemetry-drone'
  | 'server-blade';

export interface ShowcaseModelSpec {
  id: ShowcaseModelId;
  title: string;
  discipline: string;
  partCount: number;
  summary: string;
  specs: string;
}

export const SHOWCASE_MODELS: ShowcaseModelSpec[] = [
  {
    id: 'iot-gateway',
    title: 'Industrial IoT Edge Gateway',
    discipline: 'IoT & Embedded Hardware',
    partCount: 9,
    summary:
      'Enklosur aluminium anodized dengan antena RF LoRaWAN, papan sirkuit multi-lapisan ESP32/ARM, heatsink sirip, dan port industri M12 + RJ45.',
    specs: 'IP66 Titanium · LoRaWAN 915MHz · Buffer SQLite Luring',
  },
  {
    id: 'marine-gateway',
    title: 'Marine IoT Gateway (IP67)',
    discipline: 'Maritime Edge Hardware',
    partCount: 9,
    summary:
      'Kotak edge tahan air dan garam (IP67) untuk anjungan kapal dengan isolator optik NMEA 0183/2000, modul pembaca radar/mesin, dan gasket silikon maritim.',
    specs: 'IP67 Marine Alloy · NMEA 0183/2000 · Isolasi Optik',
  },
  {
    id: 'hybrid-satcom',
    title: 'Hybrid Satcom & 5G Terminal',
    discipline: 'Maritime Satcom & Cellular',
    partCount: 8,
    summary:
      'Radome maritim terstabilisasi berisi array antena LEO Starlink / L-Band Iridium dan modul failover 4G/5G otomatis untuk koneksi laut lepas.',
    specs: '4G/5G MIMO · LEO Starlink · L-Band Iridium/Inmarsat',
  },
  {
    id: 'cyber-appliance',
    title: 'Zero-Trust 2U Security Core',
    discipline: 'Cybersecurity & Core Routing',
    partCount: 8,
    summary:
      'Unit rak keamanan jaringan kelas MikroTik/HSM dengan 8 port SFP+ serat optik, panel OLED telemetri mTLS, modul vault terenkripsi, dan PSU ganda.',
    specs: '8×10G SFP+ · Hardware HSM · eBPF Wire-Speed Inspection',
  },
  {
    id: 'telemetry-drone',
    title: 'Autonomous Port LiDAR Drone',
    discipline: 'Full-Stack & Spatial Telemetry',
    partCount: 9,
    summary:
      'Wahana inspeksi pelabuhan & kontainer dengan rangka serat karbon X-frame, 4 rotor brushless berputar, modul LiDAR ventral, dan antena RTK-GPS.',
    specs: 'RTK-GPS ±2cm · Gimbal LiDAR 360° · Stream WebRTC/MQTT',
  },
  {
    id: 'server-blade',
    title: 'Liquid-Cooled Compute Blade',
    discipline: 'Software Engineering & Cloud',
    partCount: 8,
    summary:
      'Modul komputasi berdensitas tinggi dengan pipa pendingin cair tembaga, 4 bay NVMe hot-swap, busbar daya, dan klaster worker Go/Kafka.',
    specs: '48k Msg/Detik · Dual Copper Manifold · 4×NVMe Gen5',
  },
];

function tagExplodePart(
  obj: THREE.Object3D,
  explodeVec: [number, number, number],
  spinAxis?: 'y'
) {
  obj.userData.basePos = [obj.position.x, obj.position.y, obj.position.z];
  obj.userData.explodeVec = explodeVec;
  if (spinAxis) {
    obj.userData.spinAxis = spinAxis;
  }
}

export function buildShowcaseModel(
  id: ShowcaseModelId,
  textures: ProceduralTextureSet
): THREE.Group {
  const root = new THREE.Group();

  const matteChassis = new THREE.MeshStandardMaterial({
    color: 0x1b222d,
    metalness: 0.72,
    roughness: 0.58,
    bumpMap: textures.brushedBump,
    bumpScale: 0.015,
  });

  const brushedSteel = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.92,
    roughness: 0.22,
    bumpMap: textures.brushedBump,
    bumpScale: 0.01,
  });

  const cobaltAccent = new THREE.MeshStandardMaterial({
    color: 0x0ea5e9,
    emissive: 0x0284c7,
    emissiveIntensity: 0.9,
    roughness: 0.2,
    metalness: 0.4,
  });

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.2,
  });

  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.pcbAlbedo,
    roughness: 0.45,
    metalness: 0.25,
  });

  if (id === 'iot-gateway') {
    // 1. Base enclosure body (ExtrudeGeometry with bevel)
    const shape = new THREE.Shape();
    shape.moveTo(-1.1, -0.75);
    shape.lineTo(1.1, -0.75);
    shape.lineTo(1.1, 0.75);
    shape.lineTo(-1.1, 0.75);
    shape.closePath();

    const lowerBody = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.36,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 3,
      }),
      matteChassis
    );
    lowerBody.rotation.x = -Math.PI / 2;
    lowerBody.position.y = 0.05;
    tagExplodePart(lowerBody, [0, -0.45, 0]);
    root.add(lowerBody);

    // 2. Internal multilayer PCB
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.06, 1.25), pcbMat);
    pcb.position.set(0, 0.44, 0);
    tagExplodePart(pcb, [0, 0.15, 0]);
    root.add(pcb);

    // 3. SoC processor package + RF shield
    const soc = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.46), brushedSteel);
    soc.position.set(-0.2, 0.51, 0);
    tagExplodePart(soc, [0, 0.45, 0]);
    root.add(soc);

    // 4. Top heatsink lid with cooling fins
    const lidGroup = new THREE.Group();
    const lidPlate = new THREE.Mesh(new THREE.BoxGeometry(2.22, 0.1, 1.52), matteChassis);
    lidGroup.add(lidPlate);
    for (let i = -3; i <= 3; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.11, 0.06), brushedSteel);
      fin.position.set(0, 0.09, i * 0.18);
      lidGroup.add(fin);
    }
    lidGroup.position.set(0, 0.65, 0);
    tagExplodePart(lidGroup, [0, 0.95, 0]);
    root.add(lidGroup);

    // 5. Optical fiber status light bar
    const statusPipe = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 0.06), cobaltAccent);
    statusPipe.position.set(0, 0.68, 0.75);
    tagExplodePart(statusPipe, [0, 0.95, 0.35]);
    root.add(statusPipe);

    // 6. LoRaWAN RF Antenna (LatheGeometry)
    const antPoints = [
      new THREE.Vector2(0.06, 0),
      new THREE.Vector2(0.075, 0.18),
      new THREE.Vector2(0.05, 0.25),
      new THREE.Vector2(0.045, 1.15),
      new THREE.Vector2(0.02, 1.22),
    ];
    const antenna = new THREE.Mesh(new THREE.LatheGeometry(antPoints, 18), matteChassis);
    antenna.position.set(0.88, 0.45, -0.58);
    tagExplodePart(antenna, [0.45, 0.85, -0.35]);
    root.add(antenna);

    // 7. Brass SMA connector collar
    const sma = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.14, 6), copperMat);
    sma.position.set(0.88, 0.42, -0.58);
    tagExplodePart(sma, [0.45, 0.45, -0.35]);
    root.add(sma);

    // 8. Front RJ45 Ethernet & M12 Industrial Ports
    const rj45 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.22), brushedSteel);
    rj45.position.set(-0.62, 0.34, 0.78);
    tagExplodePart(rj45, [0, 0, 0.55]);
    root.add(rj45);

    const m12 = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.26, 16), brushedSteel);
    m12.rotation.x = Math.PI / 2;
    m12.position.set(0.62, 0.34, 0.8);
    tagExplodePart(m12, [0, 0, 0.55]);
    root.add(m12);
  } else if (id === 'marine-gateway') {
    // 1. Marine IP67 Cast-Alloy Bottom Housing with Mounting Flanges
    const hullBase = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.38, 1.6), matteChassis);
    hullBase.position.set(0, 0.24, 0);
    tagExplodePart(hullBase, [0, -0.45, 0]);
    root.add(hullBase);

    const flangeL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 1.85), brushedSteel);
    flangeL.position.set(-1.26, 0.1, 0);
    tagExplodePart(flangeL, [-0.55, -0.35, 0]);
    root.add(flangeL);

    const flangeR = flangeL.clone();
    flangeR.position.set(1.26, 0.1, 0);
    tagExplodePart(flangeR, [0.55, -0.35, 0]);
    root.add(flangeR);

    // 2. IP67 Silicone Salt-Seal Gasket Ring
    const gasket = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.06, 1.52), cobaltAccent);
    gasket.position.set(0, 0.46, 0);
    tagExplodePart(gasket, [0, 0.12, 0]);
    root.add(gasket);

    // 3. NMEA 0183/2000 & Radar Opto-Isolator PCB
    const marinePcb = new THREE.Mesh(new THREE.BoxGeometry(1.98, 0.06, 1.28), pcbMat);
    marinePcb.position.set(0, 0.52, 0);
    tagExplodePart(marinePcb, [0, 0.35, 0]);
    root.add(marinePcb);

    // 4. Brass NMEA 2000 & Fuel Flow Bulkhead Gland Array (Front)
    const glands = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const gland = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.26, 12),
        copperMat
      );
      gland.rotation.x = Math.PI / 2;
      gland.position.set(-0.72 + i * 0.48, 0.24, 0.88);
      glands.add(gland);
    }
    tagExplodePart(glands, [0, 0, 0.65]);
    root.add(glands);

    // 5. Sealed Top Marine Cover + Bridge Status OLED Display
    const topShield = new THREE.Mesh(new THREE.BoxGeometry(2.32, 0.14, 1.56), brushedSteel);
    topShield.position.set(0, 0.68, 0);
    tagExplodePart(topShield, [0, 0.95, 0]);
    root.add(topShield);

    const bridgeOled = new THREE.Mesh(
      new THREE.PlaneGeometry(1.1, 0.28),
      new THREE.MeshBasicMaterial({ map: textures.oledFaceplate })
    );
    bridgeOled.rotation.x = -Math.PI / 2;
    bridgeOled.position.set(-0.32, 0.755, 0.2);
    tagExplodePart(bridgeOled, [0, 1.05, 0]);
    root.add(bridgeOled);

    // 6. Dual Waterproof GNSS & Marine VHF Whip Antennas
    const gnssDome = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.14, 20), brushedSteel);
    gnssDome.position.set(0.76, 0.82, -0.42);
    tagExplodePart(gnssDome, [0.35, 1.1, -0.25]);
    root.add(gnssDome);
  } else if (id === 'hybrid-satcom') {
    // 1. Marine Stainless Deck Pedestal Base
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.68, 0.88, 0.34, 24),
      brushedSteel
    );
    pedestal.position.set(0, 0.22, 0);
    tagExplodePart(pedestal, [0, -0.4, 0]);
    root.add(pedestal);

    // 2. Dual-Axis Stabilization Gimbal & Multi-WAN Router Core
    const routerCore = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.24, 0.95), matteChassis);
    routerCore.position.set(0, 0.54, 0);
    tagExplodePart(routerCore, [0, 0.05, 0]);
    root.add(routerCore);

    // 3. LEO Phased-Array Flat Panel (Starlink Maritime Class)
    const phasedArray = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.08, 0.86), pcbMat);
    phasedArray.rotation.x = -0.22;
    phasedArray.position.set(0, 0.84, 0);
    tagExplodePart(phasedArray, [0, 0.45, 0]);
    root.add(phasedArray);

    const arrayBezel = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.05, 0.92), copperMat);
    arrayBezel.rotation.x = -0.22;
    arrayBezel.position.set(0, 0.79, 0);
    tagExplodePart(arrayBezel, [0, 0.35, 0]);
    root.add(arrayBezel);

    // 4. L-Band Secondary Telemetry Ring
    const lbandRing = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.035, 10, 32), cobaltAccent);
    lbandRing.rotation.x = Math.PI / 2;
    lbandRing.position.set(0, 0.62, 0);
    tagExplodePart(lbandRing, [0, 0.25, 0]);
    root.add(lbandRing);

    // 5. Dual 4G/5G Coastal MIMO Fin Blades
    const finL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.48, 0.26), brushedSteel);
    finL.position.set(-0.98, 0.48, 0);
    tagExplodePart(finL, [-0.65, 0.15, 0]);
    root.add(finL);

    const finR = finL.clone();
    finR.position.set(0.98, 0.48, 0);
    tagExplodePart(finR, [0.65, 0.15, 0]);
    root.add(finR);

    // 6. Aerodynamic Radome Dome Shell (LatheGeometry, translucent dielectric)
    const domePts = [
      new THREE.Vector2(0.92, 0.0),
      new THREE.Vector2(0.94, 0.22),
      new THREE.Vector2(0.82, 0.56),
      new THREE.Vector2(0.52, 0.84),
      new THREE.Vector2(0.01, 0.94),
    ];
    const radomeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.15,
      roughness: 0.25,
      transparent: true,
      opacity: 0.52,
    });
    const radome = new THREE.Mesh(new THREE.LatheGeometry(domePts, 28), radomeMat);
    radome.position.set(0, 0.38, 0);
    tagExplodePart(radome, [0, 1.15, 0]);
    root.add(radome);
  } else if (id === 'cyber-appliance') {
    // 1. 2U Rackmount Steel Chassis
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.56, 1.45), matteChassis);
    chassis.position.set(0, 0.34, 0);
    tagExplodePart(chassis, [0, -0.3, 0]);
    root.add(chassis);

    // 2. Rack mounting ears
    const leftEar = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.56, 0.08), brushedSteel);
    leftEar.position.set(-1.38, 0.34, 0.69);
    tagExplodePart(leftEar, [-0.55, 0, 0.2]);
    root.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.set(1.38, 0.34, 0.69);
    tagExplodePart(rightEar, [0.55, 0, 0.2]);
    root.add(rightEar);

    // 3. OLED Telemetry Faceplate
    const oled = new THREE.Mesh(
      new THREE.PlaneGeometry(1.45, 0.34),
      new THREE.MeshBasicMaterial({ map: textures.oledFaceplate })
    );
    oled.position.set(-0.48, 0.36, 0.732);
    tagExplodePart(oled, [0, 0.1, 0.6]);
    root.add(oled);

    // 4. 8x SFP+ Fiber Cages (grouped)
    const sfpGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const cage = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.14, 0.12), brushedSteel);
      cage.position.set(0.32 + (i % 4) * 0.16, i < 4 ? 0.44 : 0.24, 0.72);
      sfpGroup.add(cage);
    }
    tagExplodePart(sfpGroup, [0.25, 0, 0.65]);
    root.add(sfpGroup);

    // 5. Internal HSM Cryptographic Vault Core
    const hsm = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.24, 0.85), copperMat);
    hsm.position.set(-0.35, 0.74, 0);
    tagExplodePart(hsm, [0, 0.75, 0]);
    root.add(hsm);

    // 6. Optical security bus ring
    const bus = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.05, 0.92), cobaltAccent);
    bus.position.set(-0.35, 0.88, 0);
    tagExplodePart(bus, [0, 1.05, 0]);
    root.add(bus);

    // 7. Top removable security cover
    const topCover = new THREE.Mesh(new THREE.BoxGeometry(2.56, 0.06, 1.4), brushedSteel);
    topCover.position.set(0, 0.66, 0);
    tagExplodePart(topCover, [0, 1.25, 0]);
    root.add(topCover);

    // 8. Dual redundant PSU handles at rear
    const psu = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.34, 0.18), copperMat);
    psu.position.set(0.75, 0.34, -0.78);
    tagExplodePart(psu, [0, 0, -0.65]);
    root.add(psu);
  } else if (id === 'telemetry-drone') {
    // 1. Carbon-fiber fuselage
    const hull = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 1.15), matteChassis);
    hull.position.set(0, 0.56, 0);
    tagExplodePart(hull, [0, 0.15, 0]);
    root.add(hull);

    // 2. Top aerodynamic canopy & RTK-GPS ceramic dome
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.16, 8), brushedSteel);
    canopy.position.set(0, 0.74, 0.05);
    tagExplodePart(canopy, [0, 0.85, 0]);
    root.add(canopy);

    const rtk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.12, 16), cobaltAccent);
    rtk.position.set(0, 0.88, -0.1);
    tagExplodePart(rtk, [0, 1.15, 0]);
    root.add(rtk);

    // 3. 4 Carbon-fiber X-frame arms & motor pods + spinning rotors
    const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, -Math.PI / 4, -(3 * Math.PI) / 4];
    armAngles.forEach((ang, idx) => {
      const dx = Math.cos(ang);
      const dz = Math.sin(ang);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.048, 1.25, 10), matteChassis);
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = -ang;
      arm.position.set(dx * 0.58, 0.56, dz * 0.58);
      tagExplodePart(arm, [dx * 0.5, 0.15, dz * 0.5]);
      root.add(arm);

      const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.16, 16), brushedSteel);
      motor.position.set(dx * 1.12, 0.62, dz * 1.12);
      tagExplodePart(motor, [dx * 0.8, 0.35, dz * 0.8]);
      root.add(motor);

      const rotor = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.018, 0.07),
        idx % 2 === 0 ? cobaltAccent : brushedSteel
      );
      rotor.position.set(dx * 1.12, 0.72, dz * 1.12);
      tagExplodePart(rotor, [dx * 0.8, 0.65, dz * 0.8], 'y');
      root.add(rotor);
    });

    // 4. Ventral gimballed LiDAR optical turret
    const lidar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.2, 20), copperMat);
    lidar.position.set(0, 0.34, 0.36);
    tagExplodePart(lidar, [0, -0.35, 0.45]);
    root.add(lidar);

    // 5. Landing skids
    const leftSkid = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 8), matteChassis);
    leftSkid.rotation.x = Math.PI / 2;
    leftSkid.position.set(-0.42, 0.12, 0);
    tagExplodePart(leftSkid, [-0.35, -0.3, 0]);
    root.add(leftSkid);

    const rightSkid = leftSkid.clone();
    rightSkid.position.set(0.42, 0.12, 0);
    tagExplodePart(rightSkid, [0.35, -0.3, 0]);
    root.add(rightSkid);
  } else {
    // 'server-blade': Liquid-Cooled Compute Blade
    // 1. Sled baseplate
    const sled = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.14, 2.35), matteChassis);
    sled.position.set(0, 0.12, 0);
    tagExplodePart(sled, [0, -0.35, 0]);
    root.add(sled);

    // 2. Main server motherboard
    const mobo = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.06, 2.05), pcbMat);
    mobo.position.set(0, 0.24, 0);
    tagExplodePart(mobo, [0, 0.05, 0]);
    root.add(mobo);

    // 3. Dual CPU cold-plates
    const cpuA = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.14, 0.46), brushedSteel);
    cpuA.position.set(-0.36, 0.34, -0.2);
    tagExplodePart(cpuA, [-0.2, 0.45, 0]);
    root.add(cpuA);

    const cpuB = cpuA.clone();
    cpuB.position.set(0.36, 0.34, -0.2);
    tagExplodePart(cpuB, [0.2, 0.45, 0]);
    root.add(cpuB);

    // 4. Copper liquid cooling manifold TubeGeometry
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.36, 0.44, 0.95),
      new THREE.Vector3(-0.36, 0.44, -0.2),
      new THREE.Vector3(0, 0.48, -0.65),
      new THREE.Vector3(0.36, 0.44, -0.2),
      new THREE.Vector3(0.36, 0.44, 0.95),
    ]);
    const manifold = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 32, 0.048, 10, false), copperMat);
    tagExplodePart(manifold, [0, 0.85, 0]);
    root.add(manifold);

    // 5. 4x Hot-Swap NVMe bays
    const nvmeGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.44), brushedSteel);
      bay.position.set(-0.57 + i * 0.38, 0.28, 0.86);
      nvmeGroup.add(bay);
    }
    tagExplodePart(nvmeGroup, [0, 0.1, 0.65]);
    root.add(nvmeGroup);

    // 6. Optical backplane busbar
    const busbar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.16), cobaltAccent);
    busbar.position.set(0, 0.3, -1.06);
    tagExplodePart(busbar, [0, 0.3, -0.55]);
    root.add(busbar);
  }

  return root;
}

export function updateShowcaseExplodeAndSpin(
  group: THREE.Group,
  explodeFactor: number,
  delta: number
) {
  group.traverse((child) => {
    const basePos = child.userData.basePos as [number, number, number] | undefined;
    const explodeVec = child.userData.explodeVec as [number, number, number] | undefined;
    if (basePos && explodeVec) {
      const [nx, ny, nz] = computeExplodedOffset(basePos, explodeVec, explodeFactor);
      child.position.x = THREE.MathUtils.damp(child.position.x, nx, 8, delta);
      child.position.y = THREE.MathUtils.damp(child.position.y, ny, 8, delta);
      child.position.z = THREE.MathUtils.damp(child.position.z, nz, 8, delta);
    }
    if (child.userData.spinAxis === 'y') {
      child.rotation.y += delta * 14;
    }
  });
}
