# 2.2.10 Cycle 10 - Main Menu and UI

### Design

A main menu is required for my game as it will mean that the player is not immediately thrown into the game upon starting it up. Additionally, many players expect there to be a start menu and will be confused if one is not present.

## Objectives

* [x] Have a start menu
  * [x] Allow it to launch the main game
* [x] Have the menu be visually appealing
  * [x] Has title of the game
  * [x] Animations
* [x] Add in-game UI to display information to the player

### Key Variables

| Variable Name | Use                   |
| ------------- | --------------------- |
| foo           | does something useful |

## Development

### Outcome

I changed the name of my main game html file from index to game, so that the main menu would be loaded on game launch instead. Next I added two titles, one with a click trigger to load the main game html. To increase appeal, I made the title slowly fade from white to red and back again and I made the button react to being clicked by expanding.

{% tabs %}
{% tab title="index.html" %}
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Shaded Spirits</title>
    <link rel="icon" type="image/x-icon" href="./shadedspiritsfaviconv1.png">
    <link href="./menu style.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <div id="menu">
      <div id="title">
        <h1 id="TITLE">SHADED SPIRITS</h1>
      </div>
      <br>
      <div id="startButton">
        <h2>Start Game</h2>
      </div>
    </div>
    <script>
      const buttonText = document.getElementById("startButton");

      buttonText.addEventListener("click", buttonPressed);
      buttonText.addEventListener("animationend", loadGame);

      function buttonPressed(){
        buttonText.style.animationPlayState = "running";
      }
      function loadGame(){
        window.location.href = "./game.html";
      }
    </script>
  </body>
</html>
```
{% endtab %}

{% tab title="menu style.css" %}
```css
html, body {
    overflow: hidden;
    user-select: none;
    padding: 0;
    margin: 0;
    background-color: black;
}

canvas {
    width: 100%; 
    height: 100%;
    padding: 0;
    outline:none;
}

#title {
    font-size: 600%;
    animation: colourShift 5s infinite alternate;
    letter-spacing: 10px;
}

#menu {
    color: floralwhite;
    text-align: center;
    font-family: Cinzel-Regular;
}

#startButton {
    font-size: 200%;
    animation: selectButton 1s 1;
    animation-play-state: paused;
}

@keyframes colourShift {
    from {color: rgb(200, 200, 200);}
    to {color: rgb(255, 159, 159);}
}

@keyframes selectButton {
    from {letter-spacing: 0px; color: rgb(200, 200, 200);}
    to {letter-spacing: 100px; color: rgb(0, 0, 0);}
}

@font-face {
    font-family: Cinzel-Regular;
    src: url(./Cinzel-Regular.otf);
}
```
{% endtab %}
{% endtabs %}

//menu vid (recorded) goes here

Satisfied with the main menu's functionality, I moved onto using html for the UI. I started with a player health bar, the size of which would scale to show the player how much health they have left.&#x20;

{% tabs %}
{% tab title="script.js" %}
```javascript
const healthBar = document.createElement("div");
document.body.appendChild(healthBar);

class combatant(){
    ...
    hurt(){
      if (this.name == "player"){
        healthBar.style.width = (Math.max(this.hp * 5, 0)).toString() + "px";
        healthBar.style.left = (Math.max(this.hp * 4.55, 0) + 75).toString() + "px";
      }
    }
    ...
}
```
{% endtab %}

{% tab title="Second Tab" %}
```css
...
div {
    z-index: 10001;
    position: absolute;
    top: 5%;
    left: 525px;
    transform: translate(-90%, -70%);
    background-color:crimson;
    height: 20px;
    width: 500px;
}
```
{% endtab %}
{% endtabs %}

//hurt vid (not recorded) goes here

### Challenges

This part was generally free of major bugs. The only part I had some issue with was updating the values of the health bar and making it stay still on the screen, which just required some trial and error.

## Testing

| Test | Instructions                 | What I expect                                                  | What actually happens                 |
| ---- | ---------------------------- | -------------------------------------------------------------- | ------------------------------------- |
| 1    | Run code, not from a refresh | Main menu appears                                              | As expected                           |
| 2    | Click on start game          | 'Start Game' animation plays, then the game loads              | As expected                           |
| 3    | Wait on menu screen          | Title glows red and then back to white, repeating              | As expected                           |
| 4    | Get hurt                     | The health bar decreases in size from the left                 | Decreases in width but moves slightly |
| 5    | Get hurt (retest)            | The health bar decreases in size from the left and stays still | As expected                           |
