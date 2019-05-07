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

// Checkers
const checkersGeometry = new THREE.BoxGeometry(4, 0.2, 4);
const checkersTexture = textureLoader.load('res/checkers.png');
const checkersFillTexture = textureLoader.load('res/checkers_fill.png');

const checkersMaterial = new THREE.MeshToonMaterial({ map: checkersTexture, envMap: reflectionCube, reflectivity: 0.2 });
const checkersFillMaterial = new THREE.MeshToonMaterial({ map: checkersFillTexture, envMap: reflectionCube, reflectivity: 0.2 });
const checkersMaterials = [
    checkersFillMaterial,
    checkersFillMaterial,
    checkersMaterial,
    checkersFillMaterial,
    checkersFillMaterial,
    checkersFillMaterial,
]

const checkers = new THREE.Mesh(checkersGeometry, checkersMaterials);
checkers.position.y = -4.9;
scene.add(checkers);

// Table
const tableGeometry = new THREE.BoxGeometry(10, 10, 10);
const tableMaterial = new THREE.MeshNormalMaterial();//  new THREE.MeshToonMaterial({color: 0xCCCCFF});
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.y = -10;
scene.add(table);
camera.position.z = 7;

// Chips

const xWhiteOrigin = 1.5444;
const zWhiteOrigin = -0.6888;

const xBlackOrigin = -1.5444;
const zBlackOrigin = 0.6888;

const scale = 0.4444;

const chipGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.1, 32);
const whiteChipMaterial = new THREE.MeshToonMaterial({ color: 0xDDDDDD, envMap: reflectionCube, reflectivity: 0.1});
const blackChipMaterial = new THREE.MeshToonMaterial({ color: 0x333333, envMap: reflectionCube, reflectivity: 0.1});
for (let x = 0; x < 4; x++) {
    for (let z = 0; z < 3; z++) {
        const whiteChip = new THREE.Mesh(chipGeometry, whiteChipMaterial);
        whiteChip.position.x = xWhiteOrigin - ((x % 4) * scale * 2 + (z % 2) * scale);
        whiteChip.position.z = zWhiteOrigin - (z * scale);
        whiteChip.position.y = -4.8;
        scene.add(whiteChip);

        const blackChip = new THREE.Mesh(chipGeometry, blackChipMaterial);
        blackChip.position.x = xBlackOrigin + (x % 4) * scale * 2 + (z % 2) * scale;
        blackChip.position.z = zBlackOrigin + z * scale;
        blackChip.position.y = -4.8;
        scene.add(blackChip);
    }
}


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

