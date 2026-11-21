import type * as THREE from 'three';
import type { ProceduralTextureSet } from './webglTypes';

export interface OrbitalSceneController {
  update: (
    elapsed: number,
    delta: number,
    scrollRatio: number,
    pointerX: number,
    pointerY: number
  ) => void;
  dispose: () => void;
}

export function createOrbitalBackgroundSceneFactory(THREE: typeof import('three')) {
  return function createOrbitalBackgroundScene(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  textures: ProceduralTextureSet
): OrbitalSceneController {

const _dummy = new THREE.Object3D();
const _packetPos = new THREE.Vector3();

function buildTelemetrySatellite(textures: ProceduralTextureSet): THREE.Group {
  const sat = new THREE.Group();

  const goldFoil = new THREE.MeshStandardMaterial({
    color: 0xd99b26,
    metalness: 0.9,
    roughness: 0.25,
    bumpMap: textures.brushedBump,
    bumpScale: 0.015,
  });

  const titanium = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.85,
    roughness: 0.35,
  });

  const solarMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: textures.solarAlbedo,
    metalness: 0.4,
    roughness: 0.2,
  });

  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0ea5e9,
    emissiveIntensity: 1.9,
    roughness: 0.2,
  });

  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.72, 8), goldFoil);
  sat.add(core);

  const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 10, 24), titanium);
  topRing.rotation.x = Math.PI / 2;
  topRing.position.y = 0.34;
  sat.add(topRing);

  const botRing = topRing.clone();
  botRing.position.y = -0.34;
  sat.add(botRing);

  const dishPoints = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.18, 0.04),
    new THREE.Vector2(0.32, 0.14),
    new THREE.Vector2(0.35, 0.18),
  ];
  const dish = new THREE.Mesh(
    new THREE.LatheGeometry(dishPoints, 24),
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.65,
      roughness: 0.3,
      side: THREE.DoubleSide,
    })
  );
  dish.position.set(0, 0.44, 0);
  sat.add(dish);

  const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.04, 0.22, 10), titanium);
  horn.position.set(0, 0.56, 0);
  sat.add(horn);

  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), beaconMat);
  beacon.position.set(0, 0.68, 0);
  sat.add(beacon);

  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 3.3, 8), titanium);
  boom.rotation.z = Math.PI / 2;
  sat.add(boom);

  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.03, 0.54), solarMat);
  leftWing.position.set(-1.05, 0, 0);
  sat.add(leftWing);

  const rightWing = leftWing.clone();
  rightWing.position.set(1.05, 0, 0);
  sat.add(rightWing);

  return sat;
}
  // Deep ocean-earth curvature globe with atmospheric rings & coastal maritime beacons
  const earthGroup = new THREE.Group();
  earthGroup.position.set(2.5, -3.55, -4.6);

  const earthCore = new THREE.Mesh(
    new THREE.SphereGeometry(4.35, 48, 36),
    new THREE.MeshStandardMaterial({
      color: 0x061326,
      roughness: 0.72,
      metalness: 0.22,
    })
  );
  earthGroup.add(earthCore);

  const earthWire = new THREE.Mesh(
    new THREE.SphereGeometry(4.38, 36, 26),
    new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
  );
  earthGroup.add(earthWire);

  // Inner + outer orbital atmospheric rings (SpaceX Starlink maritime constellation vibe)
  const horizonRing = new THREE.Mesh(
    new THREE.TorusGeometry(4.62, 0.028, 12, 96),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.52,
    })
  );
  horizonRing.rotation.x = Math.PI * 0.42;
  horizonRing.rotation.y = 0.22;
  earthGroup.add(horizonRing);

  const outerRelayRing = new THREE.Mesh(
    new THREE.TorusGeometry(5.15, 0.015, 10, 96),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.28,
    })
  );
  outerRelayRing.rotation.x = Math.PI * 0.36;
  outerRelayRing.rotation.y = -0.35;
  earthGroup.add(outerRelayRing);

  // 3 Illuminated Maritime Vessel / Port Beacons seated near earth horizon rim
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
  const beaconCoords: [number, number, number][] = [
    [-1.4, 4.18, 0.3],
    [0.2, 4.35, 0.5],
    [1.6, 3.98, 0.75],
  ];
  const beacons: THREE.Mesh[] = beaconCoords.map((pos) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 10), beaconMat);
    b.position.set(pos[0], pos[1], pos[2]);
    earthGroup.add(b);
    return b;
  });

  scene.add(earthGroup);

  // Constellation satellites (right side, framing hero copy without obstructing left text)
  const satPrimary = buildTelemetrySatellite(textures);
  satPrimary.position.set(2.95, 1.05, -1.35);
  satPrimary.scale.setScalar(0.84);
  scene.add(satPrimary);

  const satSecondary = buildTelemetrySatellite(textures);
  satSecondary.position.set(4.35, -1.05, -2.5);
  satSecondary.scale.setScalar(0.56);
  scene.add(satSecondary);

  const satRelay = buildTelemetrySatellite(textures);
  satRelay.position.set(0.75, 2.25, -3.4);
  satRelay.scale.setScalar(0.42);
  scene.add(satRelay);

  // Optical downlink cone from primary satellite down toward Semarang/Java Sea horizon
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.14,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const downlinkCone = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.2, 20, 1, true), beamMat);
  downlinkCone.position.set(2.65, -0.05, -1.65);
  downlinkCone.rotation.z = -0.25;
  scene.add(downlinkCone);

  // Dual Maritime Shipping & Orbital Relay Arcs + Live Traveling Telemetry Packets
  const arcCurveA = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.2, -1.3, -3.4),
    new THREE.Vector3(-0.6, 1.65, -2.1),
    new THREE.Vector3(2.95, 1.05, -1.35),
    new THREE.Vector3(5.8, -0.8, -2.6),
  ]);
  const arcLineA = new THREE.Mesh(
    new THREE.TubeGeometry(arcCurveA, 56, 0.014, 6, false),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.36,
    })
  );
  scene.add(arcLineA);

  const arcCurveB = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.75, 2.25, -3.4),
    new THREE.Vector3(2.2, 0.65, -2.7),
    new THREE.Vector3(2.7, 0.78, -4.1),
    new THREE.Vector3(4.35, -1.05, -2.5),
  ]);
  const arcLineB = new THREE.Mesh(
    new THREE.TubeGeometry(arcCurveB, 42, 0.01, 6, false),
    new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.3,
    })
  );
  scene.add(arcLineB);

  const packetGeo = new THREE.SphereGeometry(0.052, 8, 8);
  const packetMatSky = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
  const packetMatEm = new THREE.MeshBasicMaterial({ color: 0x34d399 });
  const packetsA: THREE.Mesh[] = [];
  const packetsB: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const pa = new THREE.Mesh(packetGeo, packetMatSky);
    scene.add(pa);
    packetsA.push(pa);
    const pb = new THREE.Mesh(packetGeo, packetMatEm);
    scene.add(pb);
    packetsB.push(pb);
  }

  // 220 InstancedMesh stars & orbital telemetry relay nodes
  const starCount = 220;
  const starGeo = new THREE.OctahedronGeometry(0.032, 0);
  const starMat = new THREE.MeshBasicMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.7,
  });
  const stars = new THREE.InstancedMesh(starGeo, starMat, starCount);
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2;
    const radius = 5.5 + (i % 9) * 1.35;
    _dummy.position.set(
      Math.cos(angle * 3.7) * radius,
      ((i * 1.43) % 10) - 5.0,
      -5.2 - (i % 7) * 1.7
    );
    const scale = 0.45 + (i % 5) * 0.32;
    _dummy.scale.setScalar(scale);
    _dummy.updateMatrix();
    stars.setMatrixAt(i, _dummy.matrix);
  }
  stars.instanceMatrix.needsUpdate = true;
  stars.computeBoundingSphere();
  scene.add(stars);

  let camX = 0;
  let camY = 0;
  let camZ = 6.2;

  return {
    update: (elapsed, delta, scrollRatio, pointerX, pointerY) => {
      earthWire.rotation.y = elapsed * 0.04;
      horizonRing.rotation.z = elapsed * 0.05;
      outerRelayRing.rotation.z = -elapsed * 0.035;

      satPrimary.rotation.y = elapsed * 0.26;
      satPrimary.rotation.z = Math.sin(elapsed * 0.5) * 0.1;
      satPrimary.position.y = 1.05 + Math.sin(elapsed * 0.8) * 0.14;

      satSecondary.rotation.y = -elapsed * 0.2;
      satSecondary.position.y = -1.05 + Math.cos(elapsed * 0.7) * 0.14;

      satRelay.rotation.y = elapsed * 0.35;
      satRelay.position.x = 0.75 + Math.sin(elapsed * 0.4) * 0.25;

      downlinkCone.scale.x = 1 + Math.sin(elapsed * 2.1) * 0.08;
      downlinkCone.scale.z = 1 + Math.sin(elapsed * 2.1) * 0.08;

      beacons.forEach((b, idx) => {
        const pulse = 1 + Math.sin(elapsed * 2.5 + idx * 1.4) * 0.28;
        b.scale.setScalar(pulse);
      });

      for (let i = 0; i < packetsA.length; i++) {
        const t = (elapsed * 0.15 + i * 0.25) % 1;
        arcCurveA.getPointAt(t, _packetPos);
        packetsA[i].position.copy(_packetPos);

        const tb = (elapsed * 0.2 + i * 0.25) % 1;
        arcCurveB.getPointAt(tb, _packetPos);
        packetsB[i].position.copy(_packetPos);
      }

      const targetX = pointerX * 0.45 - scrollRatio * 0.8;
      const targetY = pointerY * 0.25 - scrollRatio * 1.1;
      const targetZ = 6.2 + scrollRatio * 1.2;

      camX = THREE.MathUtils.damp(camX, targetX, 3.5, delta);
      camY = THREE.MathUtils.damp(camY, targetY, 3.5, delta);
      camZ = THREE.MathUtils.damp(camZ, targetZ, 3.5, delta);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0.45, -0.22 - scrollRatio * 0.4, -1.5);
    },
    dispose: () => {
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
  };
}
