# LCD Live!
This is the web application called "LCD Live!" used as an entry for Magical Mirai 2021

# How to Build
Make sure Node.js is installed 

These commands will install and build, saving the built files in Docs
```sh
npm install
npm run build
```

This commany will launch a server that contains the built page
```sh
npm run dev
```

# Application
The page takes inspiration from LCD (Liquid-crystal display) devices, where where location that can have an image has a slightly different color from the background to indicate what will be able to appear there.
Making use of the ability to track beats and display song lyrics with TextAlive various objects on the page will appear to move and appear from one position to another
just like an LCD device would.


Using the beat the page simulates a Live Concert by having a crowd wave their penlights to the beat of the song.
The stage where the performer stands has lights that also cycle through set colors every other beat.
Finally the performer will generate music notes every other beat as well.

This app can be run with other songs by changing the "create from song URL" parameters, by default Freedom! is being used

https://github.com/marioQC16/Magical-Mirai
