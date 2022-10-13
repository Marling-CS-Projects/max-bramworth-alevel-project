# 2.2.4 Cycle 4 - Level creation tools

### Design

I will be able to make levels much faster with tools for creating them so that will give me the ability to make more content for the game, which will allow for more variety and a bigger map for the player to do more in.

### Objectives

* [x] Improve the walls I can add the the game world
  * [x] Allow for custom textures beyond flat colours
* [x] Add 'structures' - groups of walls that all load and deload together.
* [x] Import 3D GLTF models
  * [x] Load a 3D model as an example
* [x] Add custom cylinder bounding boxes

### Key Variables

| Variable Name     | Use                                                 |
| ----------------- | --------------------------------------------------- |
| class "structure" | contains walls, 3d objects and enemies for an area. |
| Loader            | allows me to load GLTF models                       |
| texloader         | allows me to load custom textures form image files  |

### Pseudocode

```
create texloader
create gltfloader

create collidableModels;
    
class wall:
    ...
    material:
    [
        texloader load texture on face,
        texloader load texture on face,
        texloader load texture on face,
        texloader load texture on face,
        texloader load texture on face,
        texloader load texture on face,
    ]
    ...
    
class 3D obj:
    setup position, rotation and scale
    load model in
    setup hitbox with height and width
    
    load()
        load model to scene
        add hitbox to modellist

class structure:
    setup list of walls
    setup list of 3D objects
```

## Development

### Outcome

First I want to add textures to the walls and floors so that I can make the world look better. This will be essential for improving the look of the game and is fortunately easy to do. Initially, I had been creating materials like this:

```javascript
material: new THREE.MeshPhongMaterial({ color: 0x00ffff })
```

But that solution only allows for block colours. By creating a texture loader I can replace this code with an array of six items, one for each face, that each point to an image file.

```javascript
const texLoader = new THREE.TextureLoader();

    material: [
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)}),
        new THREE.MeshStandardMaterial({ map: texLoader.load(materialPathway)})
   ]
```

![Eyesore no more](<../.gitbook/assets/image (6) (1) (1).png>)

I added this to the wall class and made the constructor require a string that points to the pathway of the material to be used for the wall.

Next I got round to adding 3D models. The recommended format is .gltf and .glb which is a common file format that Blender, the program I use to 3D model, works with. Setting it up is simple but I did have some trouble modifying the transform and took a few attempts to do so.&#x20;

```javascript
loader.load("./moai.glb", function(gltf){
      gltf.scene.position.set(_pos.x, _pos.y, _pos.z);
      gltf.scene.rotation.set(_rot.x, _rot.y, _rot.z);
      gltf.scene.scale.set(_scale.x, _scale.y, _scale.z);
      scene.add(gltf.scene);
});
```

Alike with the walls, I soon decided to convert the 3D models to becoming instantiable classes so that they would be able easier to work with when making my game world. The values of the hitbox object in this class will be used for the future collision section.

```javascript
class THREEDModel {
  constructor(_pos, _rot, _scale, hitboxRadius, hitboxHeight, modelPathway){
    this.modelPathway = modelPathway;
    this._pos = new THREE.Vector3(_pos.x, _pos.y, _pos.z);
    this._rot = new THREE.Vector3(_rot.x, _rot.y, _rot.z);
    this._scale = new THREE.Vector3(_scale.x, _scale.y, _scale.z);
    this.hitbox = {
      height: hitboxHeight,
      width: hitboxRadius,
    };
  }

  load(){
    const pos = new THREE.Vector3(this._pos.x, this._pos.y, this._pos.z);
    const rot = new THREE.Vector3(this._rot.x, this._rot.y, this._rot.z);
    const scale = new THREE.Vector3(this._scale.x, this._scale.y, this._scale.z);

    loader.load(this.modelPathway, function(gltf){
      gltf.scene.position.set(pos.x, pos.y, pos.z);
      gltf.scene.rotation.set(rot.x, rot.y, rot.z);
      gltf.scene.scale.set(scale.x, scale.y, scale.z);
      scene.add(gltf.scene);
    });
    collidableModels.push(this);
  }
}
```

![positively hilarious](<../.gitbook/assets/image (7) (1).png>)

To individually refer to every wall and model will still be far to much to do. Many models and walls will need loading in at the same time and can be grouped together. To contain these objects I will use the structure class which will be the highest level of the classes.

```javascript
class structure {
  constructor(_objects, _models){
    this.objects = _objects;
    this.models = _models;
  }

  load(){
    this.objects.forEach(obj => {
      obj.existify();
    })
    this.models.forEach(obj => {
      obj.load();
    })
  }
}

const mockuplevel = new structure([
  new wall(new THREE.Vector3(0, -3.25, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 5, 30), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(10, 1, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 5, 5), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"),
], [
  new THREEDModel(new THREE.Vector3(0, -0.25, 3), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.5, 0.5, 0.5), 1, 2, "./moai.glb"),
]);
mockuplevel.load();
```

Finally, I want to add cylindrical colliders, these are not native to THREE so I will be creating my own for them. The basis of the logic is to find the distance between two cylinders' centres (on the xz plane) and if it is smaller than the radius of the two cylinders combined then there must be an overlap. Provided that one is not significantly higher than the other. For this I decided to add some distance checking functions, one 3D one 2D, to my maths file as I knew I would be using them again later in the project.

{% tabs %}
{% tab title="Script.js" %}
```javascript
render(){
  ...
  collidableModels.forEach(colidable => {
    if (MATHS.distance2D(new THREE.Vector2(playerModel.mesh.position.x,
    playerModel.mesh.position.z), new THREE.Vector2(colidable._pos.x,
    colidable._pos.z)) < colidable.hitbox.radius + 0.5  && 
    (colidable.hitbox.height / 2) + 0.5 > 
    Math.abs(colidable._pos.y - playerModel.mesh.position.y)){
      let tries = 0;
      let ejecDirec = new THREE.Vector3(
        playerModel.mesh.position.x - colidable._pos.x,
        0,
        playerModel.mesh.position.z - colidable._pos.z
      );
      ejecDirec.normalize();
      ejecDirec.x *= 0.02;
      ejecDirec.z *= 0.02;
      while (MATHS.distance2D(new THREE.Vector2(
      playerModel.mesh.position.x, playerModel.mesh.position.z), 
      new THREE.Vector2(colidable._pos.x, colidable._pos.z)) < 
      colidable.hitbox.radius + 0.5){
        tries++;
        if (tries == 10){
          break;
        }
        playerModel.mesh.position.x += ejecDirec.x;
        playerModel.mesh.position.z += ejecDirec.z;
        playerBoundingBox.setFromObject(playerModel.mesh);
      }
    }
  });
  ...
}
```
{% endtab %}

{% tab title="Maths.js" %}
```javascript
export function distance(pointA, pointB){
  const A = (pointA.x - pointB.x) * (pointA.x - pointB.x);
  const B = (pointA.y - pointB.y) * (pointA.y - pointB.y);
  const C = (pointA.z - pointB.z) * (pointA.z - pointB.z);
  return Math.sqrt(A + B + C);
}

export function distance2D(pointA, pointB){
  const A = (pointA.x - pointB.x) * (pointA.x - pointB.x);
  const B = (pointA.y - pointB.y) * (pointA.y - pointB.y);
  return Math.sqrt(A + B);
}
```
{% endtab %}
{% endtabs %}

{% embed url="https://youtu.be/LAhYMTKCaRM" %}

### Challenges

I had some issues with creating the collisions and had many errors where frames would take forever to process so I added a 'kill switch' to the loop that stopped the collision ejection if it went on too long so that frames would eventually load. It mainly came down to few mistypes in my distance function that stretched out the hitboxes to be oblong.

I also faced problems with scope in the THREEDModel class which is why the constructor creates a  class variable, which is copied exactly into a new variable by load() and then load uses the new variable instead.

Another issue with THREEDmodels is that their model may not load in on the first frame, when the rest of the code is running. Although this did not cause me too many issues in this cycle, it may be an issue in future ones.

## Testing

| Test | Instructions                         | What I expect                                                                               | What actually happens                                        |
| ---- | ------------------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1    | Run code                             | No bugs or crashes / errors. Frames don't take forever to load. Textures appear on objects. | As expected                                                  |
| 2    | Walk into cylinder collider          | Pushed away as if there was an invisible cylinder blocking the player.                      | Cylinder is present but is stretched and oblong in its shape |
| 2.1  | Walk into cylinder collider (retest) | " "                                                                                         | As expected. Cylinder is now regular in diameter.            |
