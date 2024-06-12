import './style.css';
import * as THREE from 'three';

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.3); // Reduced intensity
pointLight.position.set(10, 10, 10);

const ambientLight = new THREE.AmbientLight(0x404040, 0.1); // Reduced intensity
scene.add(pointLight, ambientLight);

const stars = []; // Array to store stars for animation

// Function to add stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: Math.random() < 0.5 ? 0xff0000 : 0x00ff00 }); // Randomly choose red or green
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
  stars.push(star); // Add star to array for animation
}

Array(21).fill().forEach(addStar); // Add 200 stars


// Background
const spaceTexture = new THREE.TextureLoader().load('assets/wall_3.jpg');
scene.background = spaceTexture;

// Avatar
const vedantTexture = new THREE.TextureLoader().load('assets/vedant.jpg');

const vedant = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: vedantTexture }));

scene.add(vedant);

vedant.position.z = -5;
vedant.position.x = 2;

// GitHub Cube
const githubTexture = new THREE.TextureLoader().load('assets/github.png');
const githubCube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: githubTexture }));
githubCube.position.set(10, 5, -10);
githubCube.userData = { URL: 'https://github.com/roboticvedant/' }; 
scene.add(githubCube);

// LinkedIn Cube
const linkedInTexture = new THREE.TextureLoader().load('assets/linkedin.png');
const linkedInCube = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshBasicMaterial({ map: linkedInTexture }));
linkedInCube.position.set(-7, 0, -5);
linkedInCube.userData = { URL: 'https://www.linkedin.com/in/vedantknaik' }; 
scene.add(linkedInCube);

// Skill Logos orbiting the GitHub Cube
const skillLogos = [
  { src: 'assets/c.png' },
  { src: 'assets/cpp.png' },
  { src: 'assets/python.png' },
  { src: 'assets/arduino.png' },
  { src: 'assets/matlab.png' },
  { src: 'assets/ros2.png' },
  { src: 'assets/tensorflow.png' }
];

const skillLogoMeshes = skillLogos.map((logo, index) => {
  const texture = new THREE.TextureLoader().load(logo.src);
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);

  const angle = (index / skillLogos.length) * Math.PI * 2;
  mesh.position.set(
    Math.cos(angle) * 10 + githubCube.position.x,
    Math.sin(angle) * 10 + githubCube.position.y,
    githubCube.position.z
  );

  scene.add(mesh);
  return mesh;
});

// Education and Experience Logos
const educationLogos = [{ src: 'assets/msu.png' }];
const experienceLogos = [
  { src: 'assets/sml.png', url: 'https://smlab.msu.edu/' },
  { src: 'assets/solar_car.png', url: 'https://www.msusolar.com/' },
  { src: 'assets/frib.jpg', url: 'https://frib.msu.edu/' }
];

const educationLogoMeshes = educationLogos.map((logo, index) => {
  const texture = new THREE.TextureLoader().load(logo.src);
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(-5, 5, -10);

  scene.add(mesh);
  return mesh;
});

const experienceLogoMeshes = experienceLogos.map((logo, index) => {
  const texture = new THREE.TextureLoader().load(logo.src);
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { URL: logo.url };
  scene.add(mesh);
  return mesh;
});

// Function to update skill logo positions
function updateSkillLogoPositions(offsetX, offsetY) {
  skillLogoMeshes.forEach((mesh, index) => {
    const angle = (index / skillLogos.length) * Math.PI * 2 + performance.now() * 0.0005;
    mesh.position.set(
      Math.cos(angle) * 10 + offsetX,
      Math.sin(angle) * 10 + offsetY,
      githubCube.position.z
    );
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  });
}

// Function to update experience logo positions
function updateExperienceLogoPositions() {
  const ellipseRadiusX = 15;
  const ellipseRadiusY = 10;
  const experienceTextX = 10;  // Adjust this as needed
  experienceLogoMeshes.forEach((mesh, index) => {
    const angle = (index / experienceLogos.length) * Math.PI * 2 + performance.now() * 0.0003;
    const x = Math.cos(angle) * ellipseRadiusX + experienceTextX;
    const y = Math.sin(angle) * ellipseRadiusY;
    mesh.position.set(x, y, -10);
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    // Scale the logo when it's near the left side of the text
    if (x < experienceTextX - 5) {
      const scale = 1.5 - ((Math.abs(x - (experienceTextX - 5)) / 10));
      mesh.scale.set(scale, scale, scale);
      mesh.material.opacity = Math.min(1, scale);
    } else {
      mesh.scale.set(1, 1, 1);
      mesh.material.opacity = 1;
    }
  });
}

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  vedant.rotation.y += 0.01;
  vedant.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

   // Ensure avatar stays upright
   vedant.rotation.y = camera.rotation.y;
   vedant.rotation.z = 0;
   
  const sections = document.querySelectorAll('section');
  let currentSection = 'about';
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      currentSection = section.dataset.section;
    }
  });

  // Hide all elements when near the Vedant cube
  if (Math.abs(t) < 200) {
    githubCube.position.set(1000, 1000, 1000);
    linkedInCube.position.set(1000, 1000, 1000);
    skillLogoMeshes.forEach(mesh => mesh.position.set(1000, 1000, 1000));
    educationLogoMeshes.forEach(mesh => mesh.position.set(1000, 1000, 1000));
    experienceLogoMeshes.forEach(mesh => mesh.position.set(1000, 1000, 1000));
  } else {
    if (currentSection === 'skills') {
      githubCube.position.set(10, 5, -10); // On the right side near skills section
      updateSkillLogoPositions(10, 5);
      skillLogoMeshes.forEach(mesh => {
        mesh.material.opacity = Math.min(1, mesh.material.opacity + 0.02);
        mesh.material.transparent = true;
      });
    } else {
      githubCube.position.set(-10, 5, -10); // Move to the left side away from the Vedant cube
      updateSkillLogoPositions(-10, 5);
      skillLogoMeshes.forEach(mesh => {
        mesh.material.opacity = Math.max(0, mesh.material.opacity - 0.02);
        mesh.material.transparent = true;
      });
    }

    // Scale and fade education logo based on scroll position
    educationLogoMeshes.forEach(mesh => {
      const scale = Math.max(1, 2 - Math.abs(t / 500));
      mesh.scale.set(scale, scale, scale);
      if (currentSection !== 'education') {
        mesh.material.opacity = Math.max(0, mesh.material.opacity - 0.02);
        mesh.material.transparent = true;
      } else {
        mesh.material.opacity = 1;
        mesh.material.transparent = false;
        mesh.position.set(-5, 5, -10);
      }
    });

    // Position LinkedIn cube beside "About Me" section
    linkedInCube.position.set(-7, 0, -5);
  }
}

document.body.onscroll = moveCamera;
moveCamera();
// Animation Loop
let lastBlinkTime = Date.now();
const blinkPeriod = 150; // 250ms period
// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  stars.forEach(star => {
    const blinkSpeed = Math.random() *200 + 25; // Random blink speed for each star
    const currentTime = Date.now();
    if (currentTime - lastBlinkTime >= blinkPeriod+blinkSpeed) { // Check if 250ms have passed
    stars.forEach(star => {
      star.visible = !star.visible; // Toggle visibility
    });
    lastBlinkTime = currentTime; // Reset the last blink time
  }
  });

  githubCube.rotation.x += 0.01;
  githubCube.rotation.y += 0.01;

  linkedInCube.rotation.x += 0.005;
  linkedInCube.rotation.y += 0.005;

  updateSkillLogoPositions(githubCube.position.x, githubCube.position.y);
  updateExperienceLogoPositions();

  renderer.render(scene, camera);
}

animate();
// Event listener to open GitHub and LinkedIn profiles on click
window.addEventListener('pointerdown', (event) => {
  console.log('Pointerdown event detected'); // Debugging: check if event listener is working

  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );

  console.log(`Mouse coordinates: ${mouse.x}, ${mouse.y}`); // Debugging: log mouse position

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects([githubCube, linkedInCube, ...experienceLogoMeshes], true);
  if (intersects.length > 0) {
    const url = intersects[0].object.userData.URL;
    console.log(`Clicked on: ${url}`); // Debugging: log the URL
    if (url) {
      window.open(url, '_blank');
    }
  } else {
    console.log('No intersection detected'); // Debugging: log if no intersection
  }
});