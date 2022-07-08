# Cycle 6 - Combat

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

![](<../.gitbook/assets/image (2).png>)

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

### Challenges

Description of challenges

## Testing

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |
