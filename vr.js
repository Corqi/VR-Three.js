import * as THREE from 'three';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

import {FirstPersonControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/FirstPersonControls.js';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.xr.enabled = true;
  document.body.appendChild(VRButton.createButton(renderer));

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 1.6, 0);

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

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
  const controls = new FirstPersonControls(camera, renderer.domElement);
  controls.lookSpeed = 0.5;
  
    
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

    controls.update(0.001);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(render);

  function loadModel() {
    const loader = new GLTFLoader();
    loader.load('./resources/train.gltf', (gltf) => {
      gltf.scene.traverse(c => {
        c.castShadow = true;
      });
      gltf.scene.scale.set(1,1,1);
      gltf.scene.position.y = 0.01;
      scene.add(gltf.scene);
    });
  }
}

main();