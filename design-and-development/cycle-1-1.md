# 2.2.1 Cycle 1 - THREE.js setup

### Objectives

THREE.js is very easy to initially set up and I will also be creating an example scene and setting up some additional parts of THREE.js that I know I will need for the rest of the project.

* [x] Set up THREE
* [x] Create an example scene consisting of:
  * [x] A rotating cube
  * [x] A light
  * [x] A perspective camera

### Key Variables

| Variable Name | Use                                                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scene         | A scene in the game, contains everything that the camera can render. I will only have one for the sample scene however                                           |
| camera        | The camera that renders everything with a perspective view, like that of the human eye                                                                           |
| cube          | The cube that the camera will render. Can have its transform altered by using cube.mesh, which accesses its object3D, containing its scale rotation and position |
| sun           | The light of the scene. Illuminates the cube on the nearest face which helps the brain the see the image as 3D                                                   |

## Development

### Outcome

Firstly, I imported the 'Live Server' extension in VSCode to help me host it as I found that going to the lengths of using node.js was unnecessary.&#x20;

![](<../.gitbook/assets/image (4) (1).png>)

Next I wrote my .html and .css files to contain the viewport which the game would be drawn onto. I then created my JavaScript file and imported THREE.js and the GLTFLoader. I ran into issues with importing the GLTFLoader and had to setup an import map in my .html file which fixed the problem.

{% tabs %}
{% tab title="index.html" %}
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Shaded Spirits</title>
    <link href="./style.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <script type="importmap">
    {
      "imports": {
        "three": "./node_modules/three/build/three.module.js",
        "GLTFLoader": "./node_modules/three/examples/jsm/loaders/GLTFLoader.js"
      }
    }
    </script> 
    <script type="module" src="./script.js"></script>
  </body>
</html>
```
{% endtab %}

{% tab title="style.css" %}
```
html, body {
	overflow: hidden;
    user-select: none;
    padding: 0;
    margin: 0;
}

canvas {
	width: 100%; 
	height: 100%;
	padding: 0;
    outline:none;
}
```
{% endtab %}

{% tab title="script.js" %}
```
import * as THREE from "three";
```
{% endtab %}
{% endtabs %}

I then wrote some sample code for the scene to render, featuring a rotating cube and a light source that causes different amounts of shading on the surfaces as the cube rotates. For this I had to first initialise the scene, which everything to be rendered would be placed in. The next most important part of rendering a scene is the camera and its renderer. I made the camera scale to match any window size so that the user can minimise the tab to not be full screen if that suits them better. Finally I needed to tell the camera to render the scene, so I used a repeating render() function that calls sixty times a second using the requestAnimationFrame() function that THREE.js uses.

```
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xaaaaaa, 1);
document.body.appendChild(renderer.domElement);

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
```

![The camera is now rendering our rather boring scene](<../.gitbook/assets/image (3).png>)

In order to fill in the scene, I added a cube. I made it a pleasant shade of turquoise and used a phong material in order for it to be able to be lit by the directional light, which I used the hex code of light from the sun for. To make sure that the camera was rendering at 60fps, I made the cube rotate on the spot.

```
const sun = new THREE.DirectionalLight(0xfdfbd3, 0.5);
sun.position.set(-5, 3, 2);
scene.add(sun);

const cube = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshPhongMaterial({ color: 0x00ffff }) //phong allows for lighting
};
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);
scene.add(cube.mesh);

let thePos = 0;
function render() {
  cube.mesh.rotation.y = Math.sin(thePos);
  thePos += 1/60;
  
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
```

This code ran into an issue however, the screen was still empty. I soon realised that this was because the camera was inside the cube and the location of the near clipping planes meant that the cube was impossible to see therefore as none of its planes were inside the view frustrum. This was fixed by simply moving the camera backwards. I then used the lookAt function to make sure that the cube was in the centre of frame.

```
camera.position.set(0, 1, 5);
camera.lookAt(cube.mesh.position);
```

![Full screen tab, large and letter shaped, works well as expected](<../.gitbook/assets/image (2) (1).png>)

![Very small tab, small and square shaped, still works](<../.gitbook/assets/image (6) (1).png>)

### Challenges

This section of the project was very straight forward to create as I had made many THREE.js projects before and this part was common between many of them. My only real issue was with the camera being inside of the cube so I should keep in mind how the position of the camera my produce unwanted views of out of bounds areas or prevent parts of a scene from being seen for the rest of the project.

## Testing

| Test | Instructions            | What I expect                                                                                                                   | What actually happens |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1    | Run code                | See the cube in the world, different faces coloured different shades of turquoise based on how they face the light.             | As expected           |
| 2    | Run code and then wait. | Observe the cube's rotation on the spot change. It will accelerate and decelerate over time according to its sin wave function. | As expected           |
