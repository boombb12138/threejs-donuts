import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

//创建场景容器
const scene = new THREE.Scene();

// 添加调试器
const gui = new dat.GUI();

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("/color.jpg");
const doorAlphaTexture = textureLoader.load("/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load("/ambientOcclusion.jpg");
const doorHeightTexture = textureLoader.load("/height.png");
const doorNormalTexture = textureLoader.load("/.normal.jpg");
const doorMetalnessTexture = textureLoader.load("/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/roughness.jpg");
const matcapTexture = textureLoader.load("/1.jpg");
// const gradientTexture = textureLoader.load(imgThree);

//{ map: doorColorTexture }
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color("#ff0000"); //給紋理著色
// material.wireframe = true; //細綫顯示
// material.transparent = true;
// material.opacity = 0.5; //transparent 和 opacity控制透明度
// material.side = THREE.DoubleSide; //控制正反面都可見 會降低性能

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true; //每个组成面都有棱有角

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100; //控制光反射 值越高 表面越亮
// material.specular = new THREE.Color(0x1188ff); //反射的颜色

// 卡通效果
// const material = new THREE.MeshToonMaterial();

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
// material.map = doorColorTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);

//環境貼圖
// https://polyhaven.com/ 找貼圖
// 將HDRI轉为three.js可以接收的格式：CubeMap
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "/StandardCubeMap/nx.png",
  "/StandardCubeMap/ny.png",
  "/StandardCubeMap/nz.png",
  "/StandardCubeMap/px.png",
  "/StandardCubeMap/py.png",
  "/StandardCubeMap/pz.png",
]);
material.envMap = environmentMapTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

//uv贴图 反光 真实性==========
// sphere.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
// );
// plane.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
// );
// torus.geometry.setAttribute(
//   "uv2",
//   new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
// );
// material.aoMap = doorAmbientOcclusionTexture; //使用纹理
// material.aoMapIntensity = 1; //强度
// material.displacementMap = doorHeightTexture; // 移动顶点以创建真正的浮雕
// material.displacementScale = 0.05; //调顶点
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

scene.add(sphere, plane, torus);

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

// 相机 使画布完全适合视口
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
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

// 渲染
const canvas = document.querySelector("canvas.webgl"); //todo 这里为什么加canvas.
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
// 2.渲染
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// Animate
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  console.log(elapsedTime);
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  camera.lookAt(plane.position);
  controls.update();
  scene.add(camera);

  //mark 調用了tick這裏一定要重新渲染 否則不會出現模型
  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};

tick();
