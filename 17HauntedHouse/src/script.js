import "./style.css";

import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Scene } from "three";

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);
// 重複每个草的纹理
grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);
// 激活重复
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const material = new THREE.MeshStandardMaterial({
  map: grassColorTexture,
  aoMap: grassAmbientOcclusionTexture,
  normalMap: grassNormalTexture,
  roughnessMap: grassRoughnessTexture,
});
material.side = THREE.DoubleSide;
const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), material);
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = Math.PI / 2;
floor.receiveShadow = true
scene.add(floor);

// Light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 256//减小阴影贴图 提升性能
moonLight.shadow.mapSize.height = 256
moonLight.shadow.camera.far = 15
scene.add(moonLight);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.castShadow = true;
doorLight.position.set(0, 2.2, 2.7);
doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.camera.far = 7
scene.add(doorLight);

// fog
const fog = new THREE.Fog("#262837", 1, 15); //color,near,far
scene.fog = fog;

// Texture
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// House Container
const house = new THREE.Group();
scene.add(house);

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float16BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
walls.castShadow = true
house.add(walls);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
house.add(roof);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture, //在材质暗的地方添加阴影 需要给几何体添加uv2属性
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true


scene.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);

  grave.castShadow = true
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

// Ghosts
const ghost1 = new THREE.PointLight("#ff0ff", 2, 3); //color intensity distence
const ghost2 = new THREE.PointLight("#ff0ff", 2, 3);
const ghost3 = new THREE.PointLight("#ff0ff", 2, 3);
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
scene.add(ghost1, ghost2, ghost3);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.y = 3;
camera.position.x = 3;
scene.add(camera);

const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
const controls = new OrbitControls(camera, canvas);
window.addEventListener("mousemove", () => {
  controls.update();
});

renderer.shadowMap.enabled = true; //在渲染器上激活贴图
renderer.setClearColor("#262837"); //背景設置和雾相同的颜色
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4; //todo why shall we use cos
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  controls.update();

  scene.add(camera);

  //mark 調用了tick這裏一定要重新渲染 否則不會出現模型
  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};

tick();
