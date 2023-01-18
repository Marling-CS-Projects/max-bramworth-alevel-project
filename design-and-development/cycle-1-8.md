# 2.2.8 Cycle 8 - Combat III (Enemies)

### Design

Enemies should have variety in order to stop encounters from feeling all the same. This goes beyond giving them different numbers and different enemies should act differently too.

## Objectives

* [x] Allow enemies to detect the player in range
* [x] Allow enemies to move to the player or any other location based on their AI
* [x] Let enemies decide when and in what direction to perform an attack
  * [x] The attack should be able to hit the player and fellow enemies (should already be functional but we can only really check now)
* [x] Allow enemies to pick from a specified range of attacks
  * [x] Have the enemy use some logic to determine the attack (proximity, attack pattern, shuffled random)
* [x] Disable enemy AI upon death

### Key Variables

| Variable Name             | Use                                                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| meleeSimple               | AI object for any enemy whose battle plan is no more complicated than run at the player and attack when in range. |
| .Update, .OnAlerted, etc. | Commonly named functions between all AI's that are uniquely coded that run on certain conditions.                 |

## Development

### Outcome

The first action I took for this cycle was to determine the architecture of how the enemies' AI would function and interact with the rest of the world. I decided on a system where the enemy classes would hold all of the base stats and important calculations e.g. pathfinding. Essentially, enemy classes only hold what is common between all enemies. The AI objects are all coded from the ground up, every one being unique. However, the AI object gives instructions not to a specific enemy but all loaded enemies of its type. It contains the 'thoughts' of the enemy such as: move to 1.25 units away from the player and then attack with a stab. AIs are mostly interchangeable and changing the AI that governs a particular enemy will only serve to change its behaviour.

This system is mostly inspired by the one used in Terraria, which I used because it was simple, yet allowed for an incredibly large set of unique feeling enemies.

![a brief depiction of the system diagram](<../.gitbook/assets/image (1) (2).png>)

Firstly, I will be making the player detection. Player detection will use a raycast from the enemy to the player. If it doesn't hit anything on its way to the player and it's length is less than the specified detection distance value, then the player has been spotted and the enemy becomes alert.

```javascript
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

I decided to start work on the AI and the enemy pathing at the same time because making the enemy move would, in the future, be controlled by their AI so if I wrote it to not use one now, I would have to re-write it later. For this, I also added multiple functions to the combatant class such as update(), which does things the enemy needs to do every frame such as reduce timers, check their state and calculate their facing direction.

```javascript
...

const meleeSimple = { // AI that runs at player when in view
  onUpdate: function(self){
    self.update();
  },
  whileAlerted: function(self){
    console.log("can see!");
    self.move(new THREE.Vector3(playerModel.mesh.position.x - self.model._pos.x, playerModel.mesh.position.y - self.model._pos.y, playerModel.mesh.position.z - self.model._pos.z));
  }
}

...

function render(){
  ...
  
  combatants.forEach(combatant => {
    if (combatant.name != "player"){ // the player isn't an AI (probably) so don't control them
      combatant.AI.onUpdate(combatant);
      combatant.canSpotPlayer(combatant.model._pos, playerModel.mesh.position);
      if (combatant.alerted){
        combatant.AI.whileAlerted(combatant);
      }
    }
  })
  
  ...
}
```

I then made the enemy simply move along the vector towards the player. Some enemies in the future may require some more complicated algorithms but most enemies will be fought in open rooms anyway so it may overcomplicate things to do now.

```javascript
class Combatant{
    ...
    move(direction){ // called every frame while player is in view to move model
    if(this.state == "neutral" || this.state == "walking"){
      this.state = "walking";
      direction.y = 0;
      direction.normalize();
      this.model._pos.addVectors(direction.multiplyScalar(this.speed), this.model._pos);
      this.model._model.position.set(this.model._pos.x, this.model._pos.y, this.model._pos.z);
    }
  }
  ...
}
```

We set the y component of the move vector to 0 so the enemy cannot fly to reach the player.

![The enemy now moves to whenever the player gets too close](<../.gitbook/assets/image (3) (3).png>)

As I already had some work on the AIs done, I decided to next move on to teaching the AI to be able to attack the player. This would all be different for every AI but for the meleeSimple, all it needs to do is perform it's attack when it gets close enough in the direction of the player.

```javascript
const meleeSimpleStabber = { // AI that runs at player when in view
  onUpdate: function(self){
    self.update();
    if (self.state == "attacking" && self.attackCD <= 0){
      if (self.animationProgression > self.attacks[0].windUp){
        self.attacks[0].attack(self.model._pos, self.model._rot.y,
          ((self.animationProgression - self.attacks[0].windUp) / self.attacks[0].duration) * self.attacks[0].totalAngle,
          new THREE.Vector3(self.right.x * -0.15, 0, self.right.z * -0.15));
        if (self.animationProgression > self.attacks[0].duration + self.attacks[0].windUp){
          self.animationProgression = -FRAMETIME;
          self.state = "neutral";
          self.attackCD = 0.75;
        }
      } else{
        self.attacks[0].prepareWeapon(self.animationProgression / self.attacks[0].windUp, self.right, self.model._pos, self.model._rot);
      }
      self.animationProgression += FRAMETIME;
    }
  },
  whileAlerted: function(self){
    self.move(new THREE.Vector3(playerModel.mesh.position.x - self.model._pos.x, playerModel.mesh.position.y - self.model._pos.y, playerModel.mesh.position.z - self.model._pos.z), 2);
    if ((self.state == "neutral" || self.state == "walking") && self.attackCD <= 0 && MATHS.distance(self.model._pos, playerModel.mesh.position) < 2){
      self.state == "attacking";
      self.animationProgression = 0.001;
      self.attacks[0].hasHit.forEach(item => {
        self.attacks[0].hasHit.pop(item);
      })
    }
  }
}
```

I also decided it was time to replace the default model and weapon. I want the first area of my game to be a swamp / bayou so the common enemy the player would encounter there would be undead fishermen. Untrained and unprepared for combat, they use their fishing harpoons as improvised weapons.

![A clothed version of the default human model with some decay added to sell the undead feel.](<../.gitbook/assets/image (1) (3).png>)

![The harpoon's reach will often catch newer players off guard but its lengthy animation time gives the player plenty of time to retaliate.](<../.gitbook/assets/image (10) (1) (1).png>)

### Challenges

My first issue was with enemy player detection and I had a minor issue where the ray that was cast by an enemy at the player wouldn't collide with any walls on the way but would then pass through the player and collide with a wall behind them. The game would then say meant that the player was hiding behind that wall, rather than the wall being behind that player. I fixed this by simply adding a check as to if the wall was closer in distance than the player was.

## Testing

| Test | Instructions                                                     | What I expect                                                                                                    | What actually happens                           |
| ---- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1    | Move around map, changing distance and cover protection          | When too far away, undetected. When behind cover, undetected. When neither, detected.                            | Player is always considered hiding behind cover |
| 2    | Move around map, changing distance and cover protection (retest) | When too far away, undetected. When behind cover, undetected. When neither, detected.                            | As expected                                     |
| 3    | Move towards enemy                                               | Moves towards the player model when close enough.                                                                | As expected                                     |
| 4    | Get in alerted range, then move side to side                     | Rotation of enemy model tracks to face the player.                                                               | Works between bearings of 0-90 and 180-270      |
| 5    | Get in alerted range, then move side to side (retest)            | Rotation of enemy model tracks to face the player.                                                               | As expected                                     |
| 6    | Let the enemy approach                                           | Gets up to 2 units from the player and then stops and attacks. Attack will hit and deal 35 damage to the player. | As expected                                     |
| 7    | Reduce the enemy's health to 0                                   | AI turns off                                                                                                     | As expected                                     |
