let close = "─$ [ Закрыть (X) ]";
// Обьекты
let about = document.querySelector('.about');
let works = document.querySelector('.works');
let contacts = document.querySelector('.contacts');
// Кнопки
let aboutButton = document.querySelector('.aboutButton');
let worksButton = document.querySelector('.worksButton');
let contactsButton = document.querySelector('.contactsButton');
// Переменные исходного текста из HTML
let aboutContent = document.querySelector('.aboutButton');
let aboutText = aboutContent.textContent;
let worksContent = document.querySelector('.worksButton');
let worksText = worksContent.textContent;
let contactsContent = document.querySelector('.contactsButton');
let contactsText = contactsContent.textContent;
// ABOUT
$(aboutButton).click(function() {
  $(this).toggleClass("active");
  $('hide').toggleClass("aboutHide");
  $(works).toggleClass("worksHide");
  $(contacts).toggleClass("contactsHide");
  if ( $(this).hasClass( "active" ) ) {
    $(this).text( close );
  } else {
    $(this).text( aboutText );
  }
});
// WORKS
$(worksButton).click(function() {
  $(this).toggleClass("active");
  $('hide').toggleClass("worksHide");
  $(about).toggleClass("aboutHide");
  $(contacts).toggleClass("contactsHide");
  if ( $(this).hasClass( "active" ) ) {
    $(this).text( close );
  } else {
    $(this).text( worksText );
  }
});
// CONTACTS
$(contactsButton).click(function() {
  $(this).toggleClass("active");
  $('hide').toggleClass("contactsHide");
  $(about).toggleClass("aboutHide");
  $(works).toggleClass("worksHide");
  if ( $(this).hasClass( "active" ) ) {
    $(this).text( close );
  } else {
    $(this).text( contactsText );
  }
});
// AUTOTYPING TEXT
document.addEventListener('DOMContentLoaded',function(event){
  window.onload = function() {
  var dataText = [ 
		"Современные методы верстки ", 
		"Трендовые визуальные приемы ", 
		"Максимально индивидуальный подход ", 
		"Решения на любой вкус и кошелек ",
		"Choose your fate... "
	];
  var caret = "|";
  function type(text, i, fnCallback) {
    if (i < (text.length)) {
      document.querySelector(".console").textContent = text.substring(0, i+1) + caret;
      setTimeout(function() {
        type(text, i + 1, fnCallback)
      }, 40);
    }
    else if (typeof fnCallback == 'function') {
      setTimeout(fnCallback, 1500);
    }
  }
   function StartAnimation(i) {
     if (typeof dataText[i] == 'undefined'){
        setTimeout(function() {
          StartAnimation(0);
        }, 30000);
     }
    if (i < dataText[i].length) {
      type(dataText[i], 0, function(){
      StartAnimation(i + 1);
     });
    }
  }
  StartAnimation(0);
  }
});
//RANDOM BGND
// var renderer = new THREE.WebGLRenderer({ canvas : document.getElementById('canvas'), antialias:true});

let texture = false;//Режим рендеринга
let indexScreen = 1; //Размер рендера. Процент от размера экрана
let fogColor = 0x000000; //Подсветка сзади
let bgColor  = 0x000000;//Фон
//Перспектива объекта
let cameraPerspective = 80; //Чем меньше, тем ближе
let cameraPosition = 25;//Чем меньше, тем ближе
//Освещение объекта
let shadowColor = 0x999999;//Тень
let primaryColor = 0xffffff;//Основной цвет
let intensiveColor = 1.1;//Интенсивность цвета
//Подсветка объекта
let lightSpeed = { x: 0.0005, y: 0.0008, z: 0.0005, };//Speed
let innerLightColor = 0xffffff;//Цвет
let iinerLightSize = 100;//Размер
let innerLightBright = 3;//Яркость
let innerLightDepth = 70;//Глубина
//Цвета объекта
let chromaColorOne = '#0a00ff';
let chromaColorTwo = '#ff00ff';
let chromaColorThree = '#ff0000';
let chromaColorFour = '#ffff00';
let chromaColorFive = '#FFC84F';
let chromaColorSix = '#F9F871';
//Опции объекта
let bodyBlobSize = 3.8;//Размеры хуевин
let bodyColorTransform = 3;//Экспериментально (по умолчанию 3)
let noiseSize = { x: 0.28, y: 0.23, z: 0.27, };//Размер шума по осям


const scene = new THREE.Scene();
scene.fog = new THREE.Fog(fogColor, 20, 25)
const camera = new THREE.PerspectiveCamera(cameraPerspective, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ canvas : document.getElementById('canvas'), antialias:true});
renderer.setClearColor(bgColor);
renderer.setSize(window.innerWidth * indexScreen, window.innerHeight * indexScreen);
document.body.appendChild(renderer.domElement);

camera.position.z = cameraPosition;
const controls = new THREE.OrbitControls(camera, renderer.domElement);

/* Global lightning  */
const light = new THREE.HemisphereLight(primaryColor, shadowColor, intensiveColor);
scene.add(light);

/* Moving light */
const plight = new THREE.PointLight(innerLightColor, innerLightBright, iinerLightSize);
plight.position.z = innerLightDepth;
let lGroup = new THREE.Group();
lGroup.add(plight);
scene.add(lGroup);

const colours = chroma.scale([chromaColorOne, chromaColorTwo, chromaColorThree, chromaColorFour]);

let geometry = new THREE.IcosahedronGeometry(bodyBlobSize, 40);
let material = new THREE.MeshPhongMaterial({
  wireframe: texture,
  vertexColors: true
});
let blob = new THREE.Mesh(geometry, material);
scene.add(blob);
noise.seed(Math.random() * 100);

let v = new THREE.Vector3();
const count = geometry.attributes.position.count;
let center = new THREE.Vector3(1,-1,1);
geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3) );
for (let i = 0; i < geometry.attributes.position.count * 3; i += bodyColorTransform) {
  v.x = geometry.attributes.position.array[i];
  v.y = geometry.attributes.position.array[i + 1];
  v.z = geometry.attributes.position.array[i + 2];
  let angle = center.angleTo(v) / Math.PI;
  geometry.attributes.color.array[i] = colours(angle).rgb()[0] / 255;
  geometry.attributes.color.array[i + 1] = colours(angle).rgb()[1] / 255;
  geometry.attributes.color.array[i + 2] = colours(angle).rgb()[2] / 255;
}
let origin = geometry.attributes.position.clone();
function updateGeom (seed) {
  for (let i = 0; i < geometry.attributes.position.count * 3; i += 3) {
    v.x = origin.array[i];
    v.y = origin.array[i + 1];
    v.z = origin.array[i + 2];
    let n = 2;
    n += noise.simplex3(v.x * noiseSize.x, v.y * noiseSize.y, v.z * noiseSize.z + seed);
    v.multiplyScalar(n);
    geometry.attributes.position.array[i] = v.x;
    geometry.attributes.position.array[i + 1] = v.y;
    geometry.attributes.position.array[i + 2] = v.z;
  }
  geometry.attributes.position.needsUpdate = true;
}
updateGeom(0);

function render(a) {
  requestAnimationFrame(render);
  
  updateGeom(a * 0.0001);
  lGroup.rotation.x = a * lightSpeed.x;
  lGroup.rotation.y = a * lightSpeed.y;
  lGroup.rotation.z = -a * lightSpeed.z;
  renderer.render(scene, camera);
}
requestAnimationFrame(render);

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight );
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});