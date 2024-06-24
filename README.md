# Welcome to my portfolio website.

This website was made with a combination of sveltekit and tailwind using daisyui for the frontend, and node.js express for the backend(No database needed was my original goal/challenge!)

## Setting up the project

To start, clone the project. Then in the main directory run:

```bash

npm install
npm run dev
```
To install the server, CD into the server directory and run:
```bash

npm install
node index.js
```
## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.
## CLOCK TOWER WOKR FLOW:
1. Keep track of the days including if it is day or night
2. Control who can move during night time, have a boolean can move that will be given to a player depending on the role.
3. For voting, perhaps each person pushes something to an array or list of some sort. Nomination is a bit weird
    maybe have it so that it creates an array each time someone nominates, we have a recently nominated list and it resets after each day

4. each day determine if the evil team has won or not.
5. on day 6 end the game if the evil team is alive.

## What to do in the game loop every 30 fps?

1. receieve information of the other players position(when we want, or maybe just make it too dark for them too see? )
2. get what day it is and what night time it is
3. send information when we do a role specific action or nomniate someone
4. get the status of our player alive or dead status
