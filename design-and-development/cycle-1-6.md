# 2.2.6 Cycle 6 - Combat I (Fundamentals)

### Design

The main focus point of my game is in combat so having a simple base for the combat system will help to give every combat encounter a simple base. Attacks will not come out immediately so that the player will have to decide if an attack is safe to perform or not, making combat more interesting than mashing left click.

## Objectives

* [x] Add damageable enemies
* [x] Add a system for quickly adding new attacks to the game
* [x] Allow the player to attack
  * [x] This should prevent other animations
  * [x] Attacks should have some wind up to them
* [x] Damageable enemies and objects are removed from the scene when they lose all of their hit points

### Key Variables

| Variable Name   | Use                                                            |
| --------------- | -------------------------------------------------------------- |
| playerState     | The state the player is in                                     |
| animationLock   | Can the player change animation?                               |
| class combatant | Anything that can damage and be damaged                        |
| class attack    | Stores a move a combatant can perform, also checks if it hits. |

## Development

### Outcome

This cycle is important because it's mechanics are the main focus point of my game. I started by creating two classes, Something to damage and something to damage with. Combatants will be enemies and they take damage, check for detection and have the base stats that the enemy AI's will use. I plan to have reusable AI scripts which all are fed a Combatant and then added to the scene. Attacks have base stats and functions for each type of attack that can register. The function is called each frame to check for collisions between the weapon and the enemy.

![Simplified diagram, weapons will use many more hitboxes and they will all be smaller too.](<../.gitbook/assets/image (2) (2) (1).png>)

The function casts a ray in the specified direction and then places sphere colliders, a point that checks for other points in range, on it. Multiple spheres are used to give length to the weapon. The weapon also has a list of all enemies it has hit which is cleared at the start of a swing to prevent hitting an enemy multiple times with an attack.

{% tabs %}
{% tab title="Main.js" %}
```javascript
class Combatant {
  constructor(model, hp, spd, detec, acuteDetec, attacks, name){
    this.name = name;
    this.model = model;
    this.hp = hp;
    this.speed = spd;
    this.attacks = attacks;
    this.state = "neutral";
    this.detectionDistance = detec;
    this.acuteDetctionDistance = acuteDetec;
    combatants.push(this);
    this.wasHit = false;
  }
}

class attack {
  constructor(windup, duration, total_angle, hitbox_radius, hitbox_points, damage, stun){
    this.windUp = windup;
    this.duration = duration;
    this.totalAngle = total_angle;
    this.hitboxDRadius = hitbox_radius;
    this.hitboxPoints = hitbox_points;
    this.hitbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    this.damage = damage;
    this.stun = stun;
    this.hasHit = [];
  }

  sweep(user, sweep_angle){ // called once per frame by attacking object
    user.rotation.y += sweep_angle - (this.totalAngle / 2); // rotate to angle
    let startVector = new THREE.Vector3(); // create vector
    user.getWorldDirection(startVector); // set it to new direction
    user.rotation.y -= sweep_angle - (this.totalAngle / 2); // reset rotation
    let _Points = [];
    this.hitboxPoints.forEach(point => {
      _Points.push(new THREE.Vector3(user.position.x + startVector.x * point, user.position.y + startVector.y * point, user.position.z + startVector.z * point));
    })
    combatants.forEach(combatant => {
      _Points.forEach(_point => {
        if (MATHS.distance(_point, combatant.model._pos) < this.hitboxDRadius && !MATHS.arrayContains(this.hasHit, combatant.name)){
          console.log("hit a target");
          this.hasHit.push(combatant.name);
        }
      })
    })
  }
}
```
{% endtab %}

{% tab title="Maths.js" %}
```javascript
export function arrayContains(array, item){ // not very mathsy but i can't think of a bette place to put it
  for(let i = 0; i < array.length; i++){
    if (array[i] == item){
      return true;
    }
  }
  return false;
}
```
{% endtab %}
{% endtabs %}

Something that will also be key to the animation system is the playerState variable. This tells the game what the player is currently doing without having to figure it out. Additionally, the playerState can be locked to make it so the player cannot 'cancel' an animation midway through playing it by inputting another key. Some games allow and encourage 'animation cancelling' in order to make combat flashy and fast but I will remove animation 'cancelling' as it can often make games 'button mashy' where a powerful tactic can be to press buttons without much skill or understanding an overpowering the enemy with volume of attack alone.&#x20;

The playerState variable is checked near the end of every frame and calls the sweep() method on the player's light attack every frame. It then increments a variable that counts how much time has elapsed over the course of the animation, which will be used for future calls of sweep().

Sweep() is being used as an example of an attack method. The class will contain many more attacking methods than just sweep() with some being specialised to a single enemy type or weapon. The class will also have to contain a way of selecting which is the appropriate method to use.

```javascript
let playerState = "neutral"; //neutral, roll, jump, fall, walk, run, light attack, heavy attack, block, stunned
let animationProgression = 0;
let animationLock = false;

render(){
  ...
  if (playerState == "light attack"){
      playerCombatant.lightAttack.sweep(playerModel.mesh, (animationProgression / playerCombatant.lightAttack.duration) * playerCombatant.lightAttack.totalAngle);
      animationProgression += FRAMETIME;
      if (animationProgression > playerCombatant.lightAttack.duration){
        animationLock = false;
        animationProgression = 0;
        combatants.forEach(combatant => {
          combatant.wasHit = false;
        })
      }
    }
    ...
}

document.addEventListener('click', e => {
  if (playerState == "neutral" || playerState == "walk"){
    console.log("click");
    playerState = "light attack";
    animationLock = true;
    playerCombatant.lightAttack.hasHit.forEach(item => {
      playerCombatant.lightAttack.hasHit.pop(item);
    })
  }
});
```

![When the player is close enough and can hit the stone head, we get a message saying that it was hit](<../.gitbook/assets/image (8) (1) (1).png>)

![For debug purposes, I made the player state their state every frame](<../.gitbook/assets/image (6).png>)

Next I need to add some more functionality to the attack, decrease the hp by a set amount - simple. When it reaches or falls below zero, it needs to be removed from view and preferably stopped from using resources. The simple solution is to remove it from all lists and then literally "sweep the model under the rug" by moving it to -500 on the y plane.

```javascript
class attack {
     sweep() {
          ...
          this.hasHit.push(combatant.name);
          console.log(combatant.hp);
          if (combatant.hp <= 0){
               console.log("yiperd");
               models[collidableModels.indexOf(combatant.model)].position.y = -500;
               combatant.model._pos.y = -500;
               combatants.pop(combatant);
          }
     }
}
```

![](<../.gitbook/assets/image (9) (1).png>)

{% embed url="https://youtu.be/fG_RgDv0CyM" %}

I need to add some wind up to the animation so that the player does not attack immediately, this would be far too powerful. As I already have a wind up stat built into the attacks, I just need to add a few things.

```javascript
render(){
    ...
    if (playerState == "light attack"){
      if (animationProgression > playerCombatant.lightAttack.windUp){
        playerCombatant.lightAttack.sweep(playerModel.mesh, ((animationProgression - playerCombatant.lightAttack.windUp) / playerCombatant.lightAttack.duration) * playerCombatant.lightAttack.totalAngle);
        if (animationProgression > playerCombatant.lightAttack.duration + playerCombatant.lightAttack.windUp){
          animationLock = false;
          animationProgression = 0;
          combatants.forEach(combatant => {
            combatant.wasHit = false;
          })
        }
      }
    ...
}
```

Lastly I will add a heavy attack that uses right click. This will require me to disable the right click context menu that normally appears when you right click but will mostly be the same as light attacks, just with a different name and different statistics.

```javascript
render(){
    ...
    } else if (playerState == "heavy attack"){
      if (animationProgression > playerCombatant.heavyAttack.windUp){
        playerCombatant.heavyAttack.sweep(playerModel.mesh, ((animationProgression - playerCombatant.heavyAttack.windUp) / playerCombatant.heavyAttack.duration) * playerCombatant.heavyAttack.totalAngle);
        if (animationProgression > playerCombatant.heavyAttack.duration + playerCombatant.heavyAttack.windUp){
          animationLock = false;
          animationProgression = 0;
          combatants.forEach(combatant => {
            combatant.wasHit = false;
          })
        }
      }
      animationProgression += FRAMETIME;
    }
    ...
}

window.addEventListener("contextmenu", e => {
  e.preventDefault();
  if (playerState == "neutral" || playerState == "walk"){
    console.log("r click");
    playerState = "heavy attack";
    animationLock = true;
    playerCombatant.lightAttack.hasHit.forEach(item => {
      playerCombatant.lightAttack.hasHit.pop(item);
    })
  }
})
```

### Challenges

I found getting attacks to work particularly hard because I started work on the system and then stopped to update my development log and fix some bugs and by time I returned I did not know where I had left of and how what functions and classes would interact with each other, what would handle what, what would register what, etc. I am glad that I stopped however as this allowed me to re-think my system. My new system is far better than the old system, where the weapon hitbox was defined by a single single box3. Box3's are defined by two points in space, the vertice with the lowest x, y and z values (min) and the vertice with the highest x, y and z values (max), then the computer infers the existence of a box using those two values. However, this is a flawed system that cannot take rotation (except in multiples of 90) into account. This would have left attacks that were directed at 45 degrees from a cardinal direction massive and those along a cardinal direction appropriately sized.

![](<../.gitbook/assets/image (5) (2).png>)

The first major issue I faced when I returned was trying to get the hitbox generation to work. As much of the work happens invisibly, it is hard to check and test so I had to run through the procedure myself to check for bugs and errors. I also had a bug where the enemy could be hit up to 17 times by an attack. I solved this by creating the list of what enemies a sing attack has hit and denying the game from registering a hit if they are already on the list.

## Testing

| Test | Instructions                                                                      | What I expect                                                                        | What actually happens                                                     |
| ---- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| 1    | light attack while facing enemy and very close                                    | takes 15 damage, new health is console logged                                        | As expected                                                               |
| 2    | light attack while facing enemy and distance is further that light attack's reach | takes no damage                                                                      | As expected                                                               |
| 3    | light attack while not facing enemy and very close                                | Will hit if not facing by a few degrees, will not hit if more than 45 degrees        |  As expected                                                              |
| 4    | heavy attack while facing enemy and very close                                    | takes 35 damage, new health is console logged                                        | As expected                                                               |
| 5    | heavy attack while facing enemy and further than attack's reach                   | takes no damage                                                                      | As expected                                                               |
| 6    | heavy attack while not facing enemy and very close                                | Will hit if not facing by a few degrees, will not hit if more than around 15 degrees | As expected                                                               |
| 7    | try to attack while in different animations                                       | can only attack while walking or standing still                                      | As expected but game also freezes up after trying to attack while falling |
| 8    | Repeat " "                                                                        | no longer freezes up while trying to attack while falling                            | As expected                                                               |
