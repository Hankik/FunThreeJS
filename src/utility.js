import * as THREE from 'three';

export function create_camera() {
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 2, -5);
    camera.userData.startPosition = camera.position.clone();
    camera.name = "camera";
    return camera;
}

export function setupObject(object) {

    object.userData.actorState = globalThis.ACTOR_STATE.ALIVE;

    if (!object.name || object.name === "") {
        switch (true) {
            case object instanceof THREE.Mesh: {
                object.name = "mesh";
            } break;
            case object instanceof THREE.Light: {
                object.name = "light";
            } break;
            case object instanceof THREE.Camera: {
                object.name = "camera";
            } break;
            case object instanceof THREE.Group: {
                object.name = "group";
            } break;
            case object instanceof THREE.ArrowHelper: {
                object.name = "arrowHelper";
            } break;
            default: {
                object.name = "unknown";
            }
        }
    }
    for (let child of object.children) {
        setupObject(child);
    }
}
