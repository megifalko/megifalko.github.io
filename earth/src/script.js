const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild( renderer.domElement );

const geometry = new THREE.SphereGeometry( 1.5, 32, 32 );
const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
material.map = new THREE.TextureLoader().load('https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg');
material.bumpMap = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9b7029c3-9717-4658-9066-11c30aa24029/dcsav34-0c691ac5-a773-41e3-aba7-ea02a75cba7a.png/v1/fill/w_1264,h_632,q_70,strp/mars_elevation_map_by_oleg_pluton_dcsav34-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvOWI3MDI5YzMtOTcxNy00NjU4LTkwNjYtMTFjMzBhYTI0MDI5XC9kY3NhdjM0LTBjNjkxYWM1LWE3NzMtNDFlMy1hYmE3LWVhMDJhNzVjYmE3YS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.N0I6NVsFA7ufqoWYtjAifIKCOmtn13UN0VT8flx0A30');     
material.bumpScale = 0.005;
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

const geometry2 = new THREE.SphereGeometry( 0.3, 32, 32 );
const material2 = new THREE.MeshPhongMaterial( { color: 0xb5bbbf } );
material2.map = new THREE.TextureLoader().load('https://solarviews.com/raw/moon/moonmap.jpg');
material2.bumpMap = new THREE.TextureLoader().load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9b7029c3-9717-4658-9066-11c30aa24029/dcsav34-0c691ac5-a773-41e3-aba7-ea02a75cba7a.png/v1/fill/w_1264,h_632,q_70,strp/mars_elevation_map_by_oleg_pluton_dcsav34-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQwIiwicGF0aCI6IlwvZlwvOWI3MDI5YzMtOTcxNy00NjU4LTkwNjYtMTFjMzBhYTI0MDI5XC9kY3NhdjM0LTBjNjkxYWM1LWE3NzMtNDFlMy1hYmE3LWVhMDJhNzVjYmE3YS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.N0I6NVsFA7ufqoWYtjAifIKCOmtn13UN0VT8flx0A30');     
material2.bumpScale = 0.015;
const sphere2 = new THREE.Mesh( geometry2, material2 );
sphere.add(sphere2);
sphere2.position.x = -2;

const starsGeometry = new THREE.SphereGeometry(6, 32, 32);
const starsMaterial = new THREE.MeshBasicMaterial();
const starsMesh = new THREE.Mesh(starsGeometry, starsMaterial)

starsMaterial.map = new THREE.TextureLoader().load('https://images.unsplash.com/photo-1520034475321-cbe63696469a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80');
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