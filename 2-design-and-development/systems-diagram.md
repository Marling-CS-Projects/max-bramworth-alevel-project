# 2.1 Design Frame

## Systems Diagram

![The diagram of all the systems and features that need to be present](<../.gitbook/assets/image (5) (1) (1).png>)

This diagram shows the different parts of the game that I will focus on creating. I have split each section into smaller sub-sections. Throughout the development stage, I will pick one or two of these sections to focus on at a time to gradually build up and piece together the game. I have broken the project down this way as it roughly corresponds to the success criteria. Certain sub-sections within a section will need other sections to be made before they can be started on, these are indicated by an arrow leading from the required sub-section.&#x20;

## Usability Features

Usability is an important aspect to my game as I want it to be accessible to all. There are 5 key points of usability to create the best user experience that I will be focusing on when developing my project. These are:

### Effective

Players can achieve the goal with completeness and accuracy. To do this, I will provide clear direction within the world itself, using tricks such as light, framing and colour highlighting to guide the player in the forwards direction. I will also use narrative clues to tell the player what their larger overarching goals / direction to go in is.

#### Aims

* Create a clear path for the Player to follow
  * use lights, framing and colour highlights.
  * also use in game structures to convey a direction to go in e.g. sign posts and paths
* Make the end goal of a section (get this item, go to this place) clear and simple
* Use narrative reasons to drive the player forward

### Efficiency

The game should not waste the Player's time. Menus, in my case: the inventory, pause and title, should be fast to navigate with keyboard or mouse and laid out so that they read well and present the player with all the information they need. More important aspects must be faster to access.

#### Aims

* Create a menu and inventory system that is quick and easy to navigate through
  * allow menu to be keyboard navigable as game is heavily keyboard based
* Create a controls system that isn't too complicated but still allows for the depth in gameplay I want to achieve

### Engaging

I want my game to be engaging for the Player. I will need the world to be sufficiently sized and be well paced with a mix of platforming and combat sections. I will also try to include some sections that feature elements from platforming and combat in order to mix the two styles. I will also make the enemies and world have an interesting design to make them look good and create an atmosphere which make the player want to keep playing.

#### Aims

* Create a continuous world map for the player to progress through&#x20;
* Have parts of it be platforming based, other parts combat based and some parts mixed.
  * mountain environment lends itself well to have platforming in it
* Use world and enemy design to create a tense atmosphere
  * concealed enemy positions

### Error Tolerant

The solution should have as few errors as possible and if one does occur, it should be able to correct itself. To do this, I will write my code to manage as many different game scenarios as possible so that it will not crash when someone is playing it.

#### Aims

* The game doesn't crash
* The game does not contain any bugs that damage the user experience
* Frame rate is consistent&#x20;

### Easy To Learn

My game should be intuitive to control, despite its variety of controls. The Player should be able to pick up the game after not having played it for months and be able to still keep being able to control it with ease. I will only have the controls that my game needs in order to have the depth of gameplay I want.

#### Aims

* Create a list of controls for the game
* Create an in-game tutorial that helps players learn how to play the game by slowly introducing elements as they master previous ones / become relevant. e.g. you will only learn how to jump once you reach the first platforming part
* Have item descriptions that can be accessed at any time to remind the player what items do
* Use real life elements so the player can relate their real life experiences to the game, making it more intuitive

## Pseudocode for the Game

### Pseudocode for main game script

This is the main game script that will do all of the work in order to make the game function. The script will rely on multiple other scripts however that will all store data about levels or enemies. It will be called to run by the menu script as the game should not immediately start playing.

```
imports:
    THREE.js
    GLTF Loader
    Maths
    Class types
    Enemies, items and models
    Levels
    input system
    save system
end imports
    
create rendering based objects
create the webgl renderer
add player
load appropriate part of world for the player's save file

render loop:
    respond to the input system
    apply gravity
    resolve colisions
    move camera to where it should be
    render scene
end render loop

start rendering
```

### Pseudocode for the classes

The basic layout I will use to create a level. Objects within levels will belong to one of three classes: walls, cuboids with textures and perfect hitboxes; models, 3D models I have created in bender which can be more artistically expressive and detailed than walls but have more approximate hitboxes and combatants, enemies mainly but also the player (who is a special exception to may combatant rules however). Structure classes will contain all of the walls, models and combatants of an area. They exist to load in and out the objects they contain as the player reaches triggers in the game world in order to save memory so the game does not have to check collision against objects too far away.

```
class wall:
    setup wall's transform
    setup the wall's collision protocol
    apply a material to its faces
    
    add to scene()

class model:
    setup model's transform
    setup the model's collision protocol
    
    add to scene()

class combatant:
    setup default transform
    setup combat relevant stats
    add attacks
    
    checkPlayerVisibility()
        
    check range()
        
    attack()
         
 class attack:
     setup hitbox details
     setup combat stats
     
     sweep()
     stab()
     bash()
```

### Pseudocode for input system

The input system that base JavaScript uses has the flaw that holding a key registers as one press and then a hold, with a gap between.

![](<../.gitbook/assets/key press diagram.png>)

The solution I used has individual variables for each key. The variables go on when the key is pressed down and goes off when it comes up. this circumvent the issue by getting the game to check these variables instead of the keys directly. This will also allow for easy key remapping.

```
add event listener for 'keyup':
    switch keycode value:
        change variable state for appropriate key to true

add event listener for 'keydown':
    switch keycode value:
        change variable state for appropriate key to false

add event listener for 'mouse move':
    rotate the player by the amount moved side to side
    move camera up and down by the amount moved up and down
    
add event listener for 'mouse click':
    switch click type:
        do appropriate action
```
