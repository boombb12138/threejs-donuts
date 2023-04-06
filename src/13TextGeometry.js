import "./style.css";
import * as THREE from "three";
import typefaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//创建场景容器
const scene = new THREE.Scene();

// Fonts
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Li Naomi", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);
  textGeometry.center();

  const textureLoader = new THREE.TextureLoader();
  const matcapTexture = textureLoader.load("/textures/bgGreen.png");

  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, material);
  // Animate
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // text.rotation.z = 0.15 * elapsedTime;

    camera.lookAt(text.position);
    controls.update();
    scene.add(camera);

    //mark 調用了tick這裏一定要重新渲染 否則不會出現模型
    renderer.render(scene, camera);
    // 下一帧继续调用tick
    window.requestAnimationFrame(tick);
  };

  tick();
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);

  // 100个悬浮的
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }

  scene.add(text);
  renderer.render(scene, camera);
});

// 相机
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
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

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

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
