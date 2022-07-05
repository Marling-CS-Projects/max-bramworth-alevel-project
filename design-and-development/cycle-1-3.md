# 2.2.3 Cycle 3 - Collisions and jumping

## Design

### Objectives

* [x] Add a class for collidable walls
* [x] Detect collisions between the player and these walls
* [x] Respond to collisions to create the illusion of solid objects colliding

### Key Variables

| Variable Name | Use                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wall          | A class containing the position, rotation and dimension of an ingame wall. From this a collision box is made and a direction to push the player on collision is made. |
| grounded      | can the player jump or not?                                                                                                                                           |
| colidables    | everything the player can collide with.                                                                                                                               |
| gravity       | moves the player downwards                                                                                                                                            |

### Pseudocode

```
create wall class:
    setup its position, rotation, scale, ejeDirection and isFloor
    
    exist():
        add self to scene
        create bounding box based off self
        add boundingbox to list of gameObjects


render:
    for every boundingbox:
        check if it intersects with the player
        if it does, move the player along the direction that that box says to
        move it in until it is no longer intersecting
        if that box was marked as a floor, set the player to grounded
```

## Development

### Outcome

Creating a whole game world using just code blocks that look like this would take far too long and be incredibly tedious too use.

```
const cube = {
  geometry: new THREE.BoxGeometry(1, 1, 1),
  material: new THREE.MeshPhongMaterial({ color: 0x00ffff }),
};
cube.mesh = new THREE.Mesh(cube.geometry, cube.material);
scene.add(cube.mesh);
```

Therefore it makes more sense to create a class which I can pass more human-friendly information, position and size instead of vertices in global space, into. This will also allow for me to give certain walls and surfaces in the game special features or be more easily able to reference individual walls. I also created a list to contain every active bounding box that the game should be checking collision against.

```
let coliables = []; // yes I spelt this wrong

class wall {
  constructor(_pos, _rot, _scale, _eje, _isfloor){
    this.cube = {
      geometry: new THREE.BoxGeometry(_scale.x, _scale.y, _scale.z), 
      material: new THREE.MeshPhongMaterial( 0xaaaaaa ),
    };
    this.cube.mesh = new THREE.Mesh(this.cube.geometry, this.cube.material);
    this.ejectionDirection = _eje; // direction player gets pushed upon colliding. Should be small e.g. 0.1 - 0 - 0.1
    this.isFloor = _isfloor; // floors allow the player to become grounded again
    this.cube.mesh.position.set(_pos.x, _pos.y, _pos.z);
    this.cube.mesh.rotation.set(_rot.x, _rot.y, _rot.z);
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
```

A Box3 is a THREE.js data type that is defined by two points in global space, min and max respectively. From these two points, THREE works out all of the rest of the box's dimensions. Manually figuring these out myself wouldn't be too hard but as THREE has the setFromObject function to do that for me anyway, I use that instead. The existify function was originally just part of the constructor but I soon realised I wanted control over when a wall enters the scene and created a separate function for it.

Now that we have the means to create a proper wall, I will create one in the scene now to make sure the class works

```
const the_ground = new wall(new THREE.Vector3(0, -3.25, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 0.5, 20), new THREE.Vector3(0, 0.02, 0), true);
the_ground.existify();
```

![We have now successfully done nothing that we couldn't already do, lets fix that](<../.gitbook/assets/image (5).png>)

Although its nice to have working, it is ultimately pointless. Firstly, we will need to give the player a hitbox of their own so that they can collide. This is pretty much exactly like the wall but we won't add it to the collidables list, since when would we care if the player was colliding with themselves? Next I will need to add some gravity, although I could just use a vertical wall instead of a floor to test this, I will need gravity for the end project anyway and implementing it now makes sense.

```
let playerBoundingBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
playerBoundingBox.setFromObject(playerModel.mesh);

let gravity = -0.1;

render(){
    ...
    playerModel.mesh.position.y += gravity;
    ...
}
```

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
