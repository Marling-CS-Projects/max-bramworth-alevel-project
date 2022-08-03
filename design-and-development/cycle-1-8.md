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

![a brief depiction of the system diagram](../.gitbook/assets/image.png)

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

### Challenges

My first issue was with player detection and I had a minor issue where the ray that was cast at the player wouldn't collide with any walls on the way to but would then pass through the player and collide with a wall, which the game would then say meant that the player was hiding behind that wall, rather than the wall being behind that player. I fixed this by simply adding a check as to if the wall was closer in distance than the player was.

## Testing

| Test | Instructions                                                     | What I expect                                                                          | What actually happens                           |
| ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1    | Move around map, changing distance and cover protection          | When too far away, undetected. When behind cover, undetected. When neither, detected.  | Player is always considered hiding behind cover |
| 2    | Move around map, changing distance and cover protection (retest) | When too far away, undetected. When behind cover, undetected. When neither, detected.  | As expected                                     |
