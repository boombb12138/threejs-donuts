import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import color from "../static/color.jpg";
import alpha from "../static/alpha.jpg";
import ambientOcclusion from "../static/ambientOcclusion.jpg";
import height from "../static/height.png";
import normal from "../static/normal.jpg";
import metalness from "../static/metalness.jpg";
import roughness from "../static/roughness.jpg";
import imgOne from "../static/1.png";
import imgThree from "../static/3.png";
//创建场景容器
const scene = new THREE.Scene();
// document.location.href = "http://192.168.10.10:8080";
// // Texture

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;

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
