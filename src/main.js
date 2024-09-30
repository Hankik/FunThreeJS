import './style.css';
import * as THREE from 'three';
import * as LEVEL from './level.js';
import * as CONTROLLER from './controller.js';


const canvas = document.querySelector("canvas.webgl");
globalThis.mouse = new THREE.Vector2();
globalThis.detailsId = null;
globalThis.zoom = 1;
globalThis.points = 0;
globalThis.doc = document.getElementById("info");

globalThis.pointer = new THREE.Vector2();
globalThis.keys = new Map();
Array.from("abcdefghijklmnopqrstuvwxyz1234567890").forEach((c) => globalThis.keys.set(c, false));
let handleKeyDown = (key) => globalThis.keys.set(key.toLowerCase(), true);
let handleKeyUp = (key) => globalThis.keys.set(key.toLowerCase(), false);
document.addEventListener("keydown", (event) => handleKeyDown(event.key), false);
document.addEventListener("keyup", (event) => handleKeyUp(event.key), false);
//canvas.addEventListener("click", async () => { await canvas.requestPointerLock(); });
document.addEventListener("mousemove", (event) => globalThis.mouse.set(event.movementX, event.movementY));
document.addEventListener("wheel", (event) => { globalThis.zoom += event.deltaY * 0.01; globalThis.zoom = THREE.MathUtils.clamp(globalThis.zoom, 0.1, 10); zoom(); });
document.addEventListener("click", (event) => { on_click(); });
canvas.addEventListener("pointermove", (event) => { on_pointer_move(event); });

const level = LEVEL.create();
const player = level.player;
const camera = player.camera;
globalThis.level = level;

canvas.width = 1080;
canvas.height = 600;

function on_pointer_move(event) {
  globalThis.pointer.x = (event.clientX / canvas.width) * 2 - 1;
  globalThis.pointer.y = - (event.clientY / canvas.height) * 2 + 1;
}

function zoom() {
  CONTROLLER.zoom(level.controller);
}

function on_click() {
  CONTROLLER.on_click(level.controller);
}




(async function () {
  await ImGui.default();

  window.addEventListener("resize", () => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.scrollWidth * devicePixelRatio;
    canvas.height = canvas.scrollHeight * devicePixelRatio;
  });

  ImGui.CreateContext();
  // ImGui_Impl.Init(canvas);

  ImGui.StyleColorsDark();
  //ImGui.StyleColorsClassic();

  const clear_color = new ImGui.ImVec4(0.3, 0.3, 0.3, 1.00);

  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  ImGui_Impl.Init(canvas);

  let done = false;
  window.requestAnimationFrame(_loop);
  function _loop(time) {

    LEVEL.update(level);

    ImGui_Impl.NewFrame(time);
    ImGui.NewFrame();

    ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
    ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 140), ImGui.Cond.FirstUseEver);
    ImGui.Begin("Scene Hierarchy");

    function build_object_tree(object, searched_objects, flags) {

      if (object.visible !== undefined) {

        ImGui.Checkbox("", (value = object.visible) => object.visible = value);
        ImGui.SameLine();
      }

      let node_flags = flags;
      // if (object.id !== globalThis.detailsId) {
      //   ImGui.Text(object.name + " !== " + globalThis.detailsId);
      //   ImGui.SameLine();
      // }
      if (object.id === globalThis.detailsId) {
        node_flags = ImGui.TreeNodeFlags.Selected | ImGui.TreeNodeFlags.OpenOnDoubleClick;
      }

      if (object.children.length > 0) {
        if (ImGui.TreeNodeEx(object.name, node_flags)) {
          for (let i = 0; i < object.children.length; i++) {
            const child = object.children[i];
            if (searched_objects.has(child)) continue;

            searched_objects.add(child);
            ImGui.TreePush(child.id);
            build_object_tree(child, searched_objects, ImGui.TreeNodeFlags.OpenOnDoubleClick);

          }

        }
        if (ImGui.IsItemClicked() && !ImGui.IsItemToggledOpen()) {
          if (object.id === globalThis.detailsId)
            globalThis.detailsId = null;
          else
            globalThis.detailsId = object.id;
        }
      }
      else {
        if (ImGui.Selectable(object.name, object.id === globalThis.detailsId)) {
          globalThis.detailsId = object.id;
        }
      }
      ImGui.TreePop();

    }

    build_object_tree(level.scene, new Set(), ImGui.TreeNodeFlags.OpenOnDoubleClick);

    ImGui.End();

    ImGui.EndFrame();

    if (globalThis.detailsId) {
      let object = level.scene.getObjectById(globalThis.detailsId);
      ImGui.SetNextWindowPos(new ImGui.ImVec2(canvas.width - 284, 20), ImGui.Cond.FirstUseEver);
      ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 500), ImGui.Cond.FirstUseEver);
      ImGui.Begin(object.type + " Details");

      for (let property in object) {
        ImGui.Text(property + ": " + JSON.stringify(object[property]));
      }

      ImGui.End();

      ImGui.EndFrame();
    }



    ImGui.Render();

    renderer.setClearColor(new THREE.Color(clear_color.x, clear_color.y, clear_color.z), clear_color.w);
    renderer.setSize(canvas.width, canvas.height);
    // camera.aspect = canvas.width / canvas.height;
    // camera.updateProjectionMatrix();
    renderer.render(level.scene, camera);

    ImGui_Impl.RenderDrawData(ImGui.GetDrawData());

    // TODO: restore WebGL state in ImGui Impl
    renderer.state.reset();

    window.requestAnimationFrame(done ? _done : _loop);
  }

  function _done() {
    ImGui_Impl.Shutdown();
    ImGui.DestroyContext();
  }
})();
