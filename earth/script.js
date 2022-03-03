const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1.5, 32, 32 );
const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
material.map = new THREE.TextureLoader().load('earthTexture.jpg');
material.bumpMap = new THREE.TextureLoader().load('planetTexture.jpg');     
material.bumpScale = 0.005;
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

const geometry2 = new THREE.SphereGeometry( 0.3, 32, 32 );
const material2 = new THREE.MeshPhongMaterial( { color: 0xb5bbbf } );
material2.map = new THREE.TextureLoader().load('moonTexture.jpg');
material2.bumpMap = new THREE.TextureLoader().load('planetTexture.jpg');     
material2.bumpScale = 0.015;
const sphere2 = new THREE.Mesh( geometry2, material2 );
sphere.add(sphere2);
sphere2.position.x = -2;

const starsGeometry = new THREE.SphereGeometry(6, 32, 32);
const starsMaterial = new THREE.MeshBasicMaterial();
const starsMesh = new THREE.Mesh(starsGeometry, starsMaterial)

starsMaterial.map = new THREE.TextureLoader().load('starsTexture.jpg');
starsMaterial.side = THREE.BackSide;

scene.add(starsMesh);

const light = new THREE.DirectionalLight(0xcccccc, 1);

light.position.set(8, 3, 5);
scene.add(light);

camera.position.z = 3;
function animate() {
	requestAnimationFrame( animate );
  sphere.rotation.y -= 0.005;
  sphere2.rotation.y -= 0.01;
	renderer.render( scene, camera );
}
animate();

document.addEventListener('mousemove', (e) => {
    camera.position.x = (e.x - (window.innerWidth / 2)) * 0.005;
    camera.lookAt(scene.position);
});