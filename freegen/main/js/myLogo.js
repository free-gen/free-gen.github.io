// imports
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/modules/RoomEnvironment.js';
import { GUI } from 'three/addons/modules/lil-gui.module.min.js';
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
let materialColor = 0x0084ff; // цвет материала
let materialEmissive = 0x000000; // свечение материала
let materialSpecular = 0xff7a7a; // цвет бликов
let materialRoughness = 0.5; // шероховатость материала
let materialMetalness = 0.7; // металличность материала
let ambientLightColor = 0xffffff; // цвет основной подсветки
let pointLightColor = { l1: 0xffffff, l2: 0xffffff, l3: 0xffffff }; // pointLight
let materialShininess = 50; // уровень сияния
let materialReflectivity = 50;
let materialClearcoat = 50;
let materialClearcoatRoughness = 50;

let lightsSpeed = 1; // скорость вращения точек освещения
let rotationSpeed = 20; // скорость вращения
let jumpSpeed = 20; // скорость прыжка
let model; // инициализация
let modelRotate = { x: 100, y: 0, z: 5 }; // наклон модели
let modelPosition = { x: 0, y: 0.03, z: 4 } // позиционирование модели

// ============ CODE ============ //

// create renderer
const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true, alpha: true })
renderer.setSize(width, height)
renderer.setPixelRatio(window.devicePixelRatio); // добавляем настройку пиксельного соотношения
container.appendChild( renderer.domElement ); 

// create scene and fog
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
// scene.background = new THREE.Color(0x000000, 0);

// create fake room
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.08 ).texture;

// create camera
const camera = new THREE.PerspectiveCamera( 6, width / height, 10, 100 );
camera.position.z = 15;
camera.aspect = container.clientWidth / container.clientHeight; // добавляем настройку пиксельного соотношения
camera.updateProjectionMatrix(); // обновляем матрицу проекции

// create lights || OFF
const ambientLight = new THREE.AmbientLight( ambientLightColor );
const light1 = new THREE.PointLight( pointLightColor.l1, 1, 0 );
light1.position.set( 0, 200, 0 );
const light2 = new THREE.PointLight( pointLightColor.l2, 1, 0 );
light2.position.set( 100, 200, 100 );
const light3 = new THREE.PointLight( pointLightColor.l3, 1, 0 );
light3.position.set( - 100, - 200, - 100 );

// simple light
// const light = new THREE.DirectionalLight(ambientLightColor);
// light.position.set(-1, 2, 4);
// scene.add(light);

//add lights || OFF LIGHTS
scene.add( ambientLight );
scene.add( light1 );
scene.add( light2 );
scene.add( light3 );

// load GLTF model
const loader = new GLTFLoader();
loader.load('./main/logo.gltf', gltf => {
  model = gltf.scene.children[0]; // получаем объект модели
	model.position.set(modelPosition.x, modelPosition.y, modelPosition.z); 
  model.rotation.x = THREE.MathUtils.degToRad(modelRotate.x); // наклон по оси X
  model.rotation.y = THREE.MathUtils.degToRad(modelRotate.y); // наклон по оси Y
  model.rotation.z = THREE.MathUtils.degToRad(modelRotate.z); // наклон по оси Z

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
  model.traverse(child => { // обходим все дочерние объекты модели
    if (child instanceof THREE.Mesh) { // если объект - Mesh
      child.material = material; // применяем новый материал
    }
  });
  scene.add(model); // добавляем модель в сцену
});
// ================ GUI HERE ================ //
function renderGUI () {
	const gui = new GUI();
	// --- FOLDER
	const fogFolder = gui.addFolder('fogFolder');
	fogFolder.addColor({ value: fogColor }, 'value').name('color').onChange((color) => {
		scene.fog.color.set(color);
	});
	fogFolder.add({ value: fogNear }, 'value', 0, 10).name('near').onChange((near) => {
		scene.fog.near = near;
	});
	fogFolder.add({ value: fogFar }, 'value', 10, 50).name('far').onChange((far) => {
		scene.fog.far = far;
	});
	// --- FOLDER
	const materialFolder = gui.addFolder('MeshBaseColor');
	materialFolder.addColor({ value: materialColor }, 'value').name('color').onChange((color) => {
		model.material.color.set(color);
	});
	materialFolder.addColor({ value: materialEmissive }, 'value').name('emissive').onChange((color) => {
		model.material.emissive.set(color);
	});
	// --- FOLDER
	const materialPhongFolder = gui.addFolder('MeshPhongMaterial');
	materialPhongFolder.addColor({ value: materialSpecular }, 'value').name('specular').onChange((color) => {
		model.material.specular.set(color);
	});
	materialPhongFolder.add({ value: materialShininess }, 'value', 0, 100).name('shininess').onChange((shininess) => {
		model.material.shininess = shininess;
	});
	// --- FOLDER
	const materialPhysicalFolder = gui.addFolder('MeshPhysicalMaterial');
	materialPhysicalFolder.add({ value: materialRoughness }, 'value', 0, 1).name('roughness').onChange((roughness) => {
		model.material.roughness = roughness;
	});
	materialPhysicalFolder.add({ value: materialMetalness }, 'value', 0, 1).name('metalness').onChange((metalness) => {
		model.material.metalness = metalness;
	});
	materialPhysicalFolder.add({ value: materialReflectivity }, 'value', 0, 100).name('reflectivity').onChange((reflectivity) => {
		model.material.reflectivity = reflectivity;
	});
	materialPhysicalFolder.add({ value: materialClearcoat }, 'value', 0, 100).name('clearcoat').onChange((clearcoat) => {
		model.material.clearcoat = clearcoat;
	});
	materialPhysicalFolder.add({ value: materialClearcoatRoughness }, 'value', 0, 100).name('clearcoatRoughness').onChange((clearcoatRoughness) => {
		model.material.clearcoatRoughness = clearcoatRoughness;
	});
	// --- FOLDER
	const speedFolder = gui.addFolder('speedFolder');
	speedFolder.add({ speed: lightsSpeed }, 'speed', 0, 5).name('lightsSpeed').onChange((value) => {
		lightsSpeed = value;
	});
	speedFolder.add({ speed: rotationSpeed }, 'speed', 0, 100).name('rotationSpeed').onChange((value) => {
		rotationSpeed = value;
	});
	speedFolder.add({ speed: jumpSpeed }, 'speed', 0, 100).name('jumpSpeed').onChange((value) => {
		jumpSpeed = value;
	});
	// --- FOLDER
	const modelRotateFolder = gui.addFolder('modelRotateFolder');
	modelRotateFolder.add(modelRotate, 'x', -180, 180).name('X').onChange(() => {
		model.rotation.x = THREE.MathUtils.degToRad(modelRotate.x);
	});
	modelRotateFolder.add(modelRotate, 'y', -180, 180).name('Y').onChange(() => {
		model.rotation.y = THREE.MathUtils.degToRad(modelRotate.y);
	});
	modelRotateFolder.add(modelRotate, 'z', -180, 180).name('Z').onChange(() => {
		model.rotation.z = THREE.MathUtils.degToRad(modelRotate.z);
	});
	// --- FOLDER
	const modelPositionFolder = gui.addFolder('modelPositionFolder');
	modelPositionFolder.add(modelPosition, 'x', -1, 1).name('X').onChange(() => {
		model.position.x = modelPosition.x;
	});
	modelPositionFolder.add(modelPosition, 'y', -1, 1).name('Y').onChange(() => {
		model.position.y = modelPosition.y;
	});
	modelPositionFolder.add(modelPosition, 'z', 0, 4).name('Z').onChange(() => {
		model.position.z = modelPosition.z;
	});
}
renderGUI ();
// ================ END  GUI ================ //
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
  const maxHeight = modelPosition.y + 0.02; // максимальная высота прыжка
  const minHeight = 0; // минимальная высота модели
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
  width = container.clientWidth; // обновляем ширину контейнера
  height = container.clientHeight; // обновляем высоту контейнера
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  renderer.setPixelRatio(window.devicePixelRatio); // добавляем настройку пиксельного соотношения
}, false );

animate();
render();