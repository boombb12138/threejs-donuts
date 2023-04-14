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
// scene.add(mesh);

// 坐标轴
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// 缩放
// mesh.scale.x = 2;
// mesh.scale.y = 0.25;
// mesh.scale.z = 0.5;

// rotation
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

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

// 创建组
const group = new THREE.Group();
group.scale.y = 2;
group.rotation.y = 0.2;
scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -1.5;
group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube2.position.x = 0;

group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube3.position.x = 1.5;
group.add(cube3);

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

// 将相机往后移动一些
// 在three.js中物体都是在x y z上移动  往后移动就要增加z的值
// 必须在向场景添加相机之前移动
