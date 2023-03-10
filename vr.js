import * as THREE from 'three';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

let camera;
let renderer;
let scene;

init();
animate();

function init() {
  const canvas = document.querySelector('#c');
  renderer = new THREE.WebGLRenderer({canvas});
  //enable webXR
  renderer.xr.enabled = true;
  renderer.xr.setReferenceSpaceType( 'local' );
  document.body.appendChild(VRButton.createButton(renderer));

  scene = new THREE.Scene();


  //light
  const color = 0xFFFFFF;
  const intensity = 0.5;

  //main light
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-40, 30, 1);
  light.castShadow = true;
  scene.add(light);

  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(-40, -30, 1);
  light2.castShadow = true;
  scene.add(light2);

  //ambient light
  const ambientLight = new THREE.AmbientLight(0x4B4B4B, 0.5);
  scene.add(ambientLight);
  
  //camera
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

  //fix bug where camera pos does not match vr camera pos
  const _camera = new THREE.Object3D();
  _camera.position.set(0.2, 1.1, -0.70);
  _camera.rotation.y = Math.PI;
  scene.add(_camera);
  _camera.add(camera);
  
  
  //add skybox
  var skybox = new THREE.SphereGeometry( 500, 60, 40 );
  skybox.scale( - 1, 1, 1 );

  var skyboxmaterial = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load( './resources/panorama.png' )
  } );

  var skyboxmesh = new THREE.Mesh( skybox, skyboxmaterial );

  scene.add( skyboxmesh );

  //add train model
  loadModel();

  //controller for PC camera
  const controls = new OrbitControls( _camera, renderer.domElement );
  controls.rotateSpeed *= -1;
  controls.target.set(0.2, 1.1, -0.7001);
  controls.update();
}
    
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function render(time) {
  time *= 0.001;
  
  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  renderer.render(scene, camera);
}

function animate() {
  renderer.setAnimationLoop( render );
}

function loadModel() {
  const loader = new GLTFLoader();
  loader.load('./resources/train.gltf', (gltf) => {
    gltf.scene.traverse(c => {
      c.castShadow = true;
      c.receiveShadow = true;
    });
    gltf.scene.scale.set(1,1,1);
    scene.add(gltf.scene);
  });
}