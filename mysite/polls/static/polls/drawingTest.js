import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Add canvas to site
const div = document.getElementById('Canvas');
div.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);


let isDrawing = false; // Flag to track drawing mode
let isDragging = false; // Flag to track dragging mode
let points = []; // Array to store drawn points
let lines = []; // Array to store drawn lines
let pointObjects = []; // Array to store point objects

// Set camera position and orientation
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Create a line material
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// Function to create a new line from points
function createLine() {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, lineMaterial);
  scene.add(line);
  lines.push(line);
}

// Function to create a new point object
function createPoint(position) {
  const pointGeometry = new THREE.SphereGeometry(0.05, 32, 32);
  const point = new THREE.Mesh(pointGeometry, pointMaterial);
  point.position.copy(position);
  scene.add(point);
  pointObjects.push(point);
}

// Function to update the drawn line and points
function updateLine() {
  if (lines.length > 0) {
    scene.remove(lines.pop());
  }
  createLine();

  // Remove previous point objects
  pointObjects.forEach((point) => {
    scene.remove(point);
  });

  // Create new point objects for the updated points
  pointObjects = [];
  points.forEach((point) => {
    createPoint(point);
  });
}

// Toggle drawing mode when the button is clicked or 'L' key is pressed
function toggleDrawing() {
  if (!isDrawing) {
    // Start drawing a new polyline
    isDrawing = true;
    points = []; // Clear the previous points
    document.getElementById('toggleButton').textContent = 'Stop Drawing (Press Esc)';
  } else {
    // Stop drawing and finalize the current polyline
    isDrawing = false;
    createLine(); // Create a new line from the points
    points = []; // Clear the points for the next polyline
    document.getElementById('toggleButton').textContent = 'Start Drawing (Press L)';
  }
}

document.getElementById('toggleButton').addEventListener('click', toggleDrawing);

// Handle keyboard events
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isDrawing) {
    toggleDrawing();
  } else if (event.key === 'l' || event.key === 'L') {
    toggleDrawing();
  }
});

// Handle mouse down event for drawing
document.getElementById('Canvas').addEventListener('mousedown', (event) => {
  if (isDrawing) {
    const mousePosition = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();

    const canvasBounds = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    mousePosition.set(mouseX, mouseY, 0.5);
    raycaster.setFromCamera(mousePosition, camera);

    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), intersection);

    points.push(intersection.clone());
    createPoint(intersection.clone()); // Create a point object for the clicked point
    updateLine();
  }
});




let selectedLine = null; // Reference to the selected line
let offsetX = 0;
let offsetY = 0;


// Function to store the initial click position relative to the selected line
let initialClickOffset = new THREE.Vector2();

// Function to store the initial position of the selected line
let initialLinePosition = new THREE.Vector2();

// Function to handle mouse down event for selecting/dragging lines
// Function to handle mouse down event for selecting/dragging lines
function onMouseDown(event) {
  if (!isDrawing) {
    const mousePosition = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const canvasBounds = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    mousePosition.set(mouseX, mouseY);

    // Check if the click intersects with any line
    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(lines, false); // Use 'false' to ignore the bounding box

    if (intersects.length > 0) {
      // Select the line for dragging
      selectedLine = intersects[0].object;
      isDragging = true;

      // Store the initial offset from the click point to the current position
      initialClickOffset.x = intersects[0].point.x - selectedLine.position.x;
      initialClickOffset.y = intersects[0].point.y - selectedLine.position.y;

      // Store the initial position of the selected line
      initialLinePosition.x = selectedLine.position.x;
      initialLinePosition.y = selectedLine.position.y;
    } else {
      // Deselect the line when clicking outside of it
      selectedLine = null;
    }
  }
}



// Function to handle mouse move event for dragging
function onMouseMove(event) {
  if (isDragging) {
    const mousePosition = new THREE.Vector2();

    const canvasBounds = renderer.domElement.getBoundingClientRect();
    const mouseX = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    const mouseY = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

    mousePosition.set(mouseX, mouseY);

    if (selectedLine) {
      // Calculate the new position for the selected line based on the mouse position
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mousePosition, camera);
      const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1));
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(planeZ, intersection);

      // Calculate the movement from the initial click position to the new position
      const movementX = intersection.x - initialLinePosition.x;
      const movementY = intersection.y - initialLinePosition.y;

      // Update the position of the entire line and its points
      selectedLine.position.set(initialLinePosition.x + movementX - initialClickOffset.x, initialLinePosition.y + movementY - initialClickOffset.y, selectedLine.position.z);
      points.forEach((point) => {
        point.x += movementX;
        point.y += movementY;
      });

      // Update the point objects and the rest of your scene
      updateLine();
    }
  }
}



// Function to handle mouse up event for dragging
function onMouseUp() {
  isDragging = false;
  selectedLine = null;
}


document.getElementById('Canvas').addEventListener('mousedown', onMouseDown);
document.addEventListener('mousemove', onMouseMove);
document.addEventListener('mouseup', onMouseUp);


animate();
function animate() {
  requestAnimationFrame(animate)
  render()
}

function render() {
  renderer.render(scene, camera)
}

render()
animate()