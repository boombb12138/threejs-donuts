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

const image = new Image();
const texture = new THREE.Texture(image);

// 对象：几何图形 光源
// 创建对象需要几何体和材料
// 1. 创建几何图形
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 2.创建材质
const material = new THREE.MeshBasicMaterial({ map: texture });
// 3.传入Mesh
const mesh = new THREE.Mesh(geometry, material);
// 4.将mesh添加到场景
scene.add(mesh);

//调试面板
const gui = new dat.GUI({ closed: true });
// 第一個参数是要调整的对象 第二个参数是要调整的对象的属性
// 后面的参数是最小值 最大值 精度 重命名
// gui.add(mesh.position, "y", -3, 3, 0.01);
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
// 创建相机 使用PerspectiveCamera类，我们需要提供两个基本参数。
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
  // 更新相机aspect属性
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix(); //更新矩阵
  // 更新renderer
  renderer.setSize(sizes.width, sizes.height);
  // 获取屏幕像素比，并更新渲染器的像素比
  // 像素比大于2主要是营销
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

image.addEventListener("load", () => {
  texture.needsUpdate = true;
});
image.src = "/door.jpg";

// 渲染
// 1.创建渲染器
// 先在html中创建画布并将其发送到渲染器
const canvas = document.querySelector("canvas.webgl"); //todo 这里为什么加canvas.
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
//给渲染器设置大小 这个会自动相应地调整画布canvas的大小
renderer.setSize(sizes.width, sizes.height);
// 2.渲染
renderer.render(scene, camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// 动画
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });
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
