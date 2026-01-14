// imports
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/modules/RoomEnvironment.js';
// import { GUI } from 'three/addons/modules/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/modules/GLTFLoader.js';
// html
let container = document.querySelector('.myLogo');
let width = container.clientWidth;
let height = container.clientHeight;
// ============ THIS IS BASED ============ //
// fog
let fogColor = 0x000000;
let fogNear = 0;
let fogFar = 20;
// colors
let materialColor = 0x0084ff;
let materialEmissive = 0x2930ff;
let materialSpecular = 0xff7a7a;
let materialRoughness = 0.2;
let materialMetalness = 0.5;
let ambientLightColor = 0xffffff;
let pointLightColor = { l1: 0xffffff, l2: 0xffffff, l3: 0xffffff };
let materialShininess = 50;
let materialReflectivity = 50;
let materialClearcoat = 50;
let materialClearcoatRoughness = 50;
let lightsSpeed = 1;
let rotationSpeed = 10;
let jumpSpeed = 8;
let model;
let modelRotate = { x: 100, y: 0, z: 5 };
let modelPosition = { x: 0, y: 0.05, z: 3 };
// ============ CODE ============ //
// create renderer
const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true, alpha: true })
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild( renderer.domElement ); 
// create scene and fog
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
// create fake room
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.08 ).texture;
// create camera
const camera = new THREE.PerspectiveCamera( 6, width / height, 10, 100 );
camera.position.z = 15;
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
// create lights
const ambientLight = new THREE.AmbientLight( ambientLightColor );
const light1 = new THREE.PointLight( pointLightColor.l1, 1, 0 );
light1.position.set( 0, 200, 0 );
const light2 = new THREE.PointLight( pointLightColor.l2, 1, 0 );
light2.position.set( 100, 200, 100 );
const light3 = new THREE.PointLight( pointLightColor.l3, 1, 0 );
light3.position.set( - 100, - 200, - 100 );
//add lights
scene.add( ambientLight );
scene.add( light1 );
scene.add( light2 );
scene.add( light3 );
// load GLTF model
const loader = new GLTFLoader();
loader.load('./main/logo.gltf', gltf => {
  model = gltf.scene.children[0];
	model.position.set(modelPosition.x, modelPosition.y, modelPosition.z); 
  model.rotation.x = THREE.MathUtils.degToRad(modelRotate.x);
  model.rotation.y = THREE.MathUtils.degToRad(modelRotate.y);
  model.rotation.z = THREE.MathUtils.degToRad(modelRotate.z);
	// настройка материала для модели
  const material = new THREE.MeshPhysicalMaterial({
    color: materialColor,
    emissive: materialEmissive,
		specular: materialSpecular,
    roughness: materialRoughness,
    metalness: materialMetalness,
		reflectivity: materialReflectivity,
		clearcoat: materialClearcoat,
		clearcoatRoughness: materialClearcoatRoughness,
		shininess: materialShininess,
		flatShading: false,
		wireframe: false,
		vertexColors: false
  });
  model.traverse(child => {
    if (child instanceof THREE.Mesh) {
      child.material = material;
    }
  });
  scene.add(model);
});
// pointlight rotation
function rotateLights(speed) {
  light1.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(speed));
  light2.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(speed));
  light3.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(speed));
}
// model rotation
function rotateModel() {
	model.rotation.z += THREE.MathUtils.degToRad(rotationSpeed) / 20; 
}
// jump model
function jumpModel() {
  const maxHeight = modelPosition.y + 0.02;
  const minHeight = 0;
  if (model.position.y >= maxHeight) {
    jumpSpeed = -jumpSpeed;
  }
  if (model.position.y <= minHeight) {
    model.position.y = minHeight;
    jumpSpeed = -jumpSpeed;
  }
  model.position.y += jumpSpeed / 40000;
}
// create animation
function animate() {
  requestAnimationFrame( animate );
  rotateLights(lightsSpeed);
	rotateModel();
	jumpModel();
  renderer.render( scene, camera );
}
	// create responsive
window.addEventListener( 'resize', function () {
  width = container.clientWidth;
  height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  renderer.setPixelRatio(window.devicePixelRatio);
}, false );
animate();
render();