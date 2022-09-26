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

| Variable Name | Use                   |
| ------------- | --------------------- |
| foo           | does something useful |

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

Using 179 lines of code, I created a world map for the player to explore.

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
