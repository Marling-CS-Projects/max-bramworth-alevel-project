# 2.2.6 Cycle 6 - Combat

## Design

* [x] Add damageable enemies
* [x] Add a system for quickly adding new attacks to the game
* [x] Allow the player to attack
  * [x] This should prevent other animations
  * [ ] Attacks should have some wind up to them
* [ ] Damageable enemies and objects are removed from the scene when they lose all of their hit points

### Key Variables

| Variable Name | Use                   |
| ------------- | --------------------- |
| foo           | does something useful |

## Development

### Outcome

This cycle is important because it's mechanics are the main focus point of my game. I started by creating two classes, Something to damage and something to damage with. Combatants will be enemies and they take damage, check for detection and have the base stats that the enemy AI's will use. I plan to have reusable AI scripts which all are fed a Combatant and then added to the scene. Attacks have base stats and functions for each type of attack that can register. The function is called each frame to check for collisions between the weapon and the enemy.

![Simplified diagram, weapons will use many more hitboxes and they will all be smaller too.](<../.gitbook/assets/image (2).png>)

The function casts a ray in the specified direction and then places sphere colliders, a point that checks for other points in range, on it. Multiple spheres are used to give length to the weapon. The weapon also has a list of all enemies it has hit which is cleared at the start of a swing to prevent hitting an enemy multiple times with an attack.

{% tabs %}
{% tab title="Main.js" %}
```
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
          console.log("he got jimmy jammed ඞ");
          this.hasHit.push(combatant.name);
        }
      })
    })
  }
}
```
{% endtab %}

{% tab title="Maths.js" %}
```
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

```
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

### Challenges

I found getting attacks to work particularly hard because I started work on the system and then stopped to update my development log and fix some bugs and by time I returned I did not know where I had left of and how what functions and classes would interact with each other, what would handle what, what would register what, etc. I am glad that I stopped however as this allowed me to re-think my system. My new system is far better than the old system, where the weapon hitbox was defined by a single single box3. Box3's are defined by two points in space, the vertice with the lowest x, y and z values (min) and the vertice with the highest x, y and z values (max), then the computer infers the existence of a box using those two values. However, this is a flawed system that cannot take rotation (except in multiples of 90) into account. This would have left attacks that were directed at 45 degrees from a cardinal direction massive and those along a cardinal direction appropriately sized.

![](<../.gitbook/assets/image (5).png>)

The first major issue I faced when I returned was trying to get the hitbox generation to work. As much of the work happens invisibly, it is hard to check and test so I had to run through the procedure myself to check for bugs and errors. I also had a bug where the enemy could be hit up to 17 times by an attack. I solved this by creating the list of what enemies a sing attack has hit and denying the game from registering a hit if they are already on the list.

## Testing

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |
