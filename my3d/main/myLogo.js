// imports
import * as THREE from 'three';
import { RoomEnvironment } from 'RoomEnvironment';
import { GLTFLoader } from 'GLTFLoader';

// variables
let container = document.querySelector('.myLogo');
let width = container.clientWidth;
let height = container.clientHeight;

// ============ THIS IS BASED ============ //

// дымка
let fogColor = 0xff0000;
let fogNear = 5;
let fogFar = 20;

let materialColor = 0x0000ff; // цвет материала
let materialEmissive = 0x009900; // свечение материала
let materialSpecular = 0x00ff00; // цвет бликов
let materialRoughness = 0.1; // шероховатость материала
let materialMetalness = 0.5; // металличность материала
let ambientLightColor = 0xffffff; // цвет основной подсветки
let pointLightColor = 0xffffff; // цвет дополнительной подсветки
let materialShininess = 10; // уровень сияния

let rotationSpeed = 30; // скорость вращения
let model; // инициализация
let modelRotate = { x: 120, y: 1, z: 5 }; // наклон модели
let modelPosition = { x: 0, y: -0.18, z: 4 } // позиционирование модели

// ============ CODE ============ //

// create renderer
const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true, alpha: true })
renderer.setSize(width, height)
container.appendChild( renderer.domElement );

// create scene and fog
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
// scene.background = new THREE.Color(0x000000, 0);

// create fake room
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.08 ).texture;

// create camera and light
const camera = new THREE.PerspectiveCamera( 7, width / height, 10, 100 );
camera.position.z = 15;

const ambientLight = new THREE.AmbientLight( ambientLightColor );
scene.add( ambientLight );

const light1 = new THREE.PointLight( pointLightColor, 1, 0 );
light1.position.set( 0, 200, 0 );
scene.add( light1 );

const light2 = new THREE.PointLight( pointLightColor, 1, 0 );
light2.position.set( 100, 200, 100 );
scene.add( light2 );

const light3 = new THREE.PointLight( pointLightColor, 1, 0 );
light3.position.set( - 100, - 200, - 100 );
scene.add( light3 );

// Загружаем GLTF модель
const loader = new GLTFLoader();
loader.load('./main/logo.gltf', gltf => {
  model = gltf.scene.children[0]; // получаем объект модели
	model.position.set(modelPosition.x, modelPosition.y, modelPosition.z); 
  model.rotation.x = THREE.MathUtils.degToRad(modelRotate.x); // наклон по оси X
  model.rotation.y = THREE.MathUtils.degToRad(modelRotate.y); // наклон по оси Y
  model.rotation.z = THREE.MathUtils.degToRad(modelRotate.z); // наклон по оси Z

	// настройка материала для модели
  const material = new THREE.MeshPhongMaterial({
    color: materialColor,
    emissive: materialEmissive,
		specular: materialSpecular,
    roughness: materialRoughness,
    metalness: materialMetalness,
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

// create render and animation
function render() {
	requestAnimationFrame( render );
		rotationSpeed
		model.rotation.z += rotationSpeed * 0.001;
		// model.rotation.y += rotationSpeed * 0.000005;
		// model.rotation.x += rotationSpeed * 0.000005;

	renderer.render( scene, camera );
	}

	// create responsive
	window.addEventListener( 'resize', function () {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( container.clientWidth, container.clientHeight );
	}, false );

	render();