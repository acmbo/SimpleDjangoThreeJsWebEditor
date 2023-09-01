console.log("Hello World!")


import * as THREE from 'three';
// Set up the scene, camera, and renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the axes
var axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Set the camera position
camera.position.z = 10;

// Create a cube to represent a point
var cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

THREE.Object3D.DefaultUp = new THREE.Vector3(0,0,1);

var grid = new THREE.GridHelper( 30, 30, 0x444444, 0x888888 );
grid.rotateX(Math.PI / 2); 
scene.add(grid);


var isMouseDown = false;
var prevMouseX = 0;
var prevMouseY = 0;
var isShiftPressed = false; // Track if the shift key is pressed

// Event listener for keydown to track shift key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Shift') {
        isShiftPressed = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'Shift') {
        isShiftPressed = false;
    }
});

// Event listeners for mouse interactions
renderer.domElement.addEventListener('mousedown', function (event) {
    isMouseDown = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

renderer.domElement.addEventListener('mousemove', function (event) {
    if (!isMouseDown) return;

    var deltaX = event.clientX - prevMouseX;
    var deltaY = event.clientY - prevMouseY;

    if (isShiftPressed) {
        // Rotate only around Z-axis
        camera.rotation.z -= (deltaX + deltaY) * 0.01;
    } else {
        // Rotate around X and Y axes
        camera.rotation.y += deltaX * 0.01;
        camera.rotation.x += deltaY * 0.01;
    }

    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

renderer.domElement.addEventListener('mouseup', function () {
    isMouseDown = false;
});


// Set up the animation loop
var animate = function () {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};




animate();
