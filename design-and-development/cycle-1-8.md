# 2.2.8 Cycle 8 - Combat III (Enemies)

## Objectives

* [ ] Allow enemies to detect the player in range
* [ ] Allow enemies to find a path to the player that does not cross obstacles
  * [ ] Using A\*
* [ ] Let enemies decide when and in what direction to perform an attack
  * [x] The attack should be able to hit the player and fellow enemies (should already be functional but we can only really check now)
* [ ] Allow enemies to pick from a specified range of attacks
  * [ ] Have the enemy use some logic to determine the attack (proximity, attack pattern, shuffled random)
* [ ] Disable enemy AI upon death

### Key Variables

| Variable Name | Use                   |
| ------------- | --------------------- |
| foo           | does something useful |

## Development

### Outcome

The first action I took for this cycle was to determine the architecture of how the enemies' AI would function and interact with the rest of the world. I decided on a system where the enemy classes would hold all of the base stats and important calculations e.g. pathfinding. Essentially, enemy classes only hold what is common between all enemies. The AI objects are all coded from the ground up, every one being unique. However, the AI object gives instructions not to a specific enemy but all loaded enemies of its type. It contains the 'thoughts' of the enemy such as: move to 1.25 units away from the player and then attack with a stab. AIs are mostly interchangeable and changing the AI that governs a particular enemy will only serve to change its behaviour.

This system is mostly inspired by the one used in Terraria, which I used because it was simple, yet allowed for an incredibly large set of unique feeling enemies.

![a brief depiction of the system diagram](<../.gitbook/assets/image (3).png>)

This is useful but I will not immediately begin work on the AI, first I will need to make the player detection and pathfinding work.

Player detection will use a raycast from the enemy to the player. If it doesn't hit anything on its way to the player and it's length is less than the specified detection distance value, then the player has been spotted and the enemy becomes alert.

### Challenges

Description of challenges

## Testing

| Test | Instructions  | What I expect     | What actually happens |
| ---- | ------------- | ----------------- | --------------------- |
| 1    | Run code      | Thing happens     | As expected           |
| 2    | Press buttons | Something happens | As expected           |
