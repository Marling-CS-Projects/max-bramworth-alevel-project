# 2.2.11 Cycle 11 - Content Creation

### Design

In order to give the player something to do, I will need to add content for the player to explore.

## Objectives

* [x] Create all the content for the game, including:
  * [x] Terrain
  * [x] Enemies
    * [x] New Types
    * [x] Placements
  * [x] Objectives

### Key Variables

| Variable Name | Use                                        |
| ------------- | ------------------------------------------ |
| levers pulled | The number of levers that have been pulled |

## Development

### Outcome

Firstly, I used the interactable object to make a lever that, when pulled, opens a gate. When both are pulled it opens another.

```javascript
class lever extends interractableObject {
  constructor(_model, _rangle, text){
    super(_model, _rangle, text);
    this.activated = false;
    Levers.push(this);
  }

  pull(){
    this.checkInRange();
    if (this.canBeInterracted && !this.activated){
      leversPulled++;
      this.activated = true;
      TitleTextManager.setTitle(leversPulled.toString() + "/2", 3);
      this.model._model.rotation.y += Math.PI;
      if (leversPulled == 2){
        OpenGate("boss");
      } else if (leversPulled == 1){
        OpenGate("birm");
      }
    }
  }
}

...

function OpenGate(gate){
  if (gate == "birm"){
    Fallen_Capitalentrance.objects[13].cube.mesh.position.y = -500;
    Fallen_Capitalentrance.objects[13].boundingBox.setFromObject(Fallen_Capitalentrance.objects[13].cube.mesh);
    Fallen_Capitalentrance.models[1]._pos.y = -500;
    Fallen_Capitalentrance.models[1]._model.position.y = -500;
  } else if (gate == "boss"){
    entrance_hall_Immortal_Keep.objects[0].cube.mesh.position.y = -500;
    entrance_hall_Immortal_Keep.objects[0].boundingBox.setFromObject(entrance_hall_Immortal_Keep.objects[0].cube.mesh);
    entrance_hall_Immortal_Keep.models[0]._pos.y = -500;
    entrance_hall_Immortal_Keep.models[0]._model.position.y = -500;
    giantDefender.model._pos.y = 0;
    giantDefender.model._model.position.y = 0;
    giantDefender.spawnPos.y = 0;
  }
}
```

Using 179 lines of code, I created a world map for the player to explore. None of this was very interesting, mainly just the same lines of code over and over with some numbers tweaked.

<details>

<summary>The world code (long)</summary>

```
const starting_island_Greymarsh = new structure([
  new wall(new THREE.Vector3(-5, -1, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 1, 35), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //floor
  new wall(new THREE.Vector3(-5, 2, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 1, 35), new THREE.Vector3(0, 0.01, 0), false, "./grassig.png", "Greymarsh"), //area trigger
  new wall(new THREE.Vector3(-5, 1, -10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // behind wall
  new wall(new THREE.Vector3(-40, 1, -10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // behind wall
  new wall(new THREE.Vector3(-75, 1, -10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // behind wall
  new wall(new THREE.Vector3(15.25, 2.2, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 6, 35), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), // platform on left wall
  new wall(new THREE.Vector3(15.25, 3.2, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 6, 35), new THREE.Vector3(0, 0.01, 0), false, "./grassig.png", "Minch Common"),
  new wall(new THREE.Vector3(12.5, 1, 20), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 8, 65), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // left wall
  new wall(new THREE.Vector3(9.5, 1, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 0.5, 2), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), // slope left wall
  new wall(new THREE.Vector3(9.5, 1.5, 17), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 0.5, 2), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), // slope left wall
  new wall(new THREE.Vector3(9.5, 2, 19), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 0.5, 2), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), // slope left wall
  new wall(new THREE.Vector3(9.5, 2.5, 21), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 0.5, 2), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), // slope left wall
  new wall(new THREE.Vector3(-2.5, -1.5, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(40, 1, 40), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //slope to swamp
  new wall(new THREE.Vector3(-5, -2, 12.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(42.5, 1, 42.5), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //slope to swamp
  new wall(new THREE.Vector3(-38, -2.5, 40), new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 1, 100), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //swamp floor
  new wall(new THREE.Vector3(22.25, 8, 10), new THREE.Vector3(0, 0, -0.1), new THREE.Vector3(4, 6, 45), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), //left minch common
  new wall(new THREE.Vector3(10.25, 8, -8.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 6, 4), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // behind minch common
  new wall(new THREE.Vector3(15.25, 8, 29.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 6, 4), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // behind minch common
], [
  new THREEDModel(new THREE.Vector3(1, -0.5, 0), new THREE.Vector3(0, Math.PI, 0), new THREE.Vector3(0.2, 0.2, 0.2), 0.15, 2, "./red standard.glb"),
]);

const mcdonalds_Greymarsh = new structure([
  new wall(new THREE.Vector3(-42, -0.1, 32), new THREE.Vector3(0, 0, 0), new THREE.Vector3(9, 3, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // north wall
  new wall(new THREE.Vector3(-42, -0.1, 31.8), new THREE.Vector3(0, 0, 0), new THREE.Vector3(8.7, 3, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"), 
  new wall(new THREE.Vector3(-42, -0.1, 24.2), new THREE.Vector3(0, 0, 0), new THREE.Vector3(8.8, 3, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // south wall
  new wall(new THREE.Vector3(-42, -0.1, 24), new THREE.Vector3(0, 0, 0), new THREE.Vector3(9, 3, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-37.5, -0.1, 28), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(8, 3, 0.1), new THREE.Vector3(0.02, 0, 0.), false, "./wood.png"), // east wall
  new wall(new THREE.Vector3(-37.7, -0.1, 28), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(7.8, 3, 0.1), new THREE.Vector3(-0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-46.5, -0.1, 30.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.5, 3, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./wood.png"), // west wall
  new wall(new THREE.Vector3(-46.3, -0.1, 30.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.4, 3, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-46.5, -0.1, 25.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.5, 3, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./wood.png"),
  new wall(new THREE.Vector3(-46.3, -0.1, 25.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.4, 3, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-46.4, -0.1, 28.525), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 3, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"), // seal off the wall loops
  new wall(new THREE.Vector3(-46.4, -0.1, 26.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 3, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"),
], [
  new THREEDModel(new THREE.Vector3(-62, -2, 10), new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 1, 1), 0.5, 15, "./tree.glb"),
  new THREEDModel(new THREE.Vector3(-43, -2, 40), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), 0.5, 15, "./tree.glb"),
  new THREEDModel(new THREE.Vector3(-40, -2, 28), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 0.5, 0.5), 0.5, 15, "./lever.glb")
]);

const second_island_Greymarsh = new structure([
  new wall(new THREE.Vector3(-25, -2, 80), new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 1, 35), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //floor
  new wall(new THREE.Vector3(-30, -1.5, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 1, 15), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //slope1
  new wall(new THREE.Vector3(-25, -1, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 1, 15), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //slope2
  new wall(new THREE.Vector3(-20, -0.5, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 1, 15), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //slope3
  new wall(new THREE.Vector3(-15, 0, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 1, 15), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //slope4
  new wall(new THREE.Vector3(0, 0.5, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 15), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //top floor
  new wall(new THREE.Vector3(-25, -2.1, 82.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 3, 1), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //slope2wall
  new wall(new THREE.Vector3(-20, -1.6, 82.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 3, 1), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //slope3wall
  new wall(new THREE.Vector3(-15, -1.1, 82.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 3, 1), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //slope4wall
  new wall(new THREE.Vector3(-6.25, -0.6, 82.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(12.5, 3, 1), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //top floor wall1
  new wall(new THREE.Vector3(6.25, -0.6, 82.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(12.5, 3, 1), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //top floor wall2
  new wall(new THREE.Vector3(12.5, 1, 80), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 8, 35), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // wall by gate to Toronto
], [
  new THREEDModel(new THREE.Vector3(-5, -1.5, 60), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1), 0.5, 15, "./tree.glb"),
  new THREEDModel(new THREE.Vector3(1, 2, 92), new THREE.Vector3(0, -1, 0), new THREE.Vector3(1, 1, 1), 0.5, 15, "./tree.glb"),
])

const random_island_Greymarsh = new structure([
  new wall(new THREE.Vector3(-90, 1, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 8, 45), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), // right wall
  new wall(new THREE.Vector3(-90, 1, 55), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 8, 45), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"),
  new wall(new THREE.Vector3(-90, 1, 85), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 8, 15), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"),
  new wall(new THREE.Vector3(-80, -2, 60), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 1, 20), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(-5, 1, 100), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 5), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // far wall left
  new wall(new THREE.Vector3(-40, 1, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 2), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // far wall mid
  new wall(new THREE.Vector3(-44, 1, 92), new THREE.Vector3(0, 0, 0), new THREE.Vector3(41, 8, 2), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // far wall mid back
  new wall(new THREE.Vector3(-22.9, 1, 91), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 8, 3.9), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), // far wall secret wall seal
  new wall(new THREE.Vector3(-75, 1, 91), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 3), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // far wall right
  new wall(new THREE.Vector3(-40, 1, 100), new THREE.Vector3(0, 0, 0), new THREE.Vector3(35, 8, 5), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // far wall right secret
], [])

const entrance_hall_Immortal_Keep = new structure([
  new wall(new THREE.Vector3(50, 1.4, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 4, 6), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png", "inv"), // portcullis wall
  new wall(new THREE.Vector3(14, -3.5, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),// slope to hall
  new wall(new THREE.Vector3(19, -3.25, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),// slope to hall
  new wall(new THREE.Vector3(24, -3, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),// slope to hall
  new wall(new THREE.Vector3(29, -2.75, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),// slope to hall
  new wall(new THREE.Vector3(34, -2.5, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),// slope to hall
  new wall(new THREE.Vector3(39, -2.25, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(5, 4, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"),// slope to hall
  new wall(new THREE.Vector3(37, 3, 50.5), new THREE.Vector3(-0.2, 0, 0), new THREE.Vector3(45, 10, 4), new THREE.Vector3(0, 0, 0.01), false, "./rock.png"),// left hand cliff
  new wall(new THREE.Vector3(37, 3, 64.5), new THREE.Vector3(0.2, 0, 0), new THREE.Vector3(45, 10, 4), new THREE.Vector3(0, 0, -0.01), false, "./rock.png"),// right hand cliff
  new wall(new THREE.Vector3(71.5, -2, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 4, 7), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), // main hall floor
  new wall(new THREE.Vector3(51.5, -2, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 4, 7), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), // main hall floor
  new wall(new THREE.Vector3(71.5, 8, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 4, 20), new THREE.Vector3(0, -0.01, 0), false, "./badtexture.png"), // main hall roof
  new wall(new THREE.Vector3(55.5, 8, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(12, 4, 20), new THREE.Vector3(0, -0.01, 0), false, "./badtexture.png"), // main hall roof
  new wall(new THREE.Vector3(54, 0.8, 57.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 4, 6), new THREE.Vector3(0, 0, 0), false, "./badtexture.png", "Undying Keep"), // area trigger
  new wall(new THREE.Vector3(82.5, 2.8, 55.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.6, 20), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png"), // back wall
  new wall(new THREE.Vector3(82.5, 2.8, 35.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.6, 20), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png"), // back wall
  new wall(new THREE.Vector3(61.5, 2.8, 52), new THREE.Vector3(0, 0, 0), new THREE.Vector3(23.9, 6.6, 5.5), new THREE.Vector3(0, 0, 0.02), false, "./badtexture.png"), // main hall left
  new wall(new THREE.Vector3(61.5, 2.8, 63), new THREE.Vector3(0, 0, 0), new THREE.Vector3(23.9, 6.6, 5.5), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), 
], [
  new THREEDModel(new THREE.Vector3(50, 0.8, 57.5), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0.3, 0.2, 0.3), 0.5, 15, "./portcullis.glb"),
])

const boss_Immortal_Keep = new structure([
  new wall(new THREE.Vector3(71.55, 2.8, 40.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.6, 28), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png"), // left wall 2nd cori
  new wall(new THREE.Vector3(71.55, 2.8, 63), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.6, 4), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png"), // banner right
  new wall(new THREE.Vector3(77, 2.8, 66.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(17, 6.6, 4), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), // banner back
  new wall(new THREE.Vector3(77, -2, 63), new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 4, 4), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), // banner floor
  new wall(new THREE.Vector3(77, -2, 40), new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 4, 28), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), // coridoor floor
  new wall(new THREE.Vector3(77, 8, 40), new THREE.Vector3(0, 0, 0), new THREE.Vector3(7, 4, 28), new THREE.Vector3(0, -0.01, 0), false, "./badtexture.png"), //coridoor roof
  new wall(new THREE.Vector3(77, -2, -4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(60, 4, 60), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), // boss hall floor
  new wall(new THREE.Vector3(77, 2.8, 28), new THREE.Vector3(0, 0, 0), new THREE.Vector3(17, 6.6, 4), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png", "bossBar"), // boss trigger
  new wall(new THREE.Vector3(77, 4, -34), new THREE.Vector3(0, 0, 0), new THREE.Vector3(60, 8, 1), new THREE.Vector3(0, 0, 0.02), false, "./badtexture.png"), // boss hall far wall
  new wall(new THREE.Vector3(60, 4, 26), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 8, 1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), // boss hall back wall left
  new wall(new THREE.Vector3(94, 4, 25.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 8, 1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), // boss hall back wall right
  new wall(new THREE.Vector3(47, 4, -4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 8, 60), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png"), // boss hall left wall
  new wall(new THREE.Vector3(107, 4, -4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 8, 60), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png"), // boss hall right wall
], [
  new THREEDModel(new THREE.Vector3(77, 0, 63.5), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0.2, 0.2, 0.2), 0.15, 2, "./red standard.glb")
])

const Fallen_Capitalentrance = new structure([
  new wall(new THREE.Vector3(-61.1, 1.4, 100), new THREE.Vector3(0, 0, 0), new THREE.Vector3(9, 1, 10), new THREE.Vector3(0, 0.01, 0), true, "./grassig.png"), //banner platform
  new wall(new THREE.Vector3(-61.1, 4.4, 105), new THREE.Vector3(0, 0, 0), new THREE.Vector3(9, 6, 1), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //wall far
  new wall(new THREE.Vector3(-64.1, 4.4, 102), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 6, 8), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), //wall left
  new wall(new THREE.Vector3(-58.1, 4.4, 102), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 6, 8), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), //wall left
  new wall(new THREE.Vector3(-40, -1.5, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-43, -1, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-46, -0.5, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-49, -0, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-52, 0.5, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-55, 1, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-58, 1.5, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-61, 2, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-64, 2.5, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope
  new wall(new THREE.Vector3(-66, 5, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 5), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png", "inv"), //gate
  new wall(new THREE.Vector3(-77, 3, 105), new THREE.Vector3(0, 0, 0), new THREE.Vector3(23, 1, 25), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance platform
  new wall(new THREE.Vector3(-77, 6, 117.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(23, 5, 1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png"), //left wall
  new wall(new THREE.Vector3(-77, 6, 93.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(23, 5, 3), new THREE.Vector3(0, 0, 0.02), false, "./badtexture.png"), //right wall
  new wall(new THREE.Vector3(-65.5, 6, 108), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 5, 22), new THREE.Vector3(-0.02, 0, 0), false, "./badtexture.png"), //close wall
  new wall(new THREE.Vector3(-88.5, 6, 102), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 5, 22), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png"), //far wall
  new wall(new THREE.Vector3(-85.5, 3.5, 115), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope 2
  new wall(new THREE.Vector3(-88.5, 4, 115), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope 2
  new wall(new THREE.Vector3(-91.5, 4.5, 115), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //entrance slope 2
], [
  new THREEDModel(new THREE.Vector3(-61, 2, 100), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0.2, 0.2, 0.2), 0.15, 2, "./red standard.glb"),
  new THREEDModel(new THREE.Vector3(-66, 4, 96), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0.1, 0.15, 0.1), 0.5, 15, "./portcullis.glb"),
])

const Fallen_Capitalmain = new structure([
  new wall(new THREE.Vector3(-91.5, 5.5, 115), new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 1, 5), new THREE.Vector3(0, 0.01, 0), false, "./badtexture.png", "Fallen Capital"), //trigger
  new wall(new THREE.Vector3(-118, 5, 100), new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 1, 50), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //platform
  new wall(new THREE.Vector3(-143, 7, 75), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 5, 100), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png", "inv"),
  new wall(new THREE.Vector3(-118, 5, 50), new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 1, 50), new THREE.Vector3(0, 0.01, 0), true, "./badtexture.png"), //platform 2
  new wall(new THREE.Vector3(-118, 10, 90), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 10, 10), new THREE.Vector3(0.02, 0, 0), false, "./badtexture.png", "inv"),
  new wall(new THREE.Vector3(-123, 10, 85), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 10, 1), new THREE.Vector3(0, 0, -0.02), false, "./badtexture.png", "inv"),
  new wall(new THREE.Vector3(-109, 9, 126), new THREE.Vector3(0, 0, 0), new THREE.Vector3(64, 10, 15), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), //back wall
  new wall(new THREE.Vector3(-91, 7, 87.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4.5, 5, 50), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // right wall
], [
  new THREEDModel(new THREE.Vector3(-143, 10, 65), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false), // house wall left
  new THREEDModel(new THREE.Vector3(-143, 10, 55), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-143, 10, 45), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-143, 10, 75), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-143, 10, 35), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-143, 10, 25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-143, 10, 85), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-143, 10, 95), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-138, 10, 25), new THREE.Vector3(0, Math.PI / -2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false), // house all far
  new THREEDModel(new THREE.Vector3(-128, 10, 25), new THREE.Vector3(0, Math.PI / -2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-118, 10, 25), new THREE.Vector3(0, Math.PI / -2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-108, 10, 25), new THREE.Vector3(0, Math.PI / -2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-98, 10, 25), new THREE.Vector3(0, Math.PI / -2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false),
  new THREEDModel(new THREE.Vector3(-123, 10, 95), new THREE.Vector3(0, Math.PI / -2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false), // random house close
  new THREEDModel(new THREE.Vector3(-123, 10, 85), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0.3, 0.4, 0.3), 0, 0, "./birmingham residence.glb", false), // random house far
])

const mcdonaldsFallen_Capital = new structure([
  new wall(new THREE.Vector3(-100, 8.2, 62), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 5, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // north wall
  new wall(new THREE.Vector3(-100, 8.2, 61.8), new THREE.Vector3(0, 0, 0), new THREE.Vector3(24.7, 5, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"), 
  new wall(new THREE.Vector3(-100, 8.2, 54.2), new THREE.Vector3(0, 0, 0), new THREE.Vector3(24.8, 5, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // south wall
  new wall(new THREE.Vector3(-100, 8.2, 54), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 5, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-112.5, 8.2, 60.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.5, 5, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./wood.png"), // west wall
  new wall(new THREE.Vector3(-112.3, 8.2, 60.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.4, 5, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-112.5, 8.2, 55.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.5, 5, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./wood.png"),
  new wall(new THREE.Vector3(-112.3, 8.2, 55.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.4, 5, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-87.7, 8.2, 60.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.5, 5, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./wood.png"), // east wall
  new wall(new THREE.Vector3(-87.5, 8.2, 60.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(3.4, 5, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-87.7, 8.2, 55.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.5, 5, 0.1), new THREE.Vector3(-0.02, 0, 0.), false, "./wood.png"),
  new wall(new THREE.Vector3(-87.5, 8.2, 55.25), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(2.4, 5, 0.1), new THREE.Vector3(0.02, 0, 0), false, "./wood.png"),
  new wall(new THREE.Vector3(-112.4, 8.2, 58.525), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 5, 0.1), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"), // seal off the wall loops
  new wall(new THREE.Vector3(-112.4, 8.2, 56.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.3, 5, 0.1), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-100, 5.4, 58), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 8), new THREE.Vector3(0, 0.01, 0), true, "./wood.png"), // floor
], [
  new THREEDModel(new THREE.Vector3(-90, 5.9, 58), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 0.5, 0.5), 0.5, 15, "./lever.glb")
]);
```

</details>

insert video of playthrough

### Challenges

The main challenge of this cycle was tedium. The solution I had to making and placing walls was very tedious to use and it could take hours of constant trial and error to make the world. I should have perhaps tried to make a way to create levels in another tool, e.g. Blender, and then find a way to automatically apply hitboxes to it.

I did also have issues with some of the AI's. The giant defender was tricky but his developments help lay the ground work for the other more complicated AIs, such as the boss who attacks in predetermined patterns.&#x20;

## Testing

| Test | Instructions                                              | What I expect                    | What actually happens |
| ---- | --------------------------------------------------------- | -------------------------------- | --------------------- |
| 1    | Enter Game                                                | All areas successfully load      | As expected           |
| 2    | Pull Greymarsh hut lever                                  | Gate to Capital Chapel opens     | As expected           |
| 3    | Pull Fallen Capital lever after previous test             | Gate to Undying Keep opens       | As expected           |
| 4    | Pull Fallen Capital lever without pulling Greymarsh lever | Nothing happens                  | As expected           |
| 5    | Try to walk through gate                                  | Get blocked by an invisible wall | As expected           |
