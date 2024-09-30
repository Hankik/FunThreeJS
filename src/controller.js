import * as THREE from 'three';

export function create(pawn) {

    const new_controller = {
        pawn: pawn,
        pawn_camera: null,
        raycaster: new THREE.Raycaster(),

    }

    init(new_controller);
    return new_controller;
}


export function init(controller) {

}

export function set_pawn(controller, new_pawn) {
    controller.pawn = new_pawn;
    controller.camera = new_pawn.root.getObjectByName("camera");
}

export function zoom(controller) {
    const new_camera_pos = controller.camera.userData.startPosition.clone().multiplyScalar(globalThis.zoom);
    controller.camera.position.set(new_camera_pos.x, new_camera_pos.y, new_camera_pos.z);
}


export function create_move_to_command(object, target, speed, threshold = 0.1) {
    const move_to_command = {
        object: object,
        target: target,
        speed: speed,
        threshold: threshold,
        call() {
            //console.log("object: ", this.object, "\ntarget: ", this.target, "\nspeed: ", this.speed, "\nthreshold: ", this.threshold);
            const object_position = this.object.getWorldPosition(new THREE.Vector3());
            const dist_to_target = this.target.distanceTo(object_position);
            if (dist_to_target > this.threshold) {
                const target_dir = this.target.clone().sub(object_position);
                //console.log(target_dir);
                if (dist_to_target > this.speed) {
                    this.object.position.add(target_dir.normalize().multiplyScalar(this.speed));
                } else {
                    this.object.position.set(this.target.x, this.target.y, this.target.z);
                }
            } else {
                globalThis.level.commands.push(create_move_to_command(this.object, this.target, this.speed, this.threshold));
            }
        }
    }
    return move_to_command;
}

export function create_rotate_to_command(object, rotation, speed, threshold = 0.1) {
    const look_at_command = {
        object: object,
        target: target,
        speed: speed,
        threshold: threshold,
        call() {

            
        }
    }
}



export function on_click(controller) {

    controller.raycaster.setFromCamera(globalThis.pointer.clone(), controller.camera);
    const intersects = controller.raycaster.intersectObjects(controller.pawn.root.parent.children);

    if (intersects.length > 0) {
        const hit_point = intersects[0].point;
        globalThis.level.commands.push(create_move_to_command(controller.pawn.root, hit_point, 0.1, 0.001));
    }
}

