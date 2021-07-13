import './style.css'

//importando librería three.js
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// variables de escena,  cámara  y render de three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

//Construyendo un diseño geométrico
const geometry= new THREE.TorusKnotGeometry(10, 2.5, 100, 16);
const material = new THREE.MeshNormalMaterial( { color: 0xff6347} );
const torusKnot = new THREE.Mesh( geometry, material );
scene.add( torusKnot );

//creando iluminación
//iluminación en un punto
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

//iluminación ambiental
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//Helper para iluminación
const lightHelper = new THREE.PointLightHelper(pointLight);

//GRID Helper
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement)

function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xCCA9DD});
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));
    
    star.position.set(x,y,z);
    scene.add(star)
}
//definiendo cantidad de estrellas aleatorias
Array(200).fill().forEach(addStar)

//defniendo el fondo del espacio
const spaceTexture = new THREE.TextureLoader().load('/assets/images/galaxy.png');

scene.background = spaceTexture;

//Texture Mapping y Avatar
const kifyTexture = new THREE.TextureLoader().load('/assets/images/kify.png')

const kifyAvatar = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    new THREE.MeshBasicMaterial( { map: kifyTexture})
);

scene.add(kifyAvatar);

//Esfera
const esferaTexture = new  THREE.TextureLoader().load('/assets/images/surface.png');

const esfera = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshBasicMaterial( { map: esferaTexture})
);
scene.add(esfera);

esfera.position.z= 30;
esfera.position.setX(-10);

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;

    esfera.rotation.x += 0.05;
    esfera.rotation.y += 0.075;
    esfera.rotation.z += 0.05;

    kifyAvatar.rotation.y += 0.01;
    kifyAvatar.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
};

document.body.onscroll = moveCamera;

function animate(){
    requestAnimationFrame(animate);

    torusKnot.rotation.x +=0.01;
    torusKnot.rotation.y +=0.005;
    torusKnot.rotation.z +=0.01;

    controls.update(); 

    renderer.render(scene, camera);
}

animate();