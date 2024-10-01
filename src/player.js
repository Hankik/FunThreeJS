import * as THREE from 'three';
import { create_camera } from './utility.js';

export function create() {
    const new_player = {
        root: new THREE.Object3D(),
        body: new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial()),
        camera: create_camera(),
        state: globalThis.ACTOR_STATE.ALIVE,
    }
    init(new_player);
    return new_player;d
}


export function init(player) {
    
    player.body.position.set(0, 0.5, 0);
    player.root.add(player.body);
    player.root.name = "player";

    // SETUP CAMERA
    const cameraArm = new THREE.Object3D();
    cameraArm.name = "cameraArm";
    cameraArm.add(player.camera);
    player.root.add(cameraArm);

    const forward = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 3, 0x00ff00);

    player.root.add(forward);

    player.root.castShadow = true;

    player.body.castShadow = true;
}


export function update(player) {
    if (player.state !== globalThis.ACTOR_STATE.ALIVE) return;

    let w_pressed = globalThis.keys.get("w");
    let a_pressed = globalThis.keys.get("a");
    let s_pressed = globalThis.keys.get("s");
    let d_pressed = globalThis.keys.get("d");

    let isMoving = w_pressed || a_pressed || s_pressed || d_pressed;

    if (isMoving) {
        let forward = player.root.getWorldDirection(new THREE.Vector3());
        let right = new THREE.Vector3(-forward.z, 0, forward.x);
        player.root.position.add(w_pressed ? forward.multiplyScalar(0.1) : new THREE.Vector3()).add(s_pressed ? forward.multiplyScalar(-0.1) : new THREE.Vector3());
        player.root.position.add(a_pressed ? right.multiplyScalar(-0.1) : new THREE.Vector3()).add(d_pressed ? right.multiplyScalar(0.1) : new THREE.Vector3());
    }

    player.camera.lookAt(player.root.position);
}

