# 2.2.0 Cycle 0 - Attempting to use Kaboom.js as a 3D engine

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

## Development

### Outcome

Setting up a local host with node.js was fairly simple. All that needed to be done was to add a server.js file to recognise the app it was hosting and to host it to port 5000 and to add a viewport to the header in the index.html file.

{% tabs %}
{% tab title="index.html" %}
```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>VisitTheBeans</title>
    </head>
    <body>
        <script src="https://unpkg.com/kaboom/dist/kaboom.js"></script>
        <script src="./main.js"></script>
    </body>
</html>
```
{% endtab %}

{% tab title="server.js" %}
```
const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(5000);
```
{% endtab %}
{% endtabs %}

After setting up this I immediately got to work on the player's camera because testing the controls completely blind would have hindered my ability to accurately test them.&#x20;

The global constants define the screen size, which I'm keeping small now but will upscale for the final project, and some useful maths constants to convert degrees to radians and back again. these are needed because the trigonometry functions that my game relies upon use radians while I would prefer to work in degrees.

```
const SCREEN_WIDTH = 440;
const SCREEN_HEIGHT = 275;
const RADTODEG = 180 / 3.1415; // convert radians to deg
const DEGTORAD = 3.1415 / 180; // and deg to radians
```

Initialising all the stuff Kaboom needs in order to function: background colour, implementing the screen size, the scale, sprites, the scene and the layers. I also decided to turn gravity off (Kaboom defaults it to on) as although it will be updating it's position on the screen 60 times per second, I still though that having it off would stop any potential visual glitches from occurring.

```
kaboom({
  background: [10, 10, 10],
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: 1.5
});

loadRoot("sprites/");
loadSprite("bean", "bean.png");

scene("main", () => {
  layers = ([
    "bg", // for a static bg image
    "obj", // everything physical
    "hud", // hud ui
  ], "obj");

  gravity(0); // stop gravity from interfering
  
  for (let i = -1; i < 2; i++){ // creates a 3x3 grid of beans with random heights
    for (let j = -1; j < 2; j++) {
      makeBean(i, j, rand(2) - 1);
    }
  }
  
  function makeBean(xpos, ypos, zpos){
    const bean = add([
      sprite("bean"),
      pos(0, 0),
      body(),
      area(),
      scale(1),
      rotate(0),
      origin("center"),
      "obj",
      {
        position: vec2(xpos, ypos),
        zpos: zpos,
      }
    ])
  }
})

go("main");
```

Setting up some more work for future me now. GetBearingFromPlayer() will (surprise surprise) get the bearing of anything from the player using its 3D co-ordinates. GBFP only uses the xy plane and I will use the GetHeightBearing() function for determining vertical angle. And finally I added Pythagoras' theorem for getting the distance between to points or the length of a vector.

```
function GetBearingFromPlayer(obj){
  //set vector to player
  let _fromPlayer = vec2(obj.position.x - PlayerPos.x, obj.position.y - PlayerPos.y);
  //normalise those bad boys
  const fpMag = Math.sqrt((_fromPlayer.x *_fromPlayer.x) + (_fromPlayer.y *_fromPlayer.y));
  _fromPlayer.x = _fromPlayer.x / fpMag;
  _fromPlayer.y = _fromPlayer.y / fpMag;
  //compare to north vector to get angle
  //north vector = [0, toPlayer.y] but we only care about the magnitude
  const adjacent = Math.abs(_fromPlayer.y);
  let angle = Math.acos(adjacent); // the angle from the y axis...
  angle = angle * RADTODEG; // ...and its in radians ofc
  if (obj.position.y > PlayerPos.y){ // ugly bit where we brute force which quadrant it is in but the algorithm is still fast so who cares lol
    if (obj.position.x > PlayerPos.x){ // the bit about this being fast is the most cap thing i've read all week
      return (angle);
    } else{
      return (-angle);
    }
  } else{
    if (obj.position.x > PlayerPos.x){
      return (180 - angle);
    } else{
      return(-(180 - angle));
    }
  }
}
function GetHeightBearing(obj){
  // this geometry is much easier bc we dont actually care about the toPlayer vector except its magnitude (hypo length)
  const dist = calcDistance(obj.position.x, obj.position.y, PlayerPos.x, PlayerPos.y); // - which we have a function for anyway -
  // Then arc sin height diff (opposite) over distance for angle (in radians tho)
  const angle = Math.asin((obj.zpos - PlayerZ) / dist);
  return (angle * RADTODEG);
}
function calcDistance(startingx, startingy, endingx, endingy){
  let xdist = startingx - endingx;
  let ydist = startingy - endingy;
  let distsqr = (xdist * xdist) + (ydist * ydist);
  return(Math.sqrt(distsqr));
}
```

Now for the 'real' work. The tag "obj" will be applied to any thing that needs to be rendered by the 3D camera. onUpdate() will run every frame for every object with a set tag, in this case "obj", and will run code that transforms its angle from the direction the player is looking in and its angle above/below the player to a point on the screen and will turn its distance into its scale so that further objects are smaller.

```
let PlayerPos = vec2(0, 0);
let PlayerZ = 0;
let PlayerRot = 0;
let LookVec = vec2();
let SideVec = vec2();
  
const PlayerSpeed = 2;
const PLAYERFOV = 45;
const PlayerRotSpeed = 9;
const RenderDist = 0.1;
```

```
onUpdate("obj", (obj) => {
  // get the bearing and turn it into the angle from the view line
  let bearFromPLR = GetBearingFromPlayer(obj);
  // subtract the rotation from it to get the angle
  bearFromPLR -= PlayerRot;
  // now see if we're measuring the reflex angle insted of the smaller one
  if (Math.abs(bearFromPLR) > Math.abs(bearFromPLR + 360)){
    bearFromPLR += 360; // change if we are (result must be negative if such is the case)
  }
  // now the same with height but its much simpler
  let heightAngle = GetHeightBearing(obj);
  // aFV / PLAYERFOV ranges from -1 to 1, multiply by half the width to range across the width of the screen and then center on the middle
  obj.pos = vec2(((bearFromPLR / PLAYERFOV) * SCREEN_WIDTH * 0.5) + (SCREEN_WIDTH * 0.5), ((heightAngle / PLAYERFOV) * SCREEN_HEIGHT * 0.5) + (SCREEN_HEIGHT * 0.5));
  //obj.pos = vec2((angleFromView / PLAYERFOV) + (SCREEN_WIDTH * 0.5), SCREEN_HEIGHT * 0.5);
  const distSize = 1 / (calcDistance(obj.position.x, obj.position.y, PlayerPos.x, PlayerPos.y)); // scale size with distance to player
  obj.scale = vec2(distSize, distSize);
})
```

![This is what victory looks like](<../.gitbook/assets/image (1) (1) (1) (1) (1).png>)

Finally I'm adding movement to control where the camera is and where it is looking. W/A/S/D keeps your hands nicely spread apart which is more comfortable for the player. Kaboom's inbuilt onKeyDown() triggers every frame so long as the key it references is down so it makes sense to use it for movement controls. I also use the function dt(), delta time, which records the time since the last frame, multiplying the change in a value that increases every fame by a consistent amount by delta time will mean it increases in real time, independent of lag spikes.

```
onKeyDown("a", () => {
 PlayerPos.x += -PlayerSpeed * dt();
})
onKeyDown("d", () => {
 PlayerPos.x += PlayerSpeed * dt();
})
onKeyDown("s", () => {
 PlayerPos.y += -PlayerSpeed * dt();
})
onKeyDown("w", () => {
 PlayerPos.y += PlayerSpeed * dt();
})
```

However, this code has an issue, when the camera is turned the keys will not change their direction so pressing w will no longer make you go forwards. The fix is fairly simple however was we can find take the bearing of the player (known) and turn it into a vector to use for moving along.

```
  onUpdate(() => { // void update is basically just player stuff
    // set the player's look vector to be whatever it is, we only need PlayerRot for this (works in all quadrants wtf??)
    // do be careful tho because the radians are rearing their ugly head again again
    LookVec = vec2(Math.sin(PlayerRot * DEGTORAD), Math.cos(PlayerRot * DEGTORAD)); // and it comes pre-normalised too (we're calling the hypotenuse 1)
    SideVec = vec2(Math.sin((PlayerRot + 90) * DEGTORAD), Math.cos((PlayerRot + 90) * DEGTORAD)); // lil' trick for strafing from my unity days
  })
  //Movement Keys:
  onKeyDown("a", () => {
    // whatever the vector for strafing is, move along it (negatively)
    // apparently kaboom's vec2.add() doesn't work lol
    PlayerPos.x += SideVec.x * -PlayerSpeed * dt();
    PlayerPos.y += SideVec.y * -PlayerSpeed * dt();
  })
  onKeyDown("d", () => {
    PlayerPos.x += SideVec.x * PlayerSpeed * dt();
    PlayerPos.y += SideVec.y * PlayerSpeed * dt();
  })
  onKeyDown("w", () => {
    PlayerPos.x += LookVec.x * PlayerSpeed * dt();
    PlayerPos.y += LookVec.y * PlayerSpeed * dt();
  })
  onKeyDown("s", () => {
    PlayerPos.x += LookVec.x * -PlayerSpeed * dt();
    PlayerPos.y += LookVec.y * -PlayerSpeed * dt();
  })
```

Rotating is super simple, just increase or decrease the PlayerRot variable. Uses q and e to turn or uses the x component in the change in mouse position.

```
  onMouseMove(() => {
    PlayerRot += mouseDeltaPos().x * PlayerRotSpeed; // constant x mouse movement, delta time doesnt need to be useed here because of the nature of the mouse
    if (PlayerRot > 360){ // the code only works assuming that the player's angle is between 0-360 therefore we have 
      PlayerRot -= 360;   // to reset it on the frame it crosses over (kaboom runs 60fps nobody will notice one weird frame)
    } else if (PlayerRot < 0){ 
      PlayerRot += 360;
    }
  })

  onKeyDown("q", () => {
    PlayerRot += -PlayerRotSpeed * dt(); // increase rotation by constant x delta time bc we aren't lego island
    if (PlayerRot < 0){ // and the set it back jazz
      PlayerRot += 360;  
    }
  })
  onKeyDown("e", () => {
    PlayerRot += PlayerRotSpeed * dt();
    if (PlayerRot > 360){ 
      PlayerRot -= 360;   
    }
  })
```

### Challenges

The main issue is that ultimately, this is all unnecessary as using a 3D engine such as Three.Js will be much simpler and provide multiple functions for me. It will also do maths required for true 3D such as quaternions and matrix transformations which I do not know how to do and it allows me to use proper 3D models and import them from blender rather than the 'doom-like' sprites I am using in this solution.

## Testing

| Test | Instructions           | What I expect                                                                                                                                                                                                                                                               | What actually happens | Pass/Fail |
| ---- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------- |
| 1    | Run code               | The 'beans' appear in their formation, drawn to the screen in positions that represent a view into a 3D world.                                                                                                                                                              | As expected           | Pass      |
| 2    | Move mouse             | The camera rotates, causing the beans to appear to move side-to-side. They will also grow and shrink as they approach the sides, as the camera is perspective rather than orthographic.                                                                                     | As expected           | Pass      |
| 3    | Move forwards and back | The camera's position moves. The beans in the centre of frame will increase their size moderately but will move their screen position very little. Beans on the sides will grow and move off the sides of the screen very quickly. Further away beans will be less affected | As expected           | Pass      |
| 4    | Strafe sideways        | The beans mainly move side to side with little growth/shrinkage except those on the edges. Further away beans move less due to the parallax effect.                                                                                                                         | As expected           | Pass      |
| 5    | Move after turning     | The direction the camera moves in changes so that the direction it is looking in is always forwards.                                                                                                                                                                        | As expected           | Pass      |
