import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

//创建场景容器
const scene = new THREE.Scene();

const parameters = {
  color: 0xfcfcfc,
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};

//  在加载图像时收到通知 用loadingManager
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
loadingManager.onStart = () => {
  console.log("loading started");
};
// 开始加载所需的所有纹理
const colorTexture = textureLoader.load("/door.jpg");
// 重复纹理
// colorTexture.repeat.x = 2;
// colorTexture.repeat.y = 3;
colorTexture.wrapS = THREE.RepeatWrapping; //更新 因为默认纹理设置为不重复
colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.offset.x = 0.5;
// colorTexture.offset.y = 0.5;
colorTexture.rotation = Math.PI * 0.25; //旋转
colorTexture.center.x = 0.5; //没有设置repeat和offset 如果不设置旋转中心 默认在左下角
colorTexture.center.y = 0.5;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//调试面板
const gui = new dat.GUI({ closed: true });
gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(mesh, "visible"); //控制显示和隐藏
gui.add(material, "wireframe"); //控制材料属性

gui.addColor(parameters, "color").onChange(() => {
  material.color.set(parameters.color);
}); //改变颜色
gui.add(parameters, "spin"); //绕着y轴旋转360度

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

const tick = () => {
  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2;
  camera.position.y = cursor.y * 3;
  camera.lookAt(mesh.position);
  controls.update();
  scene.add(camera);

  // 渲染
  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};
tick();
