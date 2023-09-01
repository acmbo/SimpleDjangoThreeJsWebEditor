import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

// import { ViewCubeObject3D } from 'three-js-view-cube/dist/three-js-view-cube'


// const vc = new ViewCubeObject3D()
let model = null
const scene = new THREE.Scene()

// Set camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 10); // Set the camera position
camera.lookAt(0, 0, 0); // Point the camera at the center of the scene

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)


// Controls
const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.enabled = true;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.5;
orbitControls.screenSpacePanning = true;

// Add canvas to site
const div = document.getElementById('Canvas');
div.appendChild(renderer.domElement)



// Direct Light
const dirLight = new THREE.DirectionalLight()
dirLight.position.z = 50
scene.add(dirLight)

// Ambient Light
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)



// Create grid
const gridSize = 10; // Size of the grid
const gridDivisions = 10; // Number of divisions on the grid
const gridColorCenterLine = 0x00ff00; // Color of the center line
const gridColorGrid = 0x888888; // Color of the grid lines
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, gridColorCenterLine, gridColorGrid);

// Set initial opacity value
let gridOpacity = parseFloat(opacitySlider.value);
gridHelper.material.opacity = gridOpacity;

// Add an event listener to the slider
opacitySlider.addEventListener('input', () => {
  
  gridOpacity = parseFloat(opacitySlider.value);
  opacityValue.textContent = gridOpacity.toFixed(2);
  
  // Update the grid's opacity
  gridHelper.material.opacity = gridOpacity;

});

gridHelper.material.transparent = true;

// Add the grid to the scene
scene.add(gridHelper);



///https://github.com/bytezeroseven/GLB-Viewer/blob/master/viewer.js

/// ----------------------- Viewcube--------------------
let hasMoved = false;

let cubeCameraDistance = 1.75;

const cubeWrapper = document.getElementById('orientCubeWrapper')
const cubeScene = new THREE.Scene();
const cubeCamera = new THREE.PerspectiveCamera(70, cubeWrapper.offsetWidth / cubeWrapper.offsetHeight, 0.1, 100);
cubeCamera.position.set(2, 2, 2); // Set the camera position
cubeCamera.lookAt(0, 0, 0);         // Point the camera at the center of the scene

const cubeRenderer = new THREE.WebGLRenderer({
 alpha: true,
 antialias: true,
 preserveDrawingBuffer: true
});

cubeRenderer.setSize(cubeWrapper.offsetWidth, cubeWrapper.offsetHeight);
cubeRenderer.setPixelRatio(window.deivicePixelRatio);

cubeWrapper.appendChild(cubeRenderer.domElement);



let materials = [];
let texts = ['RIGHT', 'LEFT', 'TOP', 'BOTTOM', 'FRONT', 'BACK'];

let textureLoader = new THREE.TextureLoader();
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

let size = 64;
canvas.width = size;
canvas.height = size;

ctx.font = 'bolder 12px "Open sans", Arial';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

let mainColor = '#fff';
let otherColor = '#ccc';

let bg = ctx.createLinearGradient(0, 0, 0, size);
bg.addColorStop(0, mainColor);
bg.addColorStop(1,  otherColor);

for (let i = 0; i < 6; i++) {
  if (texts[i] == 'TOP') {
    ctx.fillStyle = mainColor;
  } else if (texts[i] == 'BOTTOM') {
    ctx.fillStyle = otherColor;
  } else {
    ctx.fillStyle = bg;
  }
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#aaa';
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, size, size);
  ctx.fillStyle = '#999';
  ctx.fillText(texts[i], size / 2, size / 2);
  materials[i] = new THREE.MeshBasicMaterial({
    map: textureLoader.load(canvas.toDataURL())
  });
}

let planes = [];

let planeMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  color: 0x00c0ff,
  transparent: true,
  opacity: 0,
  depthTest: false
});
let planeSize = 0.7;
let planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize);

let a = 0.51;

let plane1 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
plane1.position.z = a;
cubeScene.add(plane1);
planes.push(plane1);

let plane2 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
plane2.position.z = -a;
cubeScene.add(plane2);
planes.push(plane2);

let plane3 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
plane3.rotation.y = Math.PI / 2;
plane3.position.x = a;
cubeScene.add(plane3);
planes.push(plane3);

let plane4 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
plane4.rotation.y = Math.PI / 2;
plane4.position.x = -a;
cubeScene.add(plane4);
planes.push(plane4);

let plane5 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
plane5.rotation.x = Math.PI / 2;
plane5.position.y = a;
cubeScene.add(plane5);
planes.push(plane5);

let plane6 = new THREE.Mesh(planeGeometry, planeMaterial.clone());
plane6.rotation.x = Math.PI / 2;
plane6.position.y = -a;
cubeScene.add(plane6);
planes.push(plane6);

let groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa
});
let groundGeometry = new THREE.PlaneGeometry(1, 1);
let groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -0.6;

cubeScene.add(groundPlane);


let cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials);
cubeScene.add(cube);

function updateCubeCamera() {
  cubeCamera.rotation.copy(camera.rotation);
  let dir = camera.position.clone().sub(orbitControls.target).normalize();
  cubeCamera.position.copy(dir.multiplyScalar(cubeCameraDistance));
}

let activePlane = null;

cubeRenderer.domElement.onmousemove = function(evt) {

  if (activePlane) {
    activePlane.material.opacity = 0;
    activePlane.material.needsUpdate = true;
    activePlane = null;
  }

  let x = evt.offsetX;
  let y = evt.offsetY;
  let size = cubeRenderer.getSize(new THREE.Vector2());
  let mouse = new THREE.Vector2(x / size.width * 2 - 1, -y / size.height * 2 + 1);
  
  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, cubeCamera);
  let intersects = raycaster.intersectObjects(planes.concat(cube));

  if (intersects.length > 0 && intersects[0].object != cube) {
    activePlane = intersects[0].object;
    activePlane.material.opacity = 0.2;
    activePlane.material.needsUpdate = true;
  }
}

let startTime = 0;
let duration = 500;
let oldPosition = new THREE.Vector3();
let newPosition = new THREE.Vector3();
let play = false;

cubeRenderer.domElement.onclick = function(evt) {

  cubeRenderer.domElement.onmousemove(evt);

  if (!activePlane || hasMoved) {
    return false;
  }

  oldPosition.copy(camera.position);

  let distance = camera.position.clone().sub(orbitControls.target).length();
  newPosition.copy(orbitControls.target);

  if (activePlane.position.x !== 0) {
    newPosition.x += activePlane.position.x < 0 ? -distance : distance;
  } else if (activePlane.position.y !== 0) {
    newPosition.y += activePlane.position.y < 0 ? -distance : distance;
  } else if (activePlane.position.z !== 0) {
    newPosition.z += activePlane.position.z < 0 ? -distance : distance;
  }

  //play = true;
  //startTime = Date.now();
  camera.position.copy(newPosition);
}

cubeRenderer.domElement.ontouchmove = function(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.targetTouches[0].pageX - rect.left;
  let y = e.targetTouches[0].pageY - rect.top;
  cubeRenderer.domElement.onmousemove({
    offsetX: x,
    offsetY: y
  });
}

cubeRenderer.domElement.ontouchstart = function(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.targetTouches[0].pageX - rect.left;
  let y = e.targetTouches[0].pageY - rect.top;
  cubeRenderer.domElement.onclick({
    offsetX: x,
    offsetY: y
  });
}


function antiMoveOnDown(e) {
  hasMoved = false;
}
function antiMoveOnMove(e) {
  hasMoved = true;
}

window.addEventListener('mousedown', antiMoveOnDown, false);
window.addEventListener('mousemove', antiMoveOnMove, false);
window.addEventListener('touchstart', antiMoveOnDown, false);
window.addEventListener('touchmove', antiMoveOnMove, true);

/// ----------------------- END Viewcube--------------------





const transformControls = new TransformControls(camera, renderer.domElement)

transformControls.addEventListener('dragging-changed', function (event) {
    orbitControls.enabled = !event.value
})

window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'g':
            transformControls.setMode('translate')
            break
        case 'r':
            transformControls.setMode('rotate')
            break
        case 's':
            transformControls.setMode('scale')
            break
    }
})



const axh1 = new THREE.AxesHelper(1)
axh1.position.x = 1


window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


scene.add(axh1)
console.log(scene)


function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    orbitControls.update()
    updateCubeCamera();
    render()
}

function render() {
    renderer.render(scene, camera)
    cubeRenderer.render(cubeScene, cubeCamera)
}

render()
animate()
