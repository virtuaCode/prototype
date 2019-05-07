"strict";

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera);

//controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;


// Lights
const ambient = new THREE.AmbientLight(0xdddddd, 0.5);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xdddddd, 0.5);
light.position.set(10, 10, -10);
scene.add(light);


// Cubemap
const path = "res/cubemap/";
const format = '.png';
const urls = [
  path + 'px' + format, path + 'nx' + format,
  path + 'py' + format, path + 'ny' + format,
  path + 'pz' + format, path + 'nz' + format
];
const reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.format = THREE.RGBFormat;
console.log(reflectionCube);
const refractionCube = new THREE.CubeTextureLoader().load(urls);
refractionCube.mapping = THREE.CubeRefractionMapping;
refractionCube.format = THREE.RGBFormat;
scene.background = reflectionCube;


// Pins
let pin;

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    var percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete, 2) + '% downloaded');
  }
};

function onError(err) {
  console.error(err);
};

new THREE.MTLLoader()
  .setPath('res/')
  .load('pin.mtl', (materials) => {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials(materials)
      .setPath('res/')
      .load('pin.obj', (object) => {
        object.position.y = -5; //-95;
        object.scale.set(0.1, 0.1, 0.1);
        //console.log(object);
        //scene.add(object);

        pin = object;
        
        // Apply env map to all materials
        pin.children[0].material.forEach((material, i) => {
          material.envMap = reflectionCube;
          material.metalness = 0.0;
          material.roughness = 0.6;
          material.reflectivity = 0.1;
        });

        
        let xOrigin = 0;
        let yOrigin = 3;
        let distance = 0.2;

        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < y + 1; x++) {
            let xPos = xOrigin + (y - 2 * x) * distance;
            let yPos = yOrigin + distance * y * 2;

            let newPin = pin.clone();
            newPin.position.x = xPos;
            newPin.position.z = yPos;
            scene.add(newPin);
          }
        }


      }, onProgress, onError);
  });


// Ball
const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32)
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0x3333DD, metalness: 0, roughness: 0.1, envMap: reflectionCube });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.y = -4.7;
ball.position.z = -3;
scene.add(ball);


// Table
const tableGeometry = new THREE.BoxGeometry(10, 10, 10);
const tableMaterial = new THREE.MeshNormalMaterial();//  new THREE.MeshToonMaterial({color: 0xCCCCFF});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.y = -10;
scene.add(table);
camera.position.z = 7;

let angle = 0;

function render() {
  requestAnimationFrame(render);
  //camera.position.x = 7 * Math.cos(angle);
  //camera.position.z = 7 * Math.sin(angle);
  //angle += 0.01;
  controls.update();
  camera.lookAt(0, -5, 0);
  renderer.render(scene, camera);
};

render();

