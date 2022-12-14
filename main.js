import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// scene === container
const scene = new THREE.Scene();

// PerspectiveCamera -> similar to human eyes
// PerspectiveCamera(field of view, aspect ratio, view frustum)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// renderer should know which DOM element to use === canvas
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);

// full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);

// camera positioned middle of the scene -> move along the z-axis to get better perspective when adding shapes
camera.position.setZ(30);

// render === draw
renderer.render(scene, camera);

// add objects to the browser
// geometry -> the {x, y, z} points that makeup a shape
// set a vector that define the object itself
// TorusGeometry -> big 3D ring
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// define a material(color, texture) -> wrapping paper for an object
// either use builtin materials in Threejs, or make a custom shaders using WebGL
// most material rely on light source
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });

// mesh === geometry + material
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// show the position of pointLight
// const lightHelper = new THREE.PointLightHelper(pointLight);

// draws 2D grid along the scene
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// listen to DOM events on the mouse and update the camera position accordingly
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); // radius = 0.25
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh( geometry, material );

  // randomly position the stars
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

// how many stars?
Array(200).fill().forEach(addStar);

// add background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// avatar box
const dogTexture = new THREE.TextureLoader().load('dog.jpg');

const dog = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: dogTexture })
);

scene.add(dog);

// moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

// direction of scroll
// can set using both code styles below
moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
  // calculate where the user is currently scrolled to
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  dog.rotation.y += 0.01;
  dog.rotation.z += 0.01;

  // change the position of the camera
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

// activates the event everytime the user scrolls
document.body.onscroll = moveCamera;

// to actually see it, re-render the screen
// but don't need to render and render again like below
// renderer.render(scene, camera);
// instead, set up a recursive funciton that gives infinite loop that calls the render method automatically.
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update(); // update changes in UI

  renderer.render(scene, camera);
};

animate();