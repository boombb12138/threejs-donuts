import "./style.css";
import * as THREE from "three";

//创建场景容器
const scene = new THREE.Scene();

// 对象：几何图形 光源
// 创建对象需要几何体和材料
// 1. 创建几何图形
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 2.创建材质
const material = new THREE.MeshBasicMaterial({ color: "red" });
// 3.传入Mesh
const mesh = new THREE.Mesh(geometry, material);
// 4.将mesh添加到场景
scene.add(mesh);

// 相机
const sizes = {
  width: 800,
  height: 600,
};
// 创建相机 使用PerspectiveCamera类，我们需要提供两个基本参数。
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
//将相机正对着0, -1, 0这个位置：
// camera.lookAt(new THREE.Vector3(0, -1, 0));
scene.add(camera);

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

// 动画
// let time = Date.now();
const clock = new THREE.Clock();
const tick = () => {
  //   const currentTime = Date.now();
  //   const deltaTime = currentTime - time;
  //   time = currentTime;
  //   mesh.rotation.y += 0.002 * deltaTime;

  const elapsedTime = clock.getElapsedTime();
  //   //  更新对象
  //   mesh.rotation.x = Math.cos(elapsedTime);
  //   mesh.rotation.y = Math.sin(elapsedTime);

  //   給相机制作动画
  camera.position.x = Math.cos(elapsedTime);
  camera.position.y = Math.sin(elapsedTime);
  camera.lookAt(mesh.position);

  // 渲染
  renderer.render(scene, camera);
  // 下一帧继续调用tick
  window.requestAnimationFrame(tick);
};
tick();
