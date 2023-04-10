import "./style.css";

import * as THREE from "three";
import GUI from "../../16Shadow/node_modules/lil-gui/dist/lil-gui.esm";

const scene = new THREE.Scene();
const gui = new GUI();

const material = new THREE.MeshStandardMaterial();
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshStandardMaterial(material)
);
scene.add(plane);

const ambientLight = new THREE.AmbientLight();
ambientLight.color = new THREE.Color(0xffffff);
ambientLight.intensity = 0.3;
scene.add(ambientLight);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes);
