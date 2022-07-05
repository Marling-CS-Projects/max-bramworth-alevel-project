# 2.2.3 Cycle 3 - Collisions and jumping

## Design

### Objectives

* [x] Add a class for collidable walls
* [x] Detect collisions between the player and these walls
* [x] Respond to collisions to create the illusion of solid objects colliding
* [x] allow the player to jump

### Usability Features

### Key Variables

| Variable Name | Use                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wall          | A class containing the position, rotation and dimension of an ingame wall. From this a collision box is made and a direction to push the player on collision is made. |
| grounded      | can the player jump or not?                                                                                                                                           |
| colidables    | everything the player can collide with.                                                                                                                               |
| gravity       | moves the player downwards                                                                                                                                            |

### Pseudocode

```
create wall class:
    setup its position, rotation, scale, ejeDirection and isFloor
    
    exist():
        add self to scene
        create bounding box based off self
        add boundingbox to list of gameObjects


render:
    for every boundingbox:
        check if it intersects with the player
        if it does, move the player along the direction that that box says to
        move it in until it is no longer intersecting
        
    
```

## Development

### Outcome

### Challenges

Description of challenges

## Testing

Evidence for testing

### Tests

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |

### Evidence
