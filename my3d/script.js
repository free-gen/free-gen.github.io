// imports
import * as THREE from 'three';
import { RoomEnvironment } from 'RoomEnvironment';

// variables
let container = document.querySelector('.container');
let width = container.clientWidth;
let height = container.clientHeight;
let lightColor = 0x666666;
let rotationSpeed = 10;
// for MeshPhysicalMaterial
let materialColor = 0xaa00ff;
let materialEmissive = 0x111111;
let materialRougness = 0.2;//0 - 1;
let materialMetalness = 1;//0 - 1
// end //

// create renderer
const renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true, antialias: true, alpha: true })
renderer.setSize(width, height)
container.appendChild( renderer.domElement );

// create scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x000000, 0);

// create fake room
const pmremGenerator = new THREE.PMREMGenerator( renderer );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

// create camera and light
const camera = new THREE.PerspectiveCamera( 70, width / height, 10, 100 );
camera.position.z = 25;

const ambientLight = new THREE.AmbientLight( 0x000000 );
scene.add( ambientLight );

const light1 = new THREE.PointLight( 0xffffff, 1, 0 );
light1.position.set( 0, 200, 0 );
scene.add( light1 );

const light2 = new THREE.PointLight( 0xffffff, 1, 0 );
light2.position.set( 100, 200, 100 );
scene.add( light2 );

const light3 = new THREE.PointLight( 0xffffff, 1, 0 );
light3.position.set( - 100, - 200, - 100 );
scene.add( light3 );

// =========== CREATE GEOMETRY =========== //
const geometry = new THREE.TorusGeometry( 10, 3, 64, 100 );
const material = new THREE.MeshPhysicalMaterial({
	color: materialColor,
	emissive: materialEmissive,
	roughness: materialRougness,
	metalness: materialMetalness
});
const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

// create render and animation
function render() {
	requestAnimationFrame( render );
		//rotationSpeed
		mesh.rotation.x += rotationSpeed * 0.001;
		mesh.rotation.y += rotationSpeed * 0.001;
		mesh.rotation.z += rotationSpeed * 0.001;
	renderer.render( scene, camera );
	}

	// create responsive
	window.addEventListener( 'resize', function () {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( container.clientWidth, container.clientHeight );
	}, false );

	render();