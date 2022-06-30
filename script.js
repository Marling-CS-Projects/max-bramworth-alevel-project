import * as THREE from "three";
import { OrbitControls } from "./node_modules/three/build/OrbitControls.js";
//import { PointerLockControls } from "./node_modules/three/examples/jsm/controls/PointerLockControls.js";
import { GLTFLoader } from "GLTFLoader";
import * as MATHS from "./mathsStuff.js";

const loader = new GLTFLoader();
const texLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();

/*
loader.load("./lantern.glb", function( gltf ){
  gltf.scene.position.set(7, 0.75, 2);
  gltf.scene.scale.set(0.2, 0.2, 0.2);
  scene.add( gltf.scene);
}, undefined, function (error){
  console.error(error);
}); */

let birb; // this line goes hard
loader.load("./high flying bird.glb", function( gltf){
  birb = gltf;
  gltf.scene.position.y = 10;
  gltf.scene.scale.set(0.2, 0.2, 0.2);
  scene.add(gltf.scene);
});

const ambient = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambient);

const torch = new THREE.PointLight(0xaaaa00, 0.2);
torch.position.set(3, 5, 35)
scene.add(torch);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
//create the renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
//set its size
renderer.setSize(window.innerWidth, window.innerHeight);
//set 'skybox'
renderer.setClearColor(0xaaaaff, 1);
// Append the renderer canvas into <body>
document.body.appendChild(renderer.domElement);

let wDown = false;
let aDown = false;
let sDown = false;
let dDown = false;
let leftShiftDown = false;
let eDown = false;
let spaceDown = false;
let grounded = false;
let PlayerFacing = new THREE.Vector3(0, 0, 0);
let PlayerRight = new THREE.Vector3(0, 0, 0);
const moveSpeed = 0.1;
let gravity = -0.1;
let roll = 0;
const rollSpeed = 0.2;

const controls = new OrbitControls( camera, renderer.domElement);
//const controls = new PointerLockControls( camera, document.body );
let coliables = [];

class wall {
  constructor(_pos, _rot, _scale, _eje, _isfloor, materialPathway){
    this.cube = {
      geometry: new THREE.BoxGeometry(_scale.x, _scale.y, _scale.z), // will still count as having a scale of 1-1-1 bu taltering geometry will work better with materials I hope
      material: [
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)})
      ]
    };
    this.cube.mesh = new THREE.Mesh(this.cube.geometry, this.cube.material);
    this.ejectionDirection = _eje; // direction player gets pushed upon colliding. Should be small e.g. 0.1 - 0 - 0.1
    this.isFloor = _isfloor; // floors allow the player to become grounded again
    this.cube.mesh.position.x = _pos.x;
    this.cube.mesh.position.y = _pos.y;
    this.cube.mesh.position.z = _pos.z;
    this.cube.mesh.rotation.x = _rot.x;
    this.cube.mesh.rotation.y = _rot.y;
    this.cube.mesh.rotation.z = _rot.z;
    this.cube.mesh.castShadow = true;
    this.cube.mesh.recieveShadow = true;
  }
  existify(){
    scene.add(this.cube.mesh);

    this.boundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.boundingBox.setFromObject(this.cube.mesh);

    coliables.push(this);
  }
}

class structure {
  constructor(_objects){
    this.objects = _objects;
  }

  load(){
    this.objects.forEach(obj => {
      obj.existify();
    })
  }
}

const playerModel = {
    // The geometry: the shape & size of the object
    geometry: new THREE.BoxGeometry(1, 1, 1),
    // The material: the appearance (color, texture) of the object
    material: new THREE.MeshPhongMaterial({ color: 0x2930728 })
};
playerModel.mesh = new THREE.Mesh(playerModel.geometry, playerModel.material);
playerModel.mesh.scale.set(1, 2, 1);
//playerModel.mesh.position.set(-18.5, 19, 2.5);
let playerBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
playerBoundingBox.setFromObject(playerModel.mesh);
scene.add(playerModel.mesh);

camera.position.x = playerModel.mesh.position.x;
camera.position.y = playerModel.mesh.position.y + 1;
camera.position.z = playerModel.mesh.position.z - 5;

// for now I'm going to just have these always loaded and in the main js file but the actual project will change both
const spawn = new structure([
  new wall(new THREE.Vector3(0, -3.25, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 5, 40), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(7, 9, 14.75), new THREE.Vector3(0, 0, -0.1), new THREE.Vector3(4, 20, 39.5), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // left wall
  new wall(new THREE.Vector3(-7, 9, 17), new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(4, 20, 44), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), // right wall
  new wall(new THREE.Vector3(0, 9, -7), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 20, 4), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // back wall
  new wall(new THREE.Vector3(12, 9, 38.75), new THREE.Vector3(0, 0, 0), new THREE.Vector3(40, 20, 0.5), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // far wall
  new wall(new THREE.Vector3(0, 0, 35), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 1.5, 0.5), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // horizontal ledge
  new wall(new THREE.Vector3(0, 1, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 0.5, 4), new THREE.Vector3(0, 0.02, 0), true, "./rock.png"), // top of ledge
  new wall(new THREE.Vector3(6, 2, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 2, 4), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // flat bit of second ledge
  new wall(new THREE.Vector3(8, 3, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 0.5, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // second ledge top
]);

const grassy_slope = new structure([
  new wall(new THREE.Vector3(17, 4, 34.75), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 10, 0.5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // left side wall
  new wall(new THREE.Vector3(10.5, 3.35, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // start of ramp, from bottom
  new wall(new THREE.Vector3(11.5, 3.6, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(12.5, 3.85, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(13.5, 4.1, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(14.5, 4.35, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(15.5, 4.6, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(16.5, 4.85, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(17.5, 5.1, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(17.5, 3, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 4, 4), new THREE.Vector3(0, 0.02, 0), false, "./rock.png"),
  new wall(new THREE.Vector3(21, 5.5, 37), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(4, 0.25, 1), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"),// first platform
  new wall(new THREE.Vector3(26.5, 5.8, 37), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(4, 0.25, 3), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"),// second platform
  new wall(new THREE.Vector3(28.5, 6.7, 37), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(4, 0.25, 3), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"),// get up to next platform bit
]);

const first_opening = new structure([
  new wall(new THREE.Vector3(20, 7, 14.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 5, 40), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // floor
  new wall(new THREE.Vector3(9.5, 13, 14.91), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 10, 40), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), // left wall
  new wall(new THREE.Vector3(29.5, 6, 17.4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 24, 45), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // right wall
  new wall(new THREE.Vector3(20, 13, -5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 10, 0.5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // far wall
  new wall(new THREE.Vector3(10, 19, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(8, 1, 8), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"), // tower floor
  new wall(new THREE.Vector3(13.5, 14, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 9, 3), new THREE.Vector3(0.02, 0, 0), true, "./ladderwood.png"), // tower ladder back
  new wall(new THREE.Vector3(0, 19, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(12, 1, 4), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"), // bridge
]);

const second_opening = new structure([
  new wall(new THREE.Vector3(-18.5, 19, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // grass planes
  new wall(new THREE.Vector3(-18.5, 19, 27.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),// for the floor
  new wall(new THREE.Vector3(-43.5, 19, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(-43.5, 19, 27.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(-43.5, 23.25, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 5, 0.25), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), //gap for roll
  new wall(new THREE.Vector3(-43.5, 23.25, 2.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 5, 0.25), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-39.5, 22.6, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // left of gap
  new wall(new THREE.Vector3(-39.5, 22.6, 2.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-47.5, 22.6, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // right of gap
  new wall(new THREE.Vector3(-47.5, 22.6, 2.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
]);

/*const house = new structure([
  new wall(new THREE.Vector3(-3, 0.75, 12), new THREE.Vector3(0, 0, 0), new THREE.Vector3(9, 3, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./badtexture.png"), // north wall
  new wall(new THREE.Vector3(-3, 0.75, 11.8), new THREE.Vector3(0, 0, 0), new THREE.Vector3(8.7, 3, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), 
  new wall(new THREE.Vector3(-3, 0.75, 4.2), new THREE.Vector3(0, 0, 0), new THREE.Vector3(8.8, 3, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./badtexture.png"), // south wall
  new wall(new THREE.Vector3(-3, 0.75, 4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(9, 3, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"),
  new wall(new THREE.Vector3(-7.5, 0.75, 8), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(8, 3, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./badtexture.png"), // east wall
  new wall(new THREE.Vector3(-7.3, 0.75, 8), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(7.8, 3, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png"),
  new wall(new THREE.Vector3(1.5, 0.75, 10.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.5, 3, 0.1), new THREE.Vector3(0.02, 0, 0.), false, "./badtexture.png"), // west wall
  new wall(new THREE.Vector3(1.3, 0.75, 10.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.4, 3, 0.1), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png"),
  new wall(new THREE.Vector3(1.5, 0.75, 5.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.5, 3, 0.1), new THREE.Vector3(0.02, 0, 0.), false, "./badtexture.png"),
  new wall(new THREE.Vector3(1.3, 0.75, 5.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.4, 3, 0.1), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png"),
  new wall(new THREE.Vector3(1.4, 0.75, 8.525), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 3, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), // seal off the wall loops
  new wall(new THREE.Vector3(1.4, 0.75, 6.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 3, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./badtexture.png"),
  new wall(new THREE.Vector3(-3, 2.25, 8), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 0.1, 9), new THREE.Vector3(0, -0.02, 0), false, "./badtexture.png") //roof
]);*/

spawn.load();
grassy_slope.load();
first_opening.load();
second_opening.load();

let birbposfactor = 0;
function render(){
  controls.update();
    camera.getWorldDirection(PlayerFacing);
    PlayerFacing.y = 0;
    PlayerFacing.normalize();
    PlayerRight = MATHS.calcVectorPerpendicular(PlayerFacing);
    
    playerModel.mesh.position.y += gravity;
    camera.position.y += gravity;

    if (gravity > -0.1){
      gravity -= 0.05;
    }
    if (roll > 0){
      if (roll > 2.5){
        playerModel.mesh.position.z += PlayerFacing.z * rollSpeed;
        playerModel.mesh.position.x += PlayerFacing.x * rollSpeed;
        camera.position.z += PlayerFacing.z * rollSpeed;
        camera.position.x += PlayerFacing.x * rollSpeed;
      } else{
        playerModel.mesh.scale.set(1, 2, 1);
      }
      roll -= 0.1;
    }

    if (wDown){
        playerModel.mesh.position.z += PlayerFacing.z * moveSpeed;
        playerModel.mesh.position.x += PlayerFacing.x * moveSpeed;
        camera.position.z += PlayerFacing.z * moveSpeed;
        camera.position.x += PlayerFacing.x * moveSpeed;
    }
    if (sDown){
        playerModel.mesh.position.z -= PlayerFacing.z * moveSpeed;
        playerModel.mesh.position.x -= PlayerFacing.x * moveSpeed;
        camera.position.z -= PlayerFacing.z * moveSpeed;
        camera.position.x -= PlayerFacing.x * moveSpeed;
    }
    if (aDown){
        playerModel.mesh.position.z += PlayerRight.z * moveSpeed;
        playerModel.mesh.position.x += PlayerRight.x * moveSpeed;
        camera.position.z += PlayerRight.z * moveSpeed;
        camera.position.x += PlayerRight.x * moveSpeed;
    }
    if (dDown){
        playerModel.mesh.position.z -= PlayerRight.z * moveSpeed;
        playerModel.mesh.position.x -= PlayerRight.x * moveSpeed;
        camera.position.z -= PlayerRight.z * moveSpeed;
        camera.position.x -= PlayerRight.x * moveSpeed;
    }
    if (spaceDown && grounded && roll <= 0){
      gravity = 0.5;
    }
    if(leftShiftDown && roll <= 0){
      playerModel.mesh.scale.set(1, 1, 1);
      playerModel.mesh.position.y -= 0.5;
      roll = 5;
    }

    grounded = false;

    playerBoundingBox.setFromObject(playerModel.mesh);

    coliables.forEach(colidable => {
      if (playerBoundingBox.intersectsBox(colidable.boundingBox)){
        if (colidable.isFloor){
          grounded = true;
        }
        while(playerBoundingBox.intersectsBox(colidable.boundingBox)){
          /*playerModel.mesh.position.z += dir1.z * 0.02;
          playerModel.mesh.position.x += dir1.x * 0.02;
          camera.position.z += dir1.z * 0.02;
          camera.position.x += dir1.x * 0.02;
          playerBoundingBox.setFromObject(playerModel.mesh);*/
          playerModel.mesh.position.x += colidable.ejectionDirection.x;
          playerModel.mesh.position.y += colidable.ejectionDirection.y;
          playerModel.mesh.position.z += colidable.ejectionDirection.z;
          camera.position.x += colidable.ejectionDirection.x;
          camera.position.y += colidable.ejectionDirection.y;
          camera.position.z += colidable.ejectionDirection.z;
          playerBoundingBox.setFromObject(playerModel.mesh);
        }
      }
    });

    if (birb){
      birbposfactor += 0.01;
      birb.scene.rotation.y = birbposfactor + Math.PI;
      birb.scene.position.set(Math.sin(birbposfactor) * 25, 28, Math.cos(birbposfactor) * 25)
    }

    controls.target = new THREE.Vector3(playerModel.mesh.position.x, playerModel.mesh.position.y + 1, playerModel.mesh.position.z);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}
window.addEventListener('keyup', (e) => {
    switch (e.keyCode){
      case 87: // w
        wDown = false;
        break;
      case 65: // a
        aDown = false;
        break;
      case 83: // s
        sDown = false;
        break;
      case 68: // d
        dDown = false;
        break;
      case 16: // q
        leftShiftDown = false;
        break;
      case 69: // e
        eDown = false;
        break;
      case 32: // space
        spaceDown = false;
        break;
      case 13: // enter
        console.log(PlayerFacing);
        console.log(PlayerRight);
        break;
    }
});
  window.addEventListener('keydown', (e) => {
    switch (e.keyCode){
      case 87: // w
        wDown = true;
        break;
      case 65: // a
        aDown = true;
        break;
      case 83: // s
        sDown = true;
        break;
      case 68: // d
        dDown = true;
        break;
      case 16: // q
        leftShiftDown = true;
        break;
      case 69: // e
        eDown = true;
        break;
      case 32: // space
        spaceDown = true;
        break;
    }
});
/*controls.addEventListener( 'lock', function () {
	menu.style.display = 'none';
} );
controls.addEventListener( 'unlock', function () {
	menu.style.display = 'block';
} );*/
render();