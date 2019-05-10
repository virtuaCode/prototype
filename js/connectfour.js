"strict";

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera);
//controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;

// Lights
const ambient = new THREE.AmbientLight(0xdddddd, 0.5);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xdddddd, 0.5);
light.position.set(-80, 80, 80);
scene.add(light);

//cubemap
const path = "res/cubemap/";
const format = '.png';
const urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];
const reflectionCube = new THREE.CubeTextureLoader().load(urls);
reflectionCube.format = THREE.RGBFormat;
const refractionCube = new THREE.CubeTextureLoader().load(urls);
refractionCube.mapping = THREE.CubeRefractionMapping;
refractionCube.format = THREE.RGBFormat;
scene.background = reflectionCube;

// Connect Four

let connectfour;

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
  .load('connect4_mesh.mtl', (materials) => {
    materials.preload();
    new THREE.OBJLoader()
      .setMaterials(materials)
      .setPath('res/')
      .load('connect4_mesh.obj', (object) => {
        object.position.y = -5; //-95;
        object.scale.set(0.3, 0.3, 0.3);
        //console.log(object);
        //scene.add(object);

        connectfour = object;

        connectfour.children[0].material = new THREE.MeshStandardMaterial({
          color: 0x3333DD, 
          metalness: 0.0, 
          envMap: reflectionCube, 
          roughness: 0.3
        });

        scene.add(connectfour);

        console.log(object);


      }, onProgress, onError);
  });


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

