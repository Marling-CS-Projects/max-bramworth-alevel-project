# 2.2.2 Cycle 2 - adding controls

## Design

### Objectives

In this cycle I will create and input system that registers inputs in a way that is better than the default JavaScript key detections and also allows for full re-mapping. Then I will create the controls to move around, forwards, backwards and side to side. Finally I will allow the player to rotate the camera all the way round left and right but clamp the movement up and down.

* [x] Create and add the player to the scene
* [x] Create a set of variables that track which keys are down
* [x] Track mouse movements and clicks
* [x] Assign the keys to actions
  * [x] WASD will default to moving
  * [x] Movement will be relative to the camera's rotation

### Usability Features

### Key Variables

| Variable Name      | Use                                                      |
| ------------------ | -------------------------------------------------------- |
| the 'xDown' series | multiple variables that track which keys are up and down |
| playermodel        | The player                                               |
| playerFacing       | The direction the player is looking                      |
| playerRight        | The direction to the player's right                      |

### Pseudocode

{% tabs %}
{% tab title="Main.js" %}
```
import input.js

create player
add player to scene

render loop:
    Get playerDirection from the player's relative z
    work out playerRight from player Direction
    
    if pressing key using input.js's getKey
        go in the direction of that key, relative to the camera
```
{% endtab %}

{% tab title="Input.js" %}
```
let variables for each gameplay relevant key

on key down
    set that key's variable to true
    
on key down
    set that key's variable to false
    
export function getKey(named key)
    return the value of the variable assigned to the named key
```
{% endtab %}
{% endtabs %}

## Development

### Outcome

I started this cycle with the player. I created it as an object named playerModel and placed it in the scene. I then adjusted the camera so that it was an appropriate distance from the player, allowing the user to see clearly the player model but also to be able to take in lots of the environment and have a wide field of view. I also converted the base scene I made last cycle into a 'floor' to better contextualise the movements of the player without making the map complicated.

```
const playerModel = {
    geometry: new THREE.BoxGeometry(1, 1, 1),
    material: new THREE.MeshBasicMaterial( 0xff0000 ),
};
playerModel.mesh = new THREE.Mesh(playerModel.geometry, playerModel.material);
playerModel.mesh.scale.set(1, 2, 1);
scene.add(playerModel.mesh);

const floor = {
    geometry: new THREE.BoxGeometry(1, 1, 1),
    material: new THREE.MeshBasicMaterial( 0xaaaaaa ),
};
floor.mesh = new THREE.Mesh(floor.geometry, floor.material);
floor.mesh.scale.set(10, 5, 40);
scene.add(floor.mesh);
```

![](<../.gitbook/assets/image (4).png>)

The controls use a separate file which checks keyboard inputs over the renderer window. That file then exports a function which allows the main file to ask the input file if a particular key is currently being pressed. I then also have to import the file into the main script so that it can use it.

{% tabs %}
{% tab title="Input.js" %}
```
let wDown = false;
let aDown = false;
let sDown = false;
let dDown = false;
let leftShiftDown = false;
let eDown = false;
let spaceDown = false;

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
        console.log("working! :D");
        break;
      case 32: // space
        spaceDown = false;
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
    case 16: // leftshift
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

export function getKey(key){
    switch(key){
        case "w":
            return(wDown);
            break;
        case "a":
            return(aDown);
            break;
        case "s":
            return(sDown);
            break;
        case "d":
            return(dDown);
            break;
        case "space":
            return(spaceDown);
            break;
        case "e":
            return(eDown);
            break;
        case "lShift":
            return(leftShiftDown);
            break;
    }
}
```
{% endtab %}

{% tab title="Script.js" %}
```
import * as INPUTSYS from "./input.js";
```
{% endtab %}
{% endtabs %}

![my current debug key (e) showing up in the console](<../.gitbook/assets/image (5) (1).png>)

Having the game recognise keyboard input is good but only means anything when the input has a perceivable effect on the game instead of just a message in the console. To do this I added checks to the render() loop which would increase or decrease the player's x or z component if their respective key was currently down. I also need to update the position of the camera to follow the player as they move around.

```
if (INPUTSYS.getKey("w")){
    playerModel.mesh.position.z += moveSpeed;
}
if (INPUTSYS.getKey("s")){
    playerModel.mesh.position.z -= moveSpeed;
}
if (INPUTSYS.getKey("a")){
    playerModel.mesh.position.x += moveSpeed;
}
if (INPUTSYS.getKey("d")){
    playerModel.mesh.position.x -= moveSpeed;
}

camera.position.set(
    playerModel.mesh.position.x, 
    playerModel.mesh.position.y + 1,
    playerModel.mesh.position.z - 5
);
camera.lookAt(playerModel.mesh);
```

{% embed url="https://youtu.be/JWG6qITiX1o" %}
Rather hard to see in the video due to the length of the platform but the player is able to manoeuvre in all four direction
{% endembed %}

Using the mouse move event listener allows the player to move the camera. To do this I increase / decrease the player model's y rotation (spinning on the spot) based on the x dimension of the vector returned by the "mousemove" event times a constant used to modify the sensitivity. I then move the camera's y position by the y dimension of the "mousemove" vector times the sensitivity constant.&#x20;

```
import * as MATHS from "./maths.js";

let PlayerFacing = new THREE.Vector3();
let PlayerRight = new THREE.Vector3();

document.addEventListener("mousemove", e => {
  e.preventDefault();
  playerModel.mesh.rotation.y += e.movementX * -0.006;
  camHeight += e.movementY * 0.01;
  camHeight = Math.max(camHeight, -0.75);
  camHeight = Math.min(camHeight, 3);
})
```

Finally I saved the vector containing the direction that the player is facing every frame which can be used to move the camera to the appropriate location and make movement relevant to the direction the camera is facing. Then I appropriately updated the keys so that w and s move using player forwards and a and d use player right and placed the camera behind the player using the negative of the player facing.

{% tabs %}
{% tab title="Main.js" %}
```
playerModel.mesh.getWorldDirection(PlayerFacing);
PlayerFacing.normalize();
PlayerRight = MATHS.calcVectorPerpendicular(PlayerFacing);

if (INPUTSYS.getKey("w")){
    playerModel.mesh.position.z += PlayerFacing.z * moveSpeed;
    playerModel.mesh.position.x += PlayerFacing.x * moveSpeed;
}
if (INPUTSYS.getKey("s")){
    playerModel.mesh.position.z -= PlayerFacing.z * moveSpeed;
    playerModel.mesh.position.x -= PlayerFacing.x * moveSpeed;
}
if (INPUTSYS.getKey("a")){
    playerModel.mesh.position.z += PlayerRight.z * moveSpeed;
    playerModel.mesh.position.x += PlayerRight.x * moveSpeed;
}
if (INPUTSYS.getKey("d")){
    playerModel.mesh.position.z -= PlayerRight.z * moveSpeed;
    playerModel.mesh.position.x -= PlayerRight.x * moveSpeed;
}

camera.position.x = playerModel.mesh.position.x - PlayerFacing.x * 5;
camera.position.y = playerModel.mesh.position.y + camHeight;
camera.position.z = playerModel.mesh.position.z - PlayerFacing.z * 5;
camera.lookAt(new THREE.Vector3(playerModel.mesh.position.x, playerModel.mesh.position.y + 1, playerModel.mesh.position.z));
```
{% endtab %}

{% tab title="Maths.js" %}
```
import * as THREE from "./node_modules/three/build/three.module.js";
  
export function calcVectorPerpendicular(inpVector){
  const vect = new THREE.Vector3(inpVector.z, inpVector.y, -inpVector.x);
  return (vect);
}
```
{% endtab %}
{% endtabs %}

{% embed url="https://youtu.be/GI6-HoMp5-Q" %}
Perfectly working!
{% endembed %}

### Challenges

I had some experience in 3D controls before from my cycle 0 attempt so I did not have many issues  with reproducing it in THREE. I did have some issues with helping the main JavaScript file communicate with the input file, which is what led me to landing on the getKey() solution.

## Testing

| Test | Instructions                      | What I expect                                                    | What actually happens |
| ---- | --------------------------------- | ---------------------------------------------------------------- | --------------------- |
| 1    | Run code                          | Scene renders: a long grey catwalk and a red cuboid player model | As expected           |
| 2    | Press W/A/S/D                     | The player moves around                                          | As expected           |
| 3    | Move mouse                        | The camera rotates around the player                             | As expected           |
| 4    | Press W/A/S/D after moving camera | Player moves in new direction they are facing                    | As expected           |
