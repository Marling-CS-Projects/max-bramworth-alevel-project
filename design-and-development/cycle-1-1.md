# 2.2.1 Cycle 1 - THREE.js setup

## Design

### Objectives

THREE.js is very easy to initially set up and I will also be creating an example scene and setting up some additional parts of THREE.js that I know I will need for the rest of the project. These parts will be the GLTFLoader which allows me to create 3D models in software such as blender, save them as files part of the GLTF family and import them into the game.

* [x] Set up THREE
* [x] Create an example scene consisting of:
  * [x] A rotating cube
  * [x] A light
  * [x] A perspective camera
* [x] Setup the GLTFLoader
* [x] Load a 3D model and alter its transform

### Usability Features

### Key Variables

| Variable Name | Use                                                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scene         | A scene in the game, contains everything that the camera can render. I will only have one for the sample scene however                                           |
| camera        | The camera that renders everything with a perspective view, like that of the human eye                                                                           |
| cube          | The cube that the camera will render. Can have its transform altered by using cube.mesh, which accesses its object3D, containing its scale rotation and position |
| sun           | The light of the scene. Illuminates the cube on the nearest face which helps the brain the see the image as 3D                                                   |

### Pseudocode

```
procedure do_something
    
end procedure
```

## Development

### Outcome

### Challenges

Description of challenges

## Testing

Evidence for testing

### Tests

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |

### Evidence
