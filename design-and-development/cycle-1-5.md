# 2.2.5 Cycle 5 - Further controls: Running, Jumping and Rolling

### Objectives

* [x] Have the player jump when space is pressed
* [x] Let the player roll when left shift is pressed briefly
  * [x] Player cannot jump while rolling
* [x] Let the player run while holding left shift
  * [x] There should be no overlap between rolling and running, you either run or you roll

### Key Variables

| Variable Name | Use                                                     |
| ------------- | ------------------------------------------------------- |
| air time      | Time spent in the air, used to determine gravity value. |
| roll          | Progression through the roll animation and cooldown     |
| grounded      | On the Floor?                                           |

### Pseudocode

```
render loop:
    move player downwards amount amount based of current gravity
    if gravity is not at terminal velocity, keep increasing along a cosine graph
    if grounded reset the cosine graph
    
    on a short left hift press, roll
    on a longer one, run
    if grounded and not rolling and space is pressed, jump
```

## Development

### Outcome

Knowing that this would be what was left of all of the movement controls, I quickly made a level for the player to navigate around using these new control options. As I was writing it, I realised that the code for the entire world would much much larger than I anticipated and would probably need it's own file which structures would be loaded from.

```
const spawn = new structure([
  new wall(new THREE.Vector3(0, -3.25, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 5, 40), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(7, 9, 14.75), new THREE.Vector3(0, 0, -0.1), new THREE.Vector3(4, 20, 39.5), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // left wall
  new wall(new THREE.Vector3(-7, 9, 17), new THREE.Vector3(0, 0, 0.1), new THREE.Vector3(4, 20, 44), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), // right wall
  new wall(new THREE.Vector3(0, 9, -7), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 20, 4), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // back wall
  new wall(new THREE.Vector3(12, 9, 38.75), new THREE.Vector3(0, 0, 0), new THREE.Vector3(40, 20, 0.5), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // far wall
  new wall(new THREE.Vector3(0, 0, 35), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 1.5, 0.5), new THREE.Vector3(0, 0, -0.02), false, "./rock.png"), // horizontal ledge
  new wall(new THREE.Vector3(0, 1, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(15, 0.5, 4), new THREE.Vector3(0, 0.02, 0), true, "./rock.png"), // top of ledge
  new wall(new THREE.Vector3(6, 2, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 2, 4), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // flat bit of second ledge
  new wall(new THREE.Vector3(8, 3, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 0.5, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // second ledge top
], []);

const grassy_slope = new structure([
  new wall(new THREE.Vector3(17, 4, 34.75), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 10, 0.5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // left side wall
  new wall(new THREE.Vector3(10.5, 3.35, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // start of ramp, from bottom
  new wall(new THREE.Vector3(11.5, 3.6, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(12.5, 3.85, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(13.5, 4.1, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(14.5, 4.35, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(15.5, 4.6, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(16.5, 4.85, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(17.5, 5.1, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0.25, 4), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(17.5, 3, 37), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 4, 4), new THREE.Vector3(0, 0.02, 0), false, "./rock.png"),
  new wall(new THREE.Vector3(21, 5.5, 37), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(4, 0.25, 1), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"),// first platform
  new wall(new THREE.Vector3(26.5, 5.8, 37), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(4, 0.25, 3), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"),// second platform
  new wall(new THREE.Vector3(28.5, 6.7, 37), new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(4, 0.25, 3), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"),// get up to next platform bit
], []);

const first_opening = new structure([
  new wall(new THREE.Vector3(20, 7, 14.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 5, 40), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // floor
  new wall(new THREE.Vector3(9.5, 13, 14.91), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 10, 40), new THREE.Vector3(0.02, 0, 0), false, "./rock.png"), // left wall
  new wall(new THREE.Vector3(29.5, 6, 17.4), new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 24, 45), new THREE.Vector3(-0.02, 0, 0), false, "./rock.png"), // right wall
  new wall(new THREE.Vector3(20, 13, -5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(20, 10, 0.5), new THREE.Vector3(0, 0, 0.02), false, "./rock.png"), // far wall
  new wall(new THREE.Vector3(10, 19.05, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(8, 1, 8), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"), // tower floor
  new wall(new THREE.Vector3(13.55, 14, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.5, 9, 3), new THREE.Vector3(0.02, 0, 0), true, "./ladderwood.png"), // tower ladder back
  new wall(new THREE.Vector3(0, 19.05, 15), new THREE.Vector3(0, 0, 0), new THREE.Vector3(12, 1, 4), new THREE.Vector3(0, 0.02, 0), true, "./wood.png"), // bridge
], [
  new THREEDModel(new THREE.Vector3(18, 9.75, 4.9), new THREE.Vector3(0, -Math.PI / 2, 0), new THREE.Vector3(0.75, 0.75, 0.75), 1, 2, "./moai.glb"),
  new THREEDModel(new THREE.Vector3(24, 10.75, 24.9), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.2, 0.2, 0.2), 0.25, 2, "./lantern.glb"),
]);

const second_opening = new structure([
  new wall(new THREE.Vector3(-18.5, 19, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"), // grass planes
  new wall(new THREE.Vector3(-18.5, 19, 27.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),// for the floor
  new wall(new THREE.Vector3(-43.5, 19, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(-43.5, 19, 27.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(25, 1, 25), new THREE.Vector3(0, 0.02, 0), true, "./grassig.png"),
  new wall(new THREE.Vector3(-43.5, 23.25, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 5, 0.25), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), //gap for roll
  new wall(new THREE.Vector3(-43.5, 23.25, 2.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 5, 0.25), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-39.5, 22.6, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // left of gap
  new wall(new THREE.Vector3(-39.5, 22.6, 2.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
  new wall(new THREE.Vector3(-47.5, 22.6, 2.5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, 0.02), false, "./wood.png"), // right of gap
  new wall(new THREE.Vector3(-47.5, 22.6, 2.25), new THREE.Vector3(0, 0, 0), new THREE.Vector3(4, 6.3, 0.25), new THREE.Vector3(0, 0, -0.02), false, "./wood.png"),
], [
  new THREEDModel(new THREE.Vector3(-43.5, 22, 27.5), new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(2.5, 2.5, 2.5), 3, 5, "./moai.glb"),
]);
```

The easiest of the three controls is jumping. Just setting gravity to a positive value and decreasing it back to its original value over time does do the job but doesn't feel very good to control as there is no acceleration. Good feeling jumps in platformers usually have some 'hang time' in them, while my game is not a platformer, it will be useful to use a model that has some in order to make it feel good. My best Idea is trying to make the shape of the jump emulate a Sine graph between 0 - 180. My gravity constant displays the speed that the player is moving up and down so in order to get the speed I will need to differentiate the sine graph, which gives the cosine graph instead. This will be easy to model by having a variable that increases while the player is not grounded.

![](<../.gitbook/assets/jump maths.png>)

```
render(){
    ...
    if (gravity > 0){
      playerModel.mesh.position.y += gravity * 0.5;
    } else{
      playerModel.mesh.position.y += gravity;
    }

    if (gravity > -0.2){
      gravity = Math.cos(Math.min(airTime * 3, 3.1416)) * 0.6;
    }
    ...
    if (grounded){
      airTime = 0;
      grounded = -0.2;
    } else{
      airTime += 1/60;
    }
    ...
}
```

My Idea for how to determine if a left shift should be a roll or a run is simple. When left shift initially goes down, we have no idea of knowing whether the player wants to run or roll, so we will start by assuming the player wants to run. The maximum time left shift can be held and still be a roll will be very short so only the most attentive players will notice the short bit of running anyway. The main script will do this by using a specialised function for left shift only. getLeftShift() will be called every frame and will return one of three out comes: -1, indicating that left shift is being held; 0 indicating that it is not being held and 0<, indicating that it has just been released. updateControls() and clearLSTimer() are both called by the main script when appropriate.

```
export function getLeftShift(){
  if (leftShiftDown){
    return (-1);
  } else{
    if (leftShiftTimer > 0){
      return(leftShiftTimer);
    } else{
      return(0);
    }
  }
}

export function updateControls(){
  if (leftShiftDown){
    leftShiftTimer += 1/60;
  }
}

export function clearLSTimer(){
  leftShiftTimer = 0;
}
```

In the main script I simply ran a short if else chain to find the correct response and called the updateControls() near the start of the render() loop.

```
render(){
    ...
    INPUTSYS.updateControls();
    ...
    if(INPUTSYS.getLeftShift() > 0 && INPUTSYS.getLeftShift() < 0.5 && roll <= 0){
      playerModel.mesh.scale.set(1, 1, 1);
      playerModel.mesh.position.y -= 0.5;
      roll = 5;
      INPUTSYS.clearLSTimer();
      run = 0;
    } else if (INPUTSYS.getLeftShift() == -1){
      run = 1;
    } else {
      INPUTSYS.clearLSTimer();
      run = 0;
    }
    ...
}
```

This loop serves to change the state of two two variables. Run, which is added to movement speed and roll, which counts down over time and counts the cooldown and progression of the roll. Later I will use this with the animation.

```
render(){
    ...
    if (roll > 0){
      if (roll > 2.5){
        playerModel.mesh.position.z += PlayerFacing.z * rollSpeed;
        playerModel.mesh.position.x += PlayerFacing.x * rollSpeed;
      } else{
        playerModel.mesh.scale.set(1, 2, 1);
      }
      roll -= 0.1;
    }
    ...
    if (INPUTSYS.getKey("w")){
        playerModel.mesh.position.z += PlayerFacing.z * (moveSpeed + run);
        playerModel.mesh.position.x += PlayerFacing.x * (moveSpeed + run);
    }
    if (INPUTSYS.getKey("s")){
        playerModel.mesh.position.z -= PlayerFacing.z * (moveSpeed + run);
        playerModel.mesh.position.x -= PlayerFacing.x * (moveSpeed + run);
    }
    if (INPUTSYS.getKey("a")){
        playerModel.mesh.position.z += PlayerRight.z * (moveSpeed + run);
        playerModel.mesh.position.x += PlayerRight.x * (moveSpeed + run);
    }
    if (INPUTSYS.getKey("d")){
        playerModel.mesh.position.z -= PlayerRight.z * (moveSpeed + run);
        playerModel.mesh.position.x -= PlayerRight.x * (moveSpeed + run);
    }
    ...
}
```

// youtube vid of running ad rollin

### Challenges

One Issue I ran into was with getting the input system to recognise the difference between long and short left shift presses. The main issue I encountered was not being able to roll after pressing left shift too long. This was solved by also having the getLeftShift() == 0 flag also rest the timer.

## Testing

Evidence for testing

### Tests

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |

### Evidence
