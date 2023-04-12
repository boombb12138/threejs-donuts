import "./style.css";

import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const gui = new GUI();

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

const parameters = {
  materialColor: "#ffeded",
};
gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
});

/**
 * geometry
 */

const gradientTexture = textureLoader.load("textures/gradients/3.jpg");
// 默認情況下 WebGL會將圖片跟临近物体的像素的接近的像素展示出来，这样就会呈现渐变效果
// 希望最接近图片本身的像素，而不是临近像素，就要用NearestFilter
gradientTexture.magFilter = THREE.NearestFilter;
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
}); //MeshToonMaterial只有在光下才看得到
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 16), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
scene.add(mesh1, mesh2, mesh3);

const objectsDistance = 4;
mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

/**
 * resize
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const canvas = document.querySelector("canvas.webgl");

/**
 * 视差
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height);
camera.position.z = 6;
cameraGroup.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.12);
scene.add(ambientLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true, ////清除背景色法1 使canvas背景为透明
});

renderer.setClearAlpha(0); ////清除背景色法2
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);

/**
 * Scroll
 */

let currentSection = 0;

let scrollY = window.scrollY;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height);
  console.log(newSection);

  if (newSection !== currentSection) {
    currentSection = newSection;
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

const sectionMeshes = [mesh1, mesh2, mesh3];
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime; //现在这一帧和上一帧花费的时间
  previousTime = elapsedTime;

  camera.position.y = (-scrollY / sizes.height) * objectsDistance;

  const parallaxX = cursor.x;
  const parallaxY = -cursor.y;
  cameraGroup.position.x = parallaxX; //将视差应用到cameraGroup就不会出现相机不移动的问题
  cameraGroup.position.y = parallaxY;
  scene.add(cameraGroup);

  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};

tick();
