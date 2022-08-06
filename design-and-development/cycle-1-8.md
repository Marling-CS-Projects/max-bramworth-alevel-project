# 2.2.8 Cycle 8 - Combat III (Enemies)

## Objectives

* [x] Allow enemies to detect the player in range
* [ ] Allow enemies to find a path to the player that does not cross obstacles
  * [ ] Using A\*
* [ ] Let enemies decide when and in what direction to perform an attack
  * [x] The attack should be able to hit the player and fellow enemies (should already be functional but we can only really check now)
* [ ] Allow enemies to pick from a specified range of attacks
  * [ ] Have the enemy use some logic to determine the attack (proximity, attack pattern, shuffled random)
* [ ] Disable enemy AI upon death

### Key Variables

| Variable Name | Use                   |
| ------------- | --------------------- |
| foo           | does something useful |

## Development

### Outcome

The first action I took for this cycle was to determine the architecture of how the enemies' AI would function and interact with the rest of the world. I decided on a system where the enemy classes would hold all of the base stats and important calculations e.g. pathfinding. Essentially, enemy classes only hold what is common between all enemies. The AI objects are all coded from the ground up, every one being unique. However, the AI object gives instructions not to a specific enemy but all loaded enemies of its type. It contains the 'thoughts' of the enemy such as: move to 1.25 units away from the player and then attack with a stab. AIs are mostly interchangeable and changing the AI that governs a particular enemy will only serve to change its behaviour.

This system is mostly inspired by the one used in Terraria, which I used because it was simple, yet allowed for an incredibly large set of unique feeling enemies.

![a brief depiction of the system diagram](<../.gitbook/assets/image (1).png>)

This is useful but I will not immediately begin work on the AI, first I will need to make the player detection and pathfinding work.

Player detection will use a raycast from the enemy to the player. If it doesn't hit anything on its way to the player and it's length is less than the specified detection distance value, then the player has been spotted and the enemy becomes alert.

```
class Combatant {
  ...
  canSpotPlayer(playerPos, origin){
    this.alerted = true;
    const playerdist = MATHS.distance(origin, playerPos);
    if (playerdist > this.detectionDistance){
      this.alerted = false;
      console.log("could not see player (too far away!)");
    } else{
      let dirToPlayer = new THREE.Vector3(playerPos.x - origin.x, playerPos.y - origin.y, playerPos.z - origin.z);
      dirToPlayer.normalize();
      const eyesight = new Ray(origin, dirToPlayer);
      collidableWalls.forEach(wall =>{
        if (eyesight.intersectsBox(wall.boundingBox) && MATHS.distance(wall.cube.mesh.position, origin) < playerdist){
          this.alerted = false;
          console.log("could not see player (hiding behind wall!)");
       }
      })
      if (this.alerted){
        console.log("can see player!");
      }
    }
  }
}

function render(){
  ...
  combatants.forEach(combatant => {
    if (combatant.name != "player"){ // the player isn't an AI (probably) so don't control them
      combatant.canSpotPlayer(combatant.model._pos, playerModel.mesh.position);
    }
  })
  ...
}
```

{% embed url="https://youtu.be/1uSPpVLUwAI" %}
Somewhere in the sea of the console messages, you can see it working
{% endembed %}

To start my development on the A\* pathfinding, I first created a system for creating nodes to be used on the fly. This will be run on game launch and whenever a new area is loaded. A\* works best with lots of nodes, densely packed together. My nodes are distributed in a square grid with distances of 1 between nodes and about 1.4 diagonally. I also created a quick 'dev tool' to help me identify where nodes were.

{% tabs %}
{% tab title="First Tab" %}

{% endtab %}

{% tab title="Second Tab" %}
```
import * as THREE from "./node_modules/three/build/three.module.js";
import * as MATHS from "./mathsStuff.js";

let nodes = [];

class Node{
    constructor(_pos){
        this.pos = _pos;
        this.walkable = true;
        this.f = 0; // g + h (value of tile)
        this.g = 0; // path to start total distance
        this.h = 0; // distance to end (not as the crow flies)
        this.neighbours = [];
        nodes.push(this);
    }

    getCosts(startPos, endPos, inheritedGCost){
        this.g = inheritedGCost + MATHS.distance2D(new THREE.Vector2(this.pos.x, this.pos.z), new THREE.Vector2(startPos.x, startPos.z));
        const xdif = Math.abs(endPos.x - this.pos.x);
        const zdif = Math.abs(endPos.z - this.pos.z);
        this.h = Math.abs(xdif - zdif) + Math.min(xdif, zdif) * Math.SQRT2; // find out our weird A* distance
        this.f = this.g + this.h;
    }

    getNeighbours(){
        nodes.forEach(node => {
            if (MATHS.distance(node.pos, this.pos) < 1.5){
                this.neighbours.push(node);
            }
        });
    }
}

export function checkNodeWalkabilities(walls){
    nodes.forEach(node => {
        for (let i = 0; i < walls.length; i++){
            if (walls[i].boundingBox.containsPoint(node.pos)){
                node.walkable = false;
                i = walls.length; // no need to keep checking - this node isn't going to get unblocked
            }
        }
    });
}

export function genNodes(floors){
    console.log("generating nodes...");
    let startCorner = new THREE.Vector3(0, 0, 0);
    let nodeNo = 0;
    floors.forEach(floor => {
        startCorner = new THREE.Vector3(floor.boundingBox.min.x, floor.boundingBox.max.y + 0.02, floor.boundingBox.min.z);
        console.log(floor.cube.mesh.scale.x);
        for (let x = 0; x < floor.cube.mesh.scale.x; x++) {
            for (let z = 0; z < floor.cube.mesh.scale.z; z++) {
                nodes.push(new Node(new THREE.Vector3(startCorner.x + x, startCorner.y, startCorner.z + z)));
                console.log("created node at: " + nodes[nodes.length - 1].pos.x + ", " + nodes[nodes.length - 1].pos.y + ", " + nodes[nodes.length - 1].pos.z);
                nodeNo++;
            }
        }
    });
    console.log("finished making " + nodeNo + " nodes");
}

export function getNode(num){
    return nodes[num];
}
```
{% endtab %}
{% endtabs %}

![The sphere shows where a pathfinding node is](../.gitbook/assets/image.png)

![Pressing e allows me to cycle to another node](<../.gitbook/assets/image (3).png>)



### Challenges

My first issue was with player detection and I had a minor issue where the ray that was cast at the player wouldn't collide with any walls on the way to but would then pass through the player and collide with a wall, which the game would then say meant that the player was hiding behind that wall, rather than the wall being behind that player. I fixed this by simply adding a check as to if the wall was closer in distance than the player was.

## Testing

| Test | Instructions                                                     | What I expect                                                                          | What actually happens                           |
| ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1    | Move around map, changing distance and cover protection          | When too far away, undetected. When behind cover, undetected. When neither, detected.  | Player is always considered hiding behind cover |
| 2    | Move around map, changing distance and cover protection (retest) | When too far away, undetected. When behind cover, undetected. When neither, detected.  | As expected                                     |
