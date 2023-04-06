import "./style.css";
import * as THREE from "three";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  SphereGeometry,
} from "three";
import GUI from "lil-gui";

//创建场景容器
const scene = new THREE.Scene();
const gui = new GUI();

const sphereGeometry = new THREE.SphereGeometry(0.5, 8, 8);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.x = 2;
cube.rotation.x = 5;

const donutGeometry = new THREE.TorusGeometry(0.5, 0.2, 20, 40);
const donut = new THREE.Mesh(donutGeometry, material);
donut.position.x = -2;

material.side = THREE.DoubleSide;
const plane = new THREE.Mesh(new PlaneGeometry(15, 13, 5), material);
plane.position.z = -1;
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(sphere, cube, donut, plane);

// 环境光
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.5;
scene.add(ambientLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);

// 点光源 就像打火机
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = -1;
pointLight.position.y = -0.5;
pointLight.position.z = 1;
scene.add(pointLight);

// 方向光
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.8);
directionalLight.position.set(20, 0.25, 0); //改变环境光的方向
scene.add(directionalLight);

// 半球灯
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

// 矩形区域灯
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

// 聚光灯(像手电筒)
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);
// 移动聚光灯
spotLight.target.position.x = -0.75;
scene.add(spotLight.target);

// 性能高 环境光 半球灯
// 性能低 聚光灯 矩形区域灯

// 相机
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// 创建相机 使用PerspectiveCamera类，我们需要提供两个基本参数。
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 0.5;
camera.position.z = 3.5;
//将相机正对着0, -1, 0这个位置：
camera.lookAt(new THREE.Vector3(0, -1, 0));
scene.add(camera);

// 渲染
// 1.创建渲染器
// 先在html中创建画布并将其发送到渲染器
const canvas = document.querySelector("canvas.webgl"); //todo 这里为什么加canvas.
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

const controls = new OrbitControls(camera, canvas);
controls.enableRotate = true;
window.addEventListener("mousemove", () => {
  controls.update();
});

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); //更新矩阵
  // 更新renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//给渲染器设置大小 这个会自动相应地调整画布canvas的大小
renderer.setSize(sizes.width, sizes.height);
// 2.渲染
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  cube.rotation.z = 0.15 * elapsedTime;

  camera.lookAt(cube.position);
  controls.update();

  scene.add(camera);

  //mark 調用了tick這裏一定要重新渲染 否則不會出現模型
  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};

tick();
