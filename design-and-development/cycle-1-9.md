# 2.2.9 Cycle 9 - Combat IV        (Player Death)

### Design

The player needs to be able fail or the game will not have any stakes. The player also needs to be able to keep playing however so that they can give encounters another go. Having respawn points be something the player has to physically seek out encourages exploration and means they can be used as a reward for surpassing a certain challenge. If respawn points are too spaced out the game will feel unfair, too generous will make the game trivial.

## Objectives

* [x] Have enemies stop trying to attack player when the player dies
* [x] Allow the player to use respawn points...
  * [x] ...and have them respawn there upon death
* [x] Create a textEvent manager that puts text onto the screen
  * [x] Have one for death
  * [x] Have one for activating a respawn point

### Key Variables

| Variable Name            | Use                                                                              |
| ------------------------ | -------------------------------------------------------------------------------- |
| class InteractableObject | Inherited by any object the player can interact with by pressing e in proximity. |
| class respawnPoint       | The modifies the respawn location of the player when interacted with.            |
| RespawnPoint             | The current respawn point to use when the player dies.                           |

## Development

### Outcome

As combatants are removed from the list of active combatants upon death already, preventing the AIs from giving the enemies instructions and making them not attack the dead player. To start development of respawning, I decided to start by making the points at which the player would interact to respawn. As the code for determining interactions was simple (if pressing e and in range) I converted it to a class called interractableObject which more specific classes such as respawn points, doors and switches would inherit from.

```javascript
class interactableObject{ // exists only to be inherited
  constructor(_model, _range){
    this.model = _model;
    this.range = _range;
    this.canBeInterracted;
  }

  checkInRange(){  //called to check if pressing e will do anything
    if (MATHS.distance(this.model._pos, playerModel.mesh.position) < this.range){
      this.canBeInterracted = true;
    } else{
      this.canBeInterracted = false;
    }
  }
}

class respawnPoint extends interactableObject { // an object that updates the player's respawn point
  constructor(_model, _range, _encounters, resPoint){
    super(_model, _range);
    this.playerSpawningAt = false;
    this.encounters = _encounters; // list of structures
    this.respawnPoint = resPoint;
    respawnPoints.push(this);
  }

  save(){ // does all of the logic needed when the player presses e near a banner
    this.checkInRange();
    if (this.canBeInterracted){
      respawnStandard = this;
      playerCombatant.hp = 100;
      console.log("saved spawn at: (" + this.respawnPoint.x.toString() + ", " + this.respawnPoint.y.toString() + ", " + this.respawnPoint.z.toString() + ")");
    }
  }
}
```

<figure><img src="../.gitbook/assets/image (2) (3).png" alt=""><figcaption><p>The player using a banner. The text on screen and the console both show the player's save has been stored.</p></figcaption></figure>

Upon getting injured, the combatant class checks to see if this damage is lethal for the combatant. I added a section where, if it is, it then checks if the combatant is the player and resets the positions of all enemies and their health. It also revives enemies if they have died. It then moves the player to the location of the last respawn point the interacted with.

```javascript
class combatant{
    ...
    hurt(damage, stun){
      ...
      if (this.hp <= 0){
        ...
        if (this.name == "player"){ //we need to reset everything
          combatants.forEach(_combatant => {
            _combatant.model._pos.set(_combatant.spawnPos.x, _combatant.spawnPos.y, _combatant.spawnPos.z);
            _combatant.model._model.position.set(_combatant.spawnPos.x, _combatant.spawnPos.y, _combatant.spawnPos.z);
            _combatant.hp = _combatant.maxHP;
            _combatant.state = "neutral";
          })
          desceased.forEach(_combatant => {
            _combatant.revive();
          });
          desceased.shift(desceased.length);
          playerModel.mesh.position.set(respawnStandard.respawnPoint.x, respawnStandard.respawnPoint.y, respawnStandard.respawnPoint.z);
        }
      ...
    }
  ...
}
```

To make the player's death immediately clear, I will have it display on the screen. I used an object to manage all of the text that appears on screen similar to this e.g. locations, deaths, boss defeats.

{% tabs %}
{% tab title="Script.js" %}
```javascript
const titleText = document.createElement("h1"); // text that will be used for titles
titleText.textContent = "";
document.body.appendChild(titleText);
const TitleTextManager = {
  durationLeft: 0,
  setTitle: function(text, duration){
    titleText.textContent = text;
    this.durationLeft = duration;
  },
  update: function(){ // 
    if(this.durationLeft > 0){
      this.durationLeft -= FRAMETIME;
    } else{
      if (titleText.textContent == "You Died"){
        respawnPlayer();
      }
      titleText.textContent = "";
    }
  },
}
```
{% endtab %}

{% tab title="Style.css" %}
```css
h1 {
    z-index: 10000;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -60%);
    font-size: 700%;
    font-family: Cinzel-Regular;
    color: floralwhite;
}
```
{% endtab %}
{% endtabs %}

<figure><img src="../.gitbook/assets/image (4) (3).png" alt=""><figcaption></figcaption></figure>

<figure><img src="../.gitbook/assets/image (8) (1).png" alt=""><figcaption></figcaption></figure>

### Challenges

Resetting alive enemies proved to be troublesome, one amusing bug had all alive enemies become twice as fast and have their animations play twice as fast - eventually getting to a point where the player dies mere frames after respawning.

I also had issues with respawning the player while the 'You Died' was on the screen, leading to bugs with the player still being able to input during certain edge cases.

## Testing

| Test | Instructions                                                       | What I expect                                                                                                                         | What actually happens                                                                |
| ---- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1    | Press e at different distances to a respawn point                  | At close distances where the player is nearly touching, it gives a message confirming it has saved. At further distances it does not. | As expected                                                                          |
| 2    | Save at a respawn spot, then die to an enemy and respawn.          | Respawn at the respawn spot. All enemies have moved back to their place and are at full health.                                       | As expected. However, enemies that did not die become twice as fast until they die.  |
| 3    | Save at a respawn spot, then die to an enemy and respawn. (retest) | Respawn at the respawn spot. All enemies have moved back to their place and are at full health.                                       | As expected                                                                          |
| 4    | Kill an enemy then die to another                                  | The killed enemy has respawned at its position.                                                                                       | As expected                                                                          |
