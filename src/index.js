
 import { Player } from "textalive-app-api";

 // TextAlive Player を初期化
 const player = new Player({
   app: { token: "ra0mvlhTPtvkLq8s" },
 
   mediaElement: document.querySelector("#media"),
   mediaBannerPosition: "bottom right",
 });
 
 // The document elements saved for easy reference
 const overlay = document.querySelector("#overlay");
 const lyrics = document.querySelector("#text");
 const textBox = document.querySelector("#textBox");
 const arena = document.querySelector("#arena");
 const audience = document.querySelector("#crowd");
 const platform   = document.querySelector("#platform");
 const frame1 = document.querySelector("#frame1");
 const frame2 = document.querySelector("#frame2");
 const dropColor = document.querySelector("#colorChoice");

 // varibles used to keep track of objects
 let b, c;
 var beatCounter = 1;
 var lyricWidth = 0;

 // colors that can be referenced by name
 const faded = "rgb(109,118,108)";
 const miku = "rgb(57, 197, 187)";
 const rin = "rgb(255,204,17)";
 const len = "rgb(255,238,18)";
 const luka = "rgb(255,186,204)";
 const kaito = "rgb(51,103,205)";
 const meiko = "rgb(222,68,68)";
 const colors = [miku, rin, len, luka, kaito, meiko];

 // Arrays that control the stage light's movements
 var stageLight = [0, 0, 0, 0, 0, 0, 0, 0, 0];
 var lightBuffer = [false, false, false, false, false, false, false, false, false ];
 var lightEnabled = [false, false, false, false, false, false, false, false, false ];
 var turnLightOn = 0;

 // Array that controls the music note's movements
 var noteOn = [true, false, false];

 // A reference for the 2 canvases on the document
 var ctx = audience.getContext("2d");
 var platCtx = platform.getContext("2d");

 // Variable for the user selection on the penlight menu
 var chosenColor = dropColor.value;

 
 player.addListener({
   /* APIの準備ができたら呼ばれる */
   onAppReady(app) {
     if (app.managed) {
       document.querySelector("#control").className = "disabled";
     }
     if (!app.songUrl) {
       document.querySelector("#media").className = "disabled";
 
       // chiquewa / Freedom!
      
       player.createFromSongUrl("https://piapro.jp/t/N--x/20210204215604", {
         // YouTube: https://www.youtube.com/watch?v=pAaD4Hta0ns
         video: {
           // 音楽地図訂正履歴: https://songle.jp/songs/2121403/history
           beatId: 3953761,
           repetitiveSegmentId: 2099586,
           // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FN--x%2F20210204215604
           lyricId: 52094,
           lyricDiffId: 5171,
         },
       });
     }
   },
 
   /* 楽曲が変わったら呼ばれる Called when music changed */
   onAppMediaChange() {
     // 画面表示をリセット, Resets screen
     overlay.className = "";
     resetChars();
   },
 
   /* 楽曲情報が取れたら呼ばれる Called when song info loaded*/
   onVideoReady(video) {
     // 楽曲情報を表示 Show song information 
     document.querySelector("#artist span").textContent =
       player.data.song.artist.name;
     document.querySelector("#song span").textContent = player.data.song.name;
 
     // 最後に表示した文字の情報をリセット Resent information when last character displayed
     c = null;
   },
 
   /* 再生コントロールができるようになったら呼ばれる Called when playback control */
   onTimerReady() {
     overlay.className = "disabled";
     frame2.style.visibility = "hidden";
     document.querySelector("#control > a#play").className = "";
     document.querySelector("#control > a#stop").className = "";
   },
 
   /* 再生位置の情報が更新されたら呼ばれる Called when playback position is updated */
   onTimeUpdate(position) {
    
    // Updates the penlight colors when position is updated
    chosenColor = dropColor.value;


     // Causes effects when a beat is played
     let beat = player.findBeat(position);
     if (b !== beat) {
       if (beat) {
        
        // Changes the animation's frame per beat
        if(frame1.style.visibility == "hidden"){
          frame2.style.visibility = "hidden";
          frame1.style.visibility = "visible";
        }
        else{
          frame1.style.visibility = "hidden";
          frame2.style.visibility = "visible";
        }

        // Changes the penlight's position every beat
        if(beatCounter == 1)
        {
          drawLineLeft(ctx, colors[chosenColor]);
          drawLineCenter(ctx, faded);
          drawLineRight(ctx, faded);
          cloneCanvas();
          updateNotes();
          beatCounter++
        }
        else if(beatCounter == 2 || beatCounter == 4)
        {
          drawLineCenter(ctx, colors[chosenColor]);
          drawLineLeft(ctx, faded);
          drawLineRight(ctx, faded);
          cloneCanvas();
          updateLights();
          
          if(beatCounter == 4){
            beatCounter = 1;
          }
          else{
            beatCounter++;
          }
        }

         else if(beatCounter == 3)
         {
           drawLineRight(ctx, colors[chosenColor]);
           drawLineCenter(ctx, faded);
           drawLineLeft(ctx, faded);
           cloneCanvas();
           updateNotes();
           beatCounter++;
         }
       }
       b = beat;
     }
 




     // 歌詞情報がなければこれで処理を終わる If there is no more lyrics end processing
     if (!player.video.firstChar) {
       return;
     }
 
     // 巻き戻っていたら歌詞表示をリセットする Reset the lyrics when restarting
     if (c && c.startTime > position + 1000) {
       resetChars();
     }
 
     
     // Controls the character display when lyrics are said
     let current = c || player.video.firstChar;
     while (current && current.startTime < position ) {
       // 新しい文字が発声されようとしている A new lyric is about to be said
       if (c !== current) {
         newChar(current);
         c = current;
       }
       current = current.next;
     }
   },
 
   /* 楽曲の再生が始まったら呼ばれる Called when song starts playing*/
   onPlay() {
     const a = document.querySelector("#control > a#play");
     while (a.firstChild) a.removeChild(a.firstChild);
     a.appendChild(document.createTextNode("\uf28b"));
   },
 
   /* 楽曲の再生が止まったら呼ばれる Called when the song is paused */
   onPause() {
     const a = document.querySelector("#control > a#play");
     while (a.firstChild) a.removeChild(a.firstChild);
     a.appendChild(document.createTextNode("\uf144"));
   },
 });
 
 /* 再生・一時停止ボタン Events for the Pause and Play Buttons*/
 document.querySelector("#control > a#play").addEventListener("click", (e) => {
   e.preventDefault();
   if (player) {
     if (player.isPlaying) {
       player.requestPause();
     } else {
       player.requestPlay();
     }
   }
   return false;
 });
 
 /* 停止ボタン Events for the Stop Button */
 document.querySelector("#control > a#stop").addEventListener("click", (e) => {
   e.preventDefault();
   if (player) {
     player.requestStop();
     resetChars();
   }
   return false;
 });
 
// The initial drawings for the audience and the penlights
drawArc(ctx, 10, 150, 150, 50, false);
drawLineLeft(ctx, faded);
drawLineCenter(ctx, faded);
drawLineRight(ctx, faded);

// This loop clones the inital drawing and fills the lower screen with them
for(let i = 0; i < 12; i++){
 
  // This Section makes a new canvas then makes it copy what the original had
  var canv = document.createElement('canvas');
  canv.id = 'person ' + i;
  var canvDraw = canv.getContext('2d');
  
  //set dimensions to match the original
  canvDraw.width = ctx.width;
  canvDraw.height = ctx.height;

    //draws the original to the source canvas
    canvDraw.drawImage(audience, 0, 0);

    // adds the canvas to the body element
    document.body.appendChild(canv); 
    
  // adds the canvas to arena
  arena.appendChild(canv); 
  }

  // draws the arc for the stage
drawArc(platCtx, 5, 150, 10, 130, true);

 /**
  * 新しい文字の発声時に呼ばれる
  * Called when a new character is being vocalized
  */
 function newChar(current) {

  // Makes sure that when a new word is being said it doesn't go past the set text box
  if(lyricWidth >= textBox.clientWidth - 55){
    resetChars();
   }

   // 品詞 (part-of-speech)
   // https://developer.textalive.jp/packages/textalive-app-api/interfaces/iword.html#pos
   const classes = [];
   
 
   // フレーズの最後の文字か否か Last letter of a phrase
   if (current.parent.parent.lastChar === current) {
     classes.push("lastChar");
     lyricWidth = lyricWidth + 40;
   }
 
   // 英単語の最初か最後の文字か否か An English phrase
   if (current.parent.language === "en") {
     if (current.parent.lastChar === current) {
       classes.push("lastCharInEnglishWord");
       lyricWidth = lyricWidth + 20;
     } 
     else if (current.parent.firstChar === current) {
       classes.push("firstCharInEnglishWord");
       lyricWidth = lyricWidth + 20;
     }
   }
 
   //Creates a new section that will hold the new character of the lyric
   const div = document.createElement("div");
   div.appendChild(document.createTextNode(current.text));
 
   // 文字を画面上に追加 Adds the new section to the page
   const container = document.createElement("div");
   container.className = classes.join(" ");
   container.appendChild(div);
   lyrics.appendChild(container);

   // Adds the width of the new section to the total section width to make sure it doesn't pass textbox width
   lyricWidth = lyricWidth + container.clientWidth;
   
 }
 
 /**
  * 歌詞表示をリセットする
  * Reset lyrics view
  */
 function resetChars() {
   c = null;
   while (lyrics.firstChild){
      lyrics.removeChild(lyrics.firstChild);
   }
   lyricWidth = 0;
 }

 // Drawing a line
 function drawLine(selectedCanvas, begin, end, stroke = 'black', width) {
  if (stroke) {
    selectedCanvas.strokeStyle = stroke;
  }

  if (width) {
    selectedCanvas.lineWidth = width;
  }
  
  selectedCanvas.beginPath();
  selectedCanvas.moveTo(...begin);
  selectedCanvas.lineTo(...end);
  selectedCanvas.stroke();
}



// This draws an arc
function drawArc(selectedCanvas, width, leftPoint, lowPoint, radius, rotation){
  selectedCanvas.lineWidth = width;
  selectedCanvas.beginPath();
  if(rotation){
    selectedCanvas.arc(leftPoint, lowPoint, radius, 10/11 * Math.PI, 1/11 * Math.PI, rotation);
  }
  else {
    selectedCanvas.arc(leftPoint, lowPoint, radius, 1 * Math.PI, 0, rotation);
  }
  
  selectedCanvas.stroke();
}


// Called when the left Penlight needs to be drawn
function drawLineLeft(selectedCanvas, color) {
  drawLine(selectedCanvas, [30, 50], [100, 110], color, 16);

  // If the light is given a color give it a black handle
  if(color != faded)
  drawLine(selectedCanvas, [80, 93], [100, 110], "black", 16);
}

// Called when the Center penlight needs to be drawn
function drawLineCenter(selectedCanvas, color) {
  drawLine(selectedCanvas, [150, 0], [150, 90], color, 16);

  // If the light is given a color give it a black handle
  if(color != faded)
  drawLine(selectedCanvas, [150, 63], [150, 90], "black", 16);
}

// Called when the Right penlight needs to be drawn
function drawLineRight(selectedCanvas, color) {
  drawLine(selectedCanvas, [200, 110], [270, 50], color, 16);

  // If the light is given a color give it a black handle
  if(color != faded)
  drawLine(selectedCanvas, [200, 110], [220, 93], "black", 16);
}


// This clones the contents of the first canvas and applies it to the other canvases to create identical copies
function cloneCanvas(){
for(let i = 0; i < 12; i++){
  var crowd = document.getElementById('person ' + i);
  var clone = crowd.getContext('2d');
  clone.drawImage(audience, 0, 0);
  }
}

// Called when the stage lights need to update
function updateLights(){

  //Loop for managing all lights at once
  for(var i = 0; i < 9; i++){

    // Check if the light has been enabled
    if(!lightEnabled[turnLightOn]){
      lightEnabled[turnLightOn] = true;
    }

    //check if the light has been turned on 
    if(lightEnabled[i]){    

      // check if the light is on a buffer if so then don't do anything
      if(lightBuffer[i]){   
        lightBuffer[i] = false;
        if(stageLight[i] > 4){
          stageLight[i] = 0;
        }
        else{
          stageLight[i]++;
        }
       
      }

      // check if the light is off a buffer if so then change the color to the next in line
      else{                 
        document.getElementById("light" + i).style.color = colors[stageLight[i]];
        lightBuffer[i] = true;
      }
    }

  }

  // Turn the next light on after this entire function has run
  turnLightOn++;
}

// This is called when the music notes need to be updated
function updateNotes(){

  // The varibles for the current note and the next random note
  var chosen = 0;
  var randomNote = 0;
  // Checks to see which note is currently active
  for(var i = 0; i < noteOn.length; i++){
    if(noteOn[i]){
      chosen = i;
    }
  }

  // Depending which note is active lights up the note accordingly
  switch(chosen){

    case 0:{
      noteOn[chosen] = false;
      document.getElementById("note0").style.color = "black";
      document.getElementById("note1").style.color = faded;
      document.getElementById("note2").style.color = faded;

      randomNote = Math.floor(Math.random() * 2);

      chosen = ((chosen + randomNote + 1) % 3);
      noteOn[chosen] = true;

      break;
    }
    case 1:{
      noteOn[chosen] = false;
      document.getElementById("note0").style.color = faded;
      document.getElementById("note1").style.color = "black";
      document.getElementById("note2").style.color = faded;

      randomNote = Math.floor(Math.random() * 2);

      chosen = ((chosen + randomNote + 1) % 3);
      noteOn[chosen] = true;

      break;
    }
    case 2:{
      noteOn[chosen] = false;
      document.getElementById("note0").style.color = faded;
      document.getElementById("note1").style.color = faded;
      document.getElementById("note2").style.color = "black";

      randomNote = Math.floor(Math.random() * 2);

      chosen = ((chosen + randomNote + 1) % 3);
      noteOn[chosen] = true;
      break;
    }

  }
}
