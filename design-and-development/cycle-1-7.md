# 2.2.7 Cycle 7 - Combat II (Animations and refactoring)

## Objectives

* [x] Add stab attacks that move out in a straight line instead of sweeping in front
* [x] Add some basic animation to attacking
  * [x] The animations must sync with the hitboxes and be near perfect
* [x] Re-write attacking functionality to let it work against the player
* [x] Have the player become a full on combatant instead of just acting like one

### Key Variables

| Variable Name | Use                   |
| ------------- | --------------------- |
| foo           | does something useful |

## Development

### Outcome

In order to give the player more choices in combat, I am now adding the 'stab' move. The stab will move in a straight line in front of the player and be offset by an amount. My current attacks system will make it very easy to add more attacks of complicated or simple shapes. The stab will cover less total area and take longer to perform but have a longer reach and will do more damage and stun enemies for longer.

![Credit to the base human model goes to Tidominer, licensed under Creative Commons](../.gitbook/assets/image.png)

### Challenges

This was a particularly tricky cycle for me as it involved a lot of code re-writing. My biggest issue was with a small part of setting up the player's combatant class. As it required a model, I decided now would also be a good time to make it so that THREEDmodel classes contained a variable pointing to their own model so that it could be animated in real time. This proved challenging because of some bizarre quirks involving scope within the GLTFLoader.load function.

![The issue](../.gitbook/assets/whatkeptmeupfor3hours.png)

My potentially overly complicated solution was to have the model save itself into an array and then create a constant in the load() function that was within the scope of the loader.load() function. Then, in the loader.load(), the model would send it's model to a function which would 'bounce it back' to the model, who could then modify this.\_model appropriately. The constant would point to the model's own position in the array, acting as a sender recipient.

```javascript
class THREEDModel {
  constructor(_pos, _rot, _scale, hitboxRadius, hitboxHeight, modelPathway){
    ...
    this._model = playerWeapon;
  }

  load(){
    ...

    collidableModels.push(this);
    const CMindex = collidableModels.length - 1;
    
    loader.load(this.modelPathway, function(gltf){
      ...
      bounceBackGLTFScene(gltf.scene, CMindex);
    });
  }

  set_Model(modul){
    this._model = modul;
  }
}

function bounceBackGLTFScene(scene, recipient){
  console.log("bouncing " + recipient.toString());
  collidableModels[recipient].set_Model(scene);
}
```

## Testing

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |
