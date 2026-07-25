import * as THREE from 'three'

export function getPlanetUp(position, planetCenter = new THREE.Vector3(0, 0, 0)) {
  return new THREE.Vector3().subVectors(position, planetCenter).normalize()
}

export function snapToSurface(position, radius, offset = 0) {
  const dir = position.clone().normalize()
  return dir.multiplyScalar(radius + offset)
}

export function surfaceQuaternion(up) {
  const q = new THREE.Quaternion()
  q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
  return q
}

export function buildSurfaceFrame(up, lookDir) {
  const forward = lookDir.clone().sub(up.clone().multiplyScalar(lookDir.dot(up))).normalize()
  const right = new THREE.Vector3().crossVectors(forward, up).normalize()
  return { forward, right }
}
