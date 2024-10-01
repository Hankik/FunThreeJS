import * as THREE from 'three';

export function create() {
    const token = {
        root: new THREE.Object3D(),
        body: new THREE.Mesh(new THREE.SphereGeometry(1), new THREE.MeshStandardMaterial()),
        state: globalThis.ACTOR_STATE.ALIVE,
    }
    init(token);
    return token;
}

export function init(token) {
    token.root.position.set((0.5 - Math.random()) * 2 * 10, 0, (0.5 - Math.random()) * 2 * 10);
    token.body.position.set(0, 0.5, 0);
    token.root.add(token.body);
    token.root.name = "token";

    token.root.castShadow = true;
    token.body.castShadow = true;
}

export function update(token) {
    if (token.state !== globalThis.ACTOR_STATE.ALIVE) return;

    const player = token.root.parent.getObjectByName("player");

    //console.log(token.root.position.distanceTo(player.position));
    if (token.root.position.distanceTo(player.position) < 2) {
        globalThis.points++;
        globalThis.doc.innerHTML = `Points: ${globalThis.points}`;
        token.state = globalThis.ACTOR_STATE.DEAD;
    }
}