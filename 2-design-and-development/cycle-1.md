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

![This is what victory looks like](<../.gitbook/assets/image (1).png>)

```
// Some code
```

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
