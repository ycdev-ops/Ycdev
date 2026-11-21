import type * as THREE from 'three';

export interface Footer3DController {
  update: (elapsed: number) => void;
  dispose: () => void;
}

export function createFooter3DSceneFactory(THREE: typeof import('three')) {
  return function createFooter3DScene(scene: THREE.Scene): Footer3DController {
  // Animated bathymetric / orbital wireframe horizon wave inside Footer
  const planeGeo = new THREE.PlaneGeometry(34, 12, 36, 16);
  const basePos = planeGeo.attributes.position.array.slice() as Float32Array;

  const waveMesh = new THREE.Mesh(
    planeGeo,
    new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    })
  );
  waveMesh.rotation.x = -Math.PI / 2.25;
  waveMesh.position.set(0, -1.1, -3.5);
  scene.add(waveMesh);

  // Subtle satellite relay arc sweeping smoothly above footer wave horizon
  const arcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-9, -0.4, -4),
    new THREE.Vector3(-2, 1.35, -3.5),
    new THREE.Vector3(4, 1.1, -3.8),
    new THREE.Vector3(10, -0.6, -4.2),
  ]);
  const arcTube = new THREE.Mesh(
    new THREE.TubeGeometry(arcCurve, 44, 0.018, 6, false),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.32 })
  );
  scene.add(arcTube);

  const satNode = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.14, 0),
    new THREE.MeshBasicMaterial({ color: 0x7dd3fc })
  );
  scene.add(satNode);

  const packet = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x34d399 })
  );
  scene.add(packet);

  const posVec = new THREE.Vector3();

  return {
    update: (elapsed) => {
      const attrs = planeGeo.attributes.position;
      for (let i = 0; i < attrs.count; i++) {
        const bx = basePos[i * 3];
        const by = basePos[i * 3 + 1];
        const zOffset =
          Math.sin(bx * 0.42 + elapsed * 1.15) * 0.28 +
          Math.cos(by * 0.55 + elapsed * 0.9) * 0.18;
        attrs.setZ(i, zOffset);
      }
      attrs.needsUpdate = true;

      const tSat = (elapsed * 0.08) % 1;
      arcCurve.getPointAt(tSat, posVec);
      satNode.position.copy(posVec);
      satNode.rotation.y = elapsed * 1.4;

      const tPkt = (elapsed * 0.22 + 0.35) % 1;
      arcCurve.getPointAt(tPkt, posVec);
      packet.position.copy(posVec);
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
