const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
let speed = 0.150;
let targetSpeed = speed;
let sliderValue = targetSpeed / 4; 
speedSlider.value = sliderValue;
let smoothedTargetSpeed = speed;
speedSlider.addEventListener("input", () => {
targetSpeed = parseFloat(speedSlider.value);

// Map the target speed slider value to a range of 0 to 4
targetSpeed = targetSpeed * 4;
// Update the speed variable
speed = targetSpeed;

// Apply exponential scaling when near 0, linear scaling otherwise
if (Math.abs(targetSpeed) < 0.01) {
if (targetSpeed > 0) {
targetSpeed = Math.pow(targetSpeed, 1);
} else if (targetSpeed < 0) {
targetSpeed = -Math.pow(-targetSpeed, 1);} }

// Quantize to increments of 0.001 with the correct factor
targetSpeed = Math.round(targetSpeed * 1000) / 1000;  

speedValue.textContent = "Speed: " + targetSpeed.toFixed(3); });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
canvas: document.getElementById("myCanvas"),});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth
const earthGeometry = new THREE.SphereGeometry(.35, 256, 256);
const earthTexture = new THREE.TextureLoader().load('https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Earth_day.jpg?v=1732332336593');
const cloudsTexture = new THREE.TextureLoader().load('https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Earth_clouds.jpg?v=1732480983545');
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });

// Create a separate material for the clouds
const cloudsMaterial = new THREE.MeshBasicMaterial({ 
map: cloudsTexture, 
transparent: true, 
opacity: 0.37 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

// Create a parent object for the Earth
const earthParent = new THREE.Object3D();
earthParent.add(earth);

// Rotate the Earth mesh to align the South Pole
earth.rotation.y = -Math.PI / 4; // Adjust as needed

// Tilt the parent object 
earthParent.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthParent);

// Earth's axis
const axisGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2.5, 32); // Adjust size as needed
const axisMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const earthAxis = new THREE.Mesh(axisGeometry, axisMaterial);

// Tilt the axis to match the Earth's tilt (23.4 degrees)
earthAxis.rotation.z = -23.4 * Math.PI / 180; 
scene.add(earthAxis);

// Create a sphere for the clouds slightly larger than the Earth
const cloudsGeometry = new THREE.SphereGeometry(0.351, 256, 256); // Slightly larger radius
const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
scene.add(clouds);

// Sun
const sunGeometry = new THREE.SphereGeometry(1, 256, 256);
const sunTexture = new THREE.TextureLoader().load('https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Sun.jpg?v=1732383164392');
const sunMaterial = new THREE.MeshBasicMaterial({map: sunTexture});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(7, 0, 0); // Initial position relative to its orbit object

// Create Sun's orbit object 
const sunOrbit = new THREE.Object3D();
earthParent.add(sunOrbit);  // Sun's orbit is a child of the Earth
sunOrbit.add(sun);       // Sun is a child of its orbit object

// Tilt the Sun's orbit by 23.4° relative to the Earth's equator
const sunOrbitTiltAxis = new THREE.Vector3(1, 0, 0); // Tilt around the x-axis
const sunOrbitTiltAngle = (23.4 * Math.PI) / 180;
sunOrbit.rotation.x = sunOrbitTiltAngle; 

// Moon
const moonGeometry = new THREE.SphereGeometry(0.1, 256, 256);
const moonTexture = new THREE.TextureLoader().load('https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Moon.jpg?v=1732383168745');
const moonMaterial = new THREE.MeshBasicMaterial({map: moonTexture});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.rotation.y = Math.PI; // Tidally locked to Earth
moon.position.set(1.5, 0, 0); // Initial position relative to its orbit object

// Create Moon's orbit object
const moonOrbit = new THREE.Object3D();
earthParent.add(moonOrbit); // Moon's orbit is a child of the Earth
moonOrbit.add(moon);      // Moon is a child of its orbit object

// Tilt the Moon's orbit by 5.145° relative to the ecliptic
const moonOrbitTiltAxis = new THREE.Vector3(1, 0, 0); // Tilt around the x-axis
const moonOrbitTiltAngle = (5.145 * Math.PI) / 180;
moonOrbit.rotation.x = moonOrbitTiltAngle; 

// Firmament
const firmamentGeometry = new THREE.SphereGeometry(300, 256, 256);
const firmamentTexture = new THREE.TextureLoader().load('https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Stars_Milky_Way.jpg?v=1732407625179');
firmamentTexture.magFilter = THREE.LinearFilter;
firmamentTexture.minFilter = THREE.LinearMipMapLinearFilter;
firmamentTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
firmamentTexture.rotation = 0
const firmamentMaterial = new THREE.MeshBasicMaterial({
map: firmamentTexture,
side: THREE.BackSide, });
const firmament = new THREE.Mesh(firmamentGeometry, firmamentMaterial);
scene.add(firmament);
firmament.add(sun);
firmament.add(moon);

// Create the Planets
// Mercury
const mercuryOrbit = new THREE.Object3D();
sun.add(mercuryOrbit);
const mercury = createPlanet(0.2, 0xffa500, 9.66, 0, 0, 'https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Mercury.jpg?v=1732383254351', 0.03); 
mercuryOrbit.add(mercury);
mercuryOrbit.rotation.z = 7 * Math.PI / 180; // Mercury's inclination

// Venus
const venusOrbit = new THREE.Object3D();
sun.add(venusOrbit);
const venus = createPlanet(0.27, 0xffffff, 11.96, 0, 0, 'https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Venus.jpg?v=1732383263119', 177.36); 
venusOrbit.add(venus);
venusOrbit.rotation.z = 3.39 * Math.PI / 180; // Venus's inclination

// Mars
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit);
const mars = createPlanet(0.22, 0xff0000, 17.68, 0, 0, 'https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Mars.jpg?v=1732383850736', 25.19);
marsOrbit.add(mars);
marsOrbit.rotation.z = 1.85 * Math.PI / 180; // Mars's inclination

// Jupiter
const jupiterOrbit = new THREE.Object3D();
sun.add(jupiterOrbit);
const jupiter = createPlanet(0.7, 0xb87333, 43.64, 0, 0, 'https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Jupiter.jpg?v=1732383999248', 3.13);
jupiterOrbit.add(jupiter);
jupiterOrbit.rotation.z = 1.31 * Math.PI / 180; // Jupiter's inclination

// Saturn
const saturnOrbit = new THREE.Object3D();
sun.add(saturnOrbit);
const saturn = createPlanet(0.65, 0xf0e68c, 73.42, 0, 0, 'https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Saturn.jpg?v=1732383186699', 26.73);
saturnOrbit.add(saturn);
saturnOrbit.rotation.z = 2.49 * Math.PI / 180; // Saturn's inclination

const planetData = [
  {
    name: 'Mercury',
    mesh: mercury,
    orbit: mercuryOrbit,
    rotationPeriod: 58.6,
    orbitalPeriod: 88,
    equantOffset: 0.038,
    deferentRadius: 2.85,    
    epicycleRadius: 0.2,   
    initialEpicycleAngle: 104.94 * Math.PI / 180, 
    initialPlanetAngle: 232.92 * Math.PI / 180,
    orbitalInclination: 7.0 * Math.PI / 180,
    eccentricity: 0.2056,          
    deferentInclination: 7.01, 
    latitudeOfEpicycle: 0.5,
    secondEpicycleRadius: 0.15,  // Radius of the second epicycle (adjust as needed)
    initialSecondEpicycleAngle: 0, // Initial angle on the second epicycle     
  },
  {
    name: 'Venus',
    mesh: venus,
    orbit: venusOrbit,
    rotationPeriod: -243,
    orbitalPeriod: 225,
    equantOffset: 0.007,  
    deferentRadius: 4.85,    
    epicycleRadius: 1, 
    initialEpicycleAngle: 68.96 * Math.PI / 180,  
    initialPlanetAngle: 156.91 * Math.PI / 180,  
    orbitalInclination: 3.4 * Math.PI / 180,
    eccentricity: 0.004,         
    deferentInclination: 3.39,
    latitudeOfEpicycle: 0.5,
    secondEpicycleRadius: 0.25,    // Radius of the second epicycle (adjust as needed)
    initialSecondEpicycleAngle: 0  // Initial angle on the second epicycle
  },
  {
    name: 'Mars',
    mesh: mars,
    orbit: marsOrbit,
    rotationPeriod: 1.03,
    orbitalPeriod: 687,
    equantOffset: 0.104,
    deferentRadius: 12.5, // was 15.2   
    epicycleRadius: 4.0,    
    initialEpicycleAngle: 331.82 * Math.PI / 180, 
    initialPlanetAngle: 285.41 * Math.PI / 180,  
    orbitalInclination: 1.8 * Math.PI / 180,
    eccentricity: 0.0934,          
    deferentInclination: 1.85,
    latitudeOfEpicycle: 0.5,      
  },
  {
    name: 'Jupiter',
    mesh: jupiter,
    orbit: jupiterOrbit,
    rotationPeriod: 0.41,
    orbitalPeriod: 4333,
    equantOffset: 0.052,
    deferentRadius: 52.0,    
    epicycleRadius: 9.984,   
    initialEpicycleAngle: 162.13 * Math.PI / 180,  
    initialPlanetAngle: 344.23 * Math.PI / 180,  
    orbitalInclination: 1.3 * Math.PI / 180,
    eccentricity: 0.0489,          
    deferentInclination: 1.31,
    latitudeOfEpicycle: 1.0,      
  },
  {
    name: 'Saturn',
    mesh: saturn,
    orbit: saturnOrbit,
    rotationPeriod: 0.44,
    orbitalPeriod: 10759,
    equantOffset: 0.056,
    deferentRadius: 95.0,    
    epicycleRadius: 21.375, 
    initialEpicycleAngle: 131.22 * Math.PI / 180, 
    initialPlanetAngle: 282.39 * Math.PI / 180,
    orbitalInclination: 2.5 * Math.PI / 180,
    eccentricity: 0.0565,          
    deferentInclination: 2.49,
    latitudeOfEpicycle: 1.0,     
  } ];

const saturnRingGeometry = new THREE.RingGeometry(.8, 1.3, 256); // Adjust inner and outer radius as needed
const saturnRingTexture = new THREE.TextureLoader().load('https://cdn.glitch.global/7a868a8c-2319-413f-a624-39dceacba017/Saturn_Ring.jpg?v=1732383237086');
saturnRingTexture.magFilter = THREE.LinearFilter;
saturnRingTexture.minFilter = THREE.LinearMipMapLinearFilter;
saturnRingTexture.offset.x = 0.055;
saturnRingTexture.offset.y = 0.04;
const saturnRingMaterial = new THREE.MeshBasicMaterial({
map: saturnRingTexture, 
side: THREE.DoubleSide, 
transparent: true,      
opacity: 0.7,
alphaTest: 0.2,
depthWrite: false });
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.z = Math.PI / 32;
saturnRing.rotation.x = Math.PI / 2; // Rotate the ring to be perpendicular to the y-axis
saturnRing.rotation.y = Math.PI / 1;
saturn.add(saturnRing); // Add the ring to Saturn

// Sun orbit visualization
const orbitGeometry = new THREE.TorusGeometry(7, 0.01, 16, 100);
const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const sunOrbitVisual = new THREE.Mesh(orbitGeometry, orbitMaterial);
sunOrbitVisual.rotation.x = Math.PI / 2;  
sunOrbitVisual.visible = true;
scene.add(sunOrbitVisual);

// Orbital plane for raycasting
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
color: 0xffffff,
transparent: true,
opacity: 0.0,
side: THREE.DoubleSide, });
const orbitalPlane = new THREE.Mesh(planeGeometry, planeMaterial);
orbitalPlane.rotation.x = Math.PI / 2;
scene.add(orbitalPlane);

// Raycasting setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let orbitVisible = true; // Initialize orbitVisible to true

// Create a DOM element for the tooltip (make sure this is present)
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.display = 'none';
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '5px';
tooltip.textContent = 'Ecliptic';
document.body.appendChild(tooltip);

// Create a DOM element for the Earth tooltip
const earthTooltip = document.createElement('div');
earthTooltip.style.position = 'absolute';
earthTooltip.style.display = 'none';
earthTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
earthTooltip.style.color = 'white';
earthTooltip.style.padding = '5px';
earthTooltip.style.borderRadius = '5px';
earthTooltip.textContent = 'Earth';
document.body.appendChild(earthTooltip);

// Create a DOM element for the Moon tooltip
const moonTooltip = document.createElement('div');
moonTooltip.style.position = 'absolute';
moonTooltip.style.display = 'none';
moonTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
moonTooltip.style.color = 'white';
moonTooltip.style.padding = '5px';
moonTooltip.style.borderRadius = '5px';
moonTooltip.textContent = 'Moon';
document.body.appendChild(moonTooltip);

// Create a DOM element for the Sun tooltip
const sunTooltip = document.createElement('div');
sunTooltip.style.position = 'absolute';
sunTooltip.style.display = 'none';
sunTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
sunTooltip.style.color = 'white';
sunTooltip.style.padding = '5px';
sunTooltip.style.borderRadius = '5px';
sunTooltip.textContent = 'Sun';
document.body.appendChild(sunTooltip);

// Create DOM elements for the planet tooltips
const mercuryTooltip = document.createElement('div');
mercuryTooltip.style.position = 'absolute';
mercuryTooltip.style.display = 'none';
mercuryTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
mercuryTooltip.style.color = 'white';
mercuryTooltip.style.padding = '5px';
mercuryTooltip.style.borderRadius = '5px';
mercuryTooltip.textContent = 'Mercury';
document.body.appendChild(mercuryTooltip);

const venusTooltip = document.createElement('div');
venusTooltip.style.position = 'absolute';
venusTooltip.style.display = 'none';
venusTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
venusTooltip.style.color = 'white';
venusTooltip.style.padding = '5px';
venusTooltip.style.borderRadius = '5px';
venusTooltip.textContent = 'Venus';
document.body.appendChild(venusTooltip);

const marsTooltip = document.createElement('div');
marsTooltip.style.position = 'absolute';
marsTooltip.style.display = 'none';
marsTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
marsTooltip.style.color = 'white';
marsTooltip.style.padding = '5px';
marsTooltip.style.borderRadius = '5px';
marsTooltip.textContent = 'Mars';
document.body.appendChild(marsTooltip);

const jupiterTooltip = document.createElement('div');
jupiterTooltip.style.position = 'absolute';
jupiterTooltip.style.display = 'none';
jupiterTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
jupiterTooltip.style.color = 'white';
jupiterTooltip.style.padding = '5px';
jupiterTooltip.style.borderRadius = '5px';
jupiterTooltip.textContent = 'Jupiter';
document.body.appendChild(jupiterTooltip);

const saturnTooltip = document.createElement('div');
saturnTooltip.style.position = 'absolute';
saturnTooltip.style.display = 'none';
saturnTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
saturnTooltip.style.color = 'white';
saturnTooltip.style.padding = '5px';
saturnTooltip.style.borderRadius = '5px';
saturnTooltip.textContent = 'Saturn';
document.body.appendChild(saturnTooltip);

function onMouseMove(event) {

  // Calculate mouse position for hover effect
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);   

  // Check for intersections with ALL objects
  const intersects = raycaster.intersectObjects([sunOrbitVisual, orbitalPlane, earth, moon, sun, mercury, venus, mars, jupiter, saturn]);

  if (intersects.length > 0) {
    if (intersects[0].object === orbitalPlane) {
      // Show the "Ecliptic" tooltip
      tooltip.style.display = 'block';
      tooltip.style.left = (event.clientX + 10) + 'px';
      tooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === earth) {
      // Show the "Earth" tooltip
      earthTooltip.style.display = 'block';
      earthTooltip.style.left = (event.clientX + 10) + 'px';
      earthTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === moon) {
      // Show the "Moon" tooltip
      moonTooltip.style.display = 'block';
      moonTooltip.style.left = (event.clientX + 10) + 'px';
      moonTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === sun) {
      // Show the "Sun" tooltip
      sunTooltip.style.display = 'block';
      sunTooltip.style.left = (event.clientX + 10) + 'px';
      sunTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === mercury) {
      // Show the "Mercury" tooltip
      mercuryTooltip.style.display = 'block';
      mercuryTooltip.style.left = (event.clientX + 10) + 'px';
      mercuryTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === venus) {
      // Show the "Venus" tooltip
      venusTooltip.style.display = 'block';
      venusTooltip.style.left = (event.clientX + 10) + 'px';
      venusTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === mars) {
      // Show the "Mars" tooltip
      marsTooltip.style.display = 'block';
      marsTooltip.style.left = (event.clientX + 10) + 'px';
      marsTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === jupiter) {
      // Show the "Jupiter" tooltip
      jupiterTooltip.style.display = 'block';
      jupiterTooltip.style.left = (event.clientX + 10) + 'px';
      jupiterTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      saturnTooltip.style.display = 'none';

    } else if (intersects[0].object === saturn) {
      // Show the "Saturn" tooltip
      saturnTooltip.style.display = 'block';
      saturnTooltip.style.left = (event.clientX + 10) + 'px';
      saturnTooltip.style.top = (event.clientY - 30) + 'px';

      // Hide the other tooltips
      tooltip.style.display = 'none';
      earthTooltip.style.display = 'none';
      moonTooltip.style.display = 'none';
      sunTooltip.style.display = 'none';
      mercuryTooltip.style.display = 'none';
      venusTooltip.style.display = 'none';
      marsTooltip.style.display = 'none';
      jupiterTooltip.style.display = 'none';
    }
    
  } else {
    // Hide all tooltips when NO intersections are found
    tooltip.style.display = 'none';
    earthTooltip.style.display = 'none';
    moonTooltip.style.display = 'none';
    sunTooltip.style.display = 'none';
    mercuryTooltip.style.display = 'none';
    venusTooltip.style.display = 'none';
    marsTooltip.style.display = 'none';
    jupiterTooltip.style.display = 'none';
    saturnTooltip.style.display = 'none';
  }

  if (intersects.length > 0 && intersects[0].object === orbitalPlane) {
    // Show the "Ecliptic" tooltip ONLY if the first intersection is with the orbitalPlane
    tooltip.style.display = 'block';
    tooltip.style.left = (event.clientX + 10) + 'px';
    tooltip.style.top = (event.clientY - 30) + 'px';
  } else {

    // Hide the "Ecliptic" tooltip
    tooltip.style.display = 'none';

    // Hide the sunOrbitVisual only if not toggled on
    if (!orbitVisible) {
      sunOrbitVisual.visible = false; }}}

function onMouseDown(event) {
  event.preventDefault();

  // Calculate mouse position for click toggle
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects([orbitalPlane]);
  if (intersects.length > 0) {
  orbitVisible = !orbitVisible; // Toggle visibility on click
  sunOrbitVisual.visible = orbitVisible; }}

renderer.domElement.addEventListener("pointermove", onMouseMove, false);
renderer.domElement.addEventListener("pointerdown", onMouseDown, false);
1;

camera.position.z = 50;

let orbitAngle = 0;
let lastOrbitAngleUpdate = 0;
let machianAngle = 0;
let lastMachianAngleUpdate = 0;
let machianInfluence = 0.02;
let previousSpeed = 0;
let yearAngle = 0;
let dayOfYear = 80; // Initialize to the spring equinox
let animationPaused = false; 

function animate() {
  requestAnimationFrame(animate); 

  if (!animationPaused) {
  
  function smoothValue(currentValue, targetValue, smoothingFactor = 0.1) {
  const change = targetValue - currentValue;
  return currentValue + change * smoothingFactor; }

  const timeScale = 102000; // Time scale for the Sun's orbit
  const epicycleTimeScale = 1020000; // Time scale for epicycle motion
  
  // Smoothly transition the speed towards the target speed
  const speedChange = targetSpeed - speed;
  speed += speedChange * 0.1; // Adjust the smoothing factor (0.1) as needed

  // Smooth the targetSpeed before applying it to the animation
  const targetSpeedChange = targetSpeed - smoothedTargetSpeed;
  smoothedTargetSpeed += targetSpeedChange * 0.1; // Adjust the smoothing factor (0.1) as needed

  if (Math.abs(speed) > 0.001) {
  if (speed !== 0) {

  // Calculate time since last orbitAngle update
  const now = Date.now();
  const deltaTime = now - lastOrbitAngleUpdate;

  // Update orbitAngle only if enough time has passed
  if (deltaTime > 100) { // Adjust the threshold as needed
  let orbitAngleDelta = (Date.now() / (1000 * 60 * 60 * 24 * 365.25) * timeScale) * Math.PI * 2 - orbitAngle;
  orbitAngle += orbitAngleDelta;
  lastOrbitAngleUpdate = now; }
    
  // Update dayOfYear, adjust the increment for noticeable oscillation
  dayOfYear = (dayOfYear + (speed / 1440)) % 365; // Adjust the divisor (360)

  // Calculate yearAngle based on dayOfYear, offset to start at equinox
  yearAngle = ((dayOfYear - 80) / 365) * 2 * Math.PI;

  // Smooth transition for Sun's position
  const targetOrbitAngle = (Date.now() / (1000 * 60 * 60 * 24 * 365.25) * timeScale) * Math.PI * 2;
  const orbitAngleChange = targetOrbitAngle - orbitAngle;
  orbitAngle += orbitAngleChange * 0.1; // Apply a portion of the difference

  // Calculate the Sun's offset from the Earth
  const sunX = 7 * Math.cos(orbitAngle); 
  const sunZ = 7 * Math.sin(orbitAngle);
    
  // Calculate yearly angle with adjustment for seasonal variation
  const daysPerSeason = 91.25 + (Math.floor(Math.random() * 4) - 2); // Range: 89 to 93 days 
  yearAngle += (speed / 365.25) * (Math.PI / daysPerSeason); 

  // Calculate oscillation amplitude based on yearAngle
  const amplitudeProgress = Math.sin(yearAngle * 2.5); 
  const oscillationAmplitude = 1 * amplitudeProgress;

  // Calculate oscillation offset (using only the dynamic amplitude)
  const oscillationOffset = oscillationAmplitude;

  // Set the Sun's position relative to its orbit object (which is orbiting the Earth)
  sun.position.set(sunX, oscillationOffset, sunZ); 
    
  // Calculate Moon's position relative to the Earth's orbit object
  const moonOrbitAngle = (Date.now() / (1000 * 60 * 60 * 24 * 27.3)) * Math.PI * 2; 
  const moonX = 1.5 * Math.cos(moonOrbitAngle);  
  const moonZ = 1.5 * Math.sin(moonOrbitAngle);
  moon.position.set(moonX, 0, moonZ);

        planetData.forEach(planet => {
            // Calculate planet's rotation speed
            const rotationSpeed = speed * (2 * Math.PI / (planet.rotationPeriod * 24 * 60 * 60));

            // Apply rotation to the planet mesh
            planet.mesh.rotation.y += rotationSpeed;

            if (planet.name === "Mercury" || planet.name === "Venus") {
            // Calculate angles for Mercury and Venus (including second epicycle)

            // Adjust epicycleTimeScale for Mercury
            let planetEpicycleTimeScale = epicycleTimeScale;
            if (planet.name === "Mercury") {
              planetEpicycleTimeScale *= .88; } // Make Mercury's epicycle faster

            const epicycleAngle = (Date.now() / (1000 * 60 * 60 * 24 * planet.orbitalPeriod) * planetEpicycleTimeScale) * Math.PI * 2 + planet.initialPlanetAngle;
            
            // Introduce a difference in speed for the second epicycle
            let secondEpicycleTimeScale = 0.125; 
            if (planet.name === "Mercury") {
              secondEpicycleTimeScale *= .88; } // Make Mercury's second epicycle faster

            const secondEpicycleAngle = (Date.now() / (1000 * 60 * 60 * 24 * planet.orbitalPeriod * secondEpicycleTimeScale)) * Math.PI * 2 + planet.initialSecondEpicycleAngle; 
            let deferentAngle = (Date.now() / (1000 * 60 * 60 * 24 * 365.25)) * Math.PI * 2 + planet.initialEpicycleAngle;

            // --- Eccentric Calculation ---

            const deferentCenterDistance = planet.deferentRadius * (1 + planet.eccentricity);

            const deferentCenterX = deferentCenterDistance * Math.cos(deferentAngle);
            const deferentCenterZ = deferentCenterDistance * Math.sin(deferentAngle);

            // --- Accurate Equant Calculation (updated for eccentrics) ---

            const earthPos = new THREE.Vector3(0, 0, 0);
            const sunPos = new THREE.Vector3(deferentCenterX, 0, deferentCenterZ);

            deferentAngle -= Math.asin(planet.equantOffset * Math.sin(epicycleAngle));

            const equantPos = new THREE.Vector3(
            (planet.deferentRadius - planet.equantOffset * planet.deferentRadius) * Math.cos(deferentAngle), 0,
            (planet.deferentRadius - planet.equantOffset * planet.deferentRadius) * Math.sin(deferentAngle) );

            const deferentVec = new THREE.Vector3().subVectors(sunPos, earthPos);
            const equantVec = new THREE.Vector3().subVectors(equantPos, earthPos);

            const equantAngle = Math.acos(deferentVec.dot(equantVec) / (deferentVec.length() * equantVec.length()));

            // --- 3D Orbit Adjustments ---

            // Create a new Object3D for the second epicycle
            if (!planet.secondEpicycle) {
            planet.secondEpicycle = new THREE.Object3D();
            planet.orbit.add(planet.secondEpicycle); } // Add second epicycle to the first

            // Rotate the epicycles
            planet.orbit.rotation.y = epicycleAngle;
            planet.secondEpicycle.rotation.y = secondEpicycleAngle;

            planet.orbit.rotation.y = epicycleAngle;
            planet.orbit.rotation.z = planet.orbitalInclination;

            planet.orbit.parent.rotation.y = equantAngle;
            planet.orbit.parent.rotation.x = planet.deferentInclination * Math.PI / 180; // Apply deferent inclination

            // --- Latitude of the Epicycle Calculation ---

            const deferentX = planet.deferentRadius * Math.cos(equantAngle);
            const deferentZ = planet.deferentRadius * Math.sin(equantAngle);

            // Calculate the position on the first epicycle
            const firstEpicycleX = planet.epicycleRadius * Math.cos(epicycleAngle);
            const firstEpicycleY = planet.epicycleRadius * Math.sin(planet.latitudeOfEpicycle * Math.PI / 180) * Math.sin(epicycleAngle);
            const firstEpicycleZ = planet.epicycleRadius * Math.cos(planet.latitudeOfEpicycle * Math.PI / 180) * Math.sin(epicycleAngle);

            // Calculate the position on the second epicycle relative to the first
            const planetX = firstEpicycleX + planet.secondEpicycleRadius * Math.cos(secondEpicycleAngle) + deferentX;
            const planetY = firstEpicycleY + planet.secondEpicycleRadius * Math.sin(planet.latitudeOfEpicycle * Math.PI / 180) * Math.sin(secondEpicycleAngle);
            const planetZ = firstEpicycleZ + planet.secondEpicycleRadius * Math.cos(planet.latitudeOfEpicycle * Math.PI / 180) * Math.sin(secondEpicycleAngle) + deferentZ;

            planet.mesh.position.set(planetX, planetY, planetZ);

            // --- End of Latitude of the Epicycle Calculation ---

            } else { // For planets other than Venus and Mercury
            
            // Calculate epicycle and deferent angles (include initial angles and epicycleTimeScale)
            const epicycleAngle = (Date.now() / (1000 * 60 * 60 * 24 * planet.orbitalPeriod) * epicycleTimeScale) * Math.PI * 2 + planet.initialPlanetAngle;
            let deferentAngle = (Date.now() / (1000 * 60 * 60 * 24 * 365.25)) * Math.PI * 2 + planet.initialEpicycleAngle;

            // --- Eccentric Calculation ---

            const deferentCenterDistance = planet.deferentRadius * (1 + planet.eccentricity);

            const deferentCenterX = deferentCenterDistance * Math.cos(deferentAngle);
            const deferentCenterZ = deferentCenterDistance * Math.sin(deferentAngle);

            // --- End of Eccentric Calculation ---

            // --- Accurate Equant Calculation (updated for eccentrics) ---

            const earthPos = new THREE.Vector3(0, 0, 0);
            const sunPos = new THREE.Vector3(deferentCenterX, 0, deferentCenterZ);

            deferentAngle -= Math.asin(planet.equantOffset * Math.sin(epicycleAngle));

            const equantPos = new THREE.Vector3(
            (planet.deferentRadius - planet.equantOffset * planet.deferentRadius) * Math.cos(deferentAngle), 0,
            (planet.deferentRadius - planet.equantOffset * planet.deferentRadius) * Math.sin(deferentAngle) );

            const deferentVec = new THREE.Vector3().subVectors(sunPos, earthPos);
            const equantVec = new THREE.Vector3().subVectors(equantPos, earthPos);

            const equantAngle = Math.acos(deferentVec.dot(equantVec) / (deferentVec.length() * equantVec.length()));

            // --- End of Accurate Equant Calculation ---

            // --- 3D Orbit Adjustments ---

            planet.orbit.rotation.y = epicycleAngle;
            planet.orbit.rotation.z = planet.orbitalInclination;

            planet.orbit.parent.rotation.y = equantAngle;
            planet.orbit.parent.rotation.x = planet.deferentInclination * Math.PI / 180;

            // --- End of 3D Orbit Adjustments ---

            // --- Latitude of the Epicycle Calculation ---

            const deferentX = planet.deferentRadius * Math.cos(equantAngle);
            const deferentZ = planet.deferentRadius * Math.sin(equantAngle);

            const planetX = planet.epicycleRadius * Math.cos(epicycleAngle) + deferentX;
            const planetY = planet.epicycleRadius * Math.sin(planet.latitudeOfEpicycle * Math.PI / 180) * Math.sin(epicycleAngle);
            const planetZ = planet.epicycleRadius * Math.cos(planet.latitudeOfEpicycle * Math.PI / 180) * Math.sin(epicycleAngle) + deferentZ;

            planet.mesh.position.set(planetX, planetY, planetZ); } });
    
  // Rotate Saturn's rings (adjust the speed as needed)
  saturnRing.rotation.z += speed * 0.01; 

  // Calculate the CHANGE in machianAngle ONLY if speed > 0
  const machianAngleDelta = (Date.now() / (1000 * 60 * 60 * 24 * 26000 / timeScale)) * Math.PI * 2 - machianAngle;

  // Update machianAngle ONLY if speed > 0
  machianAngle += machianAngleDelta; 

  // Vary firmament rotation using an oscillating Machian influence
  let rotationSpeed = speed * (0.0017 + machianInfluence * Math.sin(machianAngle));
    
  // Set a minimum rotation speed to prevent the Sun from slowing down too much
  const minRotationSpeed = speed * 0.01; // Adjust this value as needed

  // Ensure the rotation speed doesn't go below the minimum
  rotationSpeed = Math.max(minRotationSpeed, rotationSpeed);

  // Ensure the firmament rotates in the correct direction
  if (rotationSpeed > 0) {  
  firmament.rotation.y -= rotationSpeed; 
  } else {
  firmament.rotation.y += Math.abs(rotationSpeed); }

  // Rotate the clouds
  clouds.rotation.y -= speed * (2 * Math.PI / (23.9344696 * 60 * 60)) * 70; 
  clouds.rotation.z -= speed * (2 * Math.PI / (27.3 * 24 * 60 * 60)) * 35; }}}

renderer.render(scene, camera);
previousSpeed = speed; }
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Limit zoom and pan
controls.maxDistance = 155; // Limit how far you can zoom out
controls.minDistance = .46; // Limit how far you can zoom in

// Disable OrbitControls when mouse is over the slider
speedSlider.addEventListener("mouseover", () => {
  controls.enabled = false; });

speedSlider.addEventListener("mouseout", () => {
  controls.enabled = true; });

// Add a keydown event listener to the document
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();  
    animationPaused = !animationPaused; 

    if (!animationPaused) {
      animate(); } } });

animate();

// Helper function to create planets (updated with texture loading)
function createPlanet(radius, color, x, y, z, texturePath, tilt) {
  const geometry = new THREE.SphereGeometry(radius, 256, 256);
  const texture = new THREE.TextureLoader().load(texturePath);
  texture.encoding = THREE.sRGBEncoding;
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.set(x, y, z);

  // Apply axial tilt
  planet.rotation.z = tilt * Math.PI / 180; 

  return planet; }

// Helper function for smoothing logic
function smoothValue(currentValue, targetValue, smoothingFactor = 0.1) {
    const change = targetValue - currentValue;
    return currentValue + change * smoothingFactor; }

// Helper function for tooltip management
function showTooltip(tooltip, event) {
  tooltip.style.display = 'block';
  tooltip.style.left = (event.clientX + 10) + 'px';
  tooltip.style.top = (event.clientY - 30) + 'px'; }

function hideTooltips() {
  tooltip.style.display = 'none';
  earthTooltip.style.display = 'none';
  moonTooltip.style.display = 'none';
  sunTooltip.style.display = 'none';
  mercuryTooltip.style.display = 'none';
  venusTooltip.style.display = 'none';
  marsTooltip.style.display = 'none';
  jupiterTooltip.style.display = 'none';
  saturnTooltip.style.display = 'none'; }