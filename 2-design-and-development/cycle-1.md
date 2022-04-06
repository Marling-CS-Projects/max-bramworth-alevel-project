# 2.2.1 Cycle 1

## Design

### Objectives

In this cycle I will setup Kaboom.js and make sure I can locally host it. I will also create the foundations for the player's camera.

* [x] Successfully import Kaboom
* [x] Be able to locally host it on my computer
* [x] Have the Vertical and Horizontal positions of the objects on the camera represent a 3D view accurately
* [x] Let the player move the camera around using the mouse&#x20;

### Usability Features

### Key Variables

| Variable  | Function                                                                                                   |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| PlayerPos | Vector2 storing the player's position in the plane perpendicular to gravitational acceleration (x y plane) |
| PlayerZ   | Stores the player's height parallel to gravitational acceleration (z axis)                                 |
| PlayerRot | Stores the player's rotation about the z axis, resets when it exceeds 360 or falls below 0                 |
| "Obj"     | Anything that is rendered by the camera has this tag                                                       |
| pos       | Kaboom's inbuilt variable for an object's position, re-using this for position on screen                   |
| position  | Vector2 storing the object's position in the plane perpendicular to gravitational acceleration (x y plane) |
| zpos      | Stores the object's height parallel to gravitational acceleration (z axis)                                 |

### Pseudocode

```
procedure do_something
    
end procedure
```

## Development

### Outcome

### Challenges

Description of challenges

## Testing

Evidence for testing

### Tests

| Test | Instructions  | What I expect     | What actually happens | Pass/Fail |
| ---- | ------------- | ----------------- | --------------------- | --------- |
| 1    | Run code      | Thing happens     | As expected           | Pass      |
| 2    | Press buttons | Something happens | As expected           | Pass      |

### Evidence
