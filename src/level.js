import * as THREE from 'three';
import * as PLAYER from './player.js';
import * as CONTROLLER from './controller.js';

globalThis.ACTOR_STATE = Object.freeze({
    ALIVE: 0,
    DEAD: 1,
    ASLEEP: 2
});

export function create() {

    const new_level = {
        scene: new THREE.Scene(),
        player: PLAYER.create(),
        controller: CONTROLLER.create(),
        commands: new Array(),
    }
    init(new_level);
    return new_level;
}

export function init(level) {
    CONTROLLER.set_pawn(level.controller, level.player);

    level.scene.add(level.player.root);

    // LIGHTING AND SHADOWS
    let plight = new THREE.PointLight(0xffffff, 10, 100);
    plight.position.set(1, 3, 1);
    plight.castShadow = true;
    plight.shadow.radius = 3;
    level.scene.add(plight);

    // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    // ambientLight.name = "ambientLight";
    // level.scene.add(ambientLight);

    const light = new THREE.HemisphereLight(0x0000ff, 0xff0000, 1);
    level.scene.add(light);
    // LIGHTING AND SHADOWS

    // PROPS
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial());
    plane.rotateX(-Math.PI / 2);
    plane.position.y = -0.5;
    plane.receiveShadow = true;
    level.scene.add(plane);

    console.log(level);
}

export function update(level) {

    PLAYER.update(level.player);

    for (let i = level.commands.length - 1; i >= 0; i--) {
        let command = level.commands[i];
        command.call();
        level.commands = level.commands.splice(i, 1);
    }
}

export function display(level) {

}