import "./style.css";
import * as THREE from "three";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { PlaneGeometry } from "three";

//创建场景容器
const scene = new THREE.Scene();
const gui = new GUI();

const sphereGeometry = new THREE.SphereGeometry(0.5, 15, 15);
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);

// material.side = THREE.DoubleSide;
// material.metalness = 0.1;
gui.add(material, "metalness").min(0).max(1).step(0.001);

// 烘焙阴影
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("/static/bakedShadow.jpg");

// material.side = THREE.DoubleSide;
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  // material
  new THREE.MeshBasicMaterial({ map: bakedShadow })
);
plane.rotation.x = Math.PI / 2;
plane.position.y = -0.5;
plane.receiveShadow = true; //接收阴影

scene.add(plane);

// 环境光
const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.3;
scene.add(ambientLight);

// 定向光
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.4);
directionalLight.position.set(5, 0, 0);
scene.add(directionalLight);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
//设置阴影贴图大小 值必须是2的幂
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 26;
// 阴影模糊
directionalLight.shadow.radius = 10;

// 调整相机的振幅 可视范围
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);
directionalLightCameraHelper.visible = false;

// 聚光灯
const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(2, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);
// 提高阴影质量
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightCameraHelper);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.castShadow = true;
pointLight.position.set(-1, 3, 0);
scene.add(pointLight);
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);

// 相机
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// 渲染
const canvas = document.querySelector("canvas.webgl"); //todo 这里为什么加canvas.
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true, //消除锯齿
});

// 激活阴影
renderer.shadowMap.enabled = true;
sphere.castShadow = true; //投射阴影
directionalLight.castShadow = true; //激活光源上的阴影

// 阴影贴图算法
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, canvas);

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

// 取消所有阴影
// renderer.shadowMap.enabled = false;

//给渲染器设置大小 这个会自动相应地调整画布canvas的大小
renderer.setSize(sizes.width, sizes.height);
// 2.渲染
renderer.render(scene, camera);

const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  scene.add(camera);

  //mark 調用了tick這裏一定要重新渲染 否則不會出現模型
  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};

tick();
