
 const { Player } = TextAliveApp;

 // TextAlive Player を初期化
 const player = new Player({
 

   app: { token: "ra0mvlhTPtvkLq8s" },
 
   mediaElement: document.querySelector("#media"),
   mediaBannerPosition: "bottom right",
 
 });
 
 const overlay = document.querySelector("#overlay");
 
 const lyrics = document.querySelector("#text");
 const textBox = document.querySelector("#textBox");


 const arena = document.querySelector("#arena");
 const audience = document.querySelector("#crowd");
 const platform   = document.querySelector("#platform");
 const frame1 = document.querySelector("#frame1");
 const frame2 = document.querySelector("#frame2");


 let b, c;
 var beatCounter = 1;
 var  lyricWidth = 0;
 const faded = "rgb(109,118,108)";
 const miku = "rgb(57, 197, 187)";

 var ctx = audience.getContext("2d");
 var platCtx = platform.getContext("2d");
 
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
 
   /* 楽曲が変わったら呼ばれる */
   onAppMediaChange() {
     // 画面表示をリセット
     overlay.className = "";
     resetChars();
   },
 
   /* 楽曲情報が取れたら呼ばれる */
   onVideoReady(video) {
     // 楽曲情報を表示
     document.querySelector("#artist span").textContent =
       player.data.song.artist.name;
     document.querySelector("#song span").textContent = player.data.song.name;
 
     // 最後に表示した文字の情報をリセット
     c = null;
   },
 
   /* 再生コントロールができるようになったら呼ばれる */
   onTimerReady() {
     overlay.className = "disabled";
     frame2.style.visibility = "hidden";
     document.querySelector("#control > a#play").className = "";
     document.querySelector("#control > a#stop").className = "";
   },
 
   /* 再生位置の情報が更新されたら呼ばれる */
   onTimeUpdate(position) {
 



     // This Beats
     let beat = player.findBeat(position);
     if (b !== beat) {
       if (beat) {
        
        if(frame1.style.visibility == "hidden"){
          frame2.style.visibility = "hidden";
          frame1.style.visibility = "visible";
        }
        else{
          frame1.style.visibility = "hidden";
          frame2.style.visibility = "visible";
        }

         if(beatCounter == 1)
         {
          drawLineLeft(ctx, miku);
          drawLineCenter(ctx, faded);
          drawLineRight(ctx, faded);
          cloneCanvas();
          beatCounter++
         }

         else if(beatCounter == 2 || beatCounter == 4)
         {
           drawLineCenter(ctx, miku);
           drawLineLeft(ctx, faded);
           drawLineRight(ctx, faded);
           cloneCanvas();
           
           if(beatCounter == 4){
             beatCounter = 1;
           }
           else{
             beatCounter++;
           }
         }

         else if(beatCounter == 3)
         {
           drawLineRight(ctx, miku);
           drawLineCenter(ctx, faded);
           drawLineLeft(ctx, faded);
           cloneCanvas();
           beatCounter++;
         }

       }
       b = beat;
     }
 




     // 歌詞情報がなければこれで処理を終わる
     if (!player.video.firstChar) {
       return;
     }
 
     // 巻き戻っていたら歌詞表示をリセットする
     if (c && c.startTime > position + 1000) {
       resetChars();
     }
 
     // 500ms先に発声される文字を取得, TL: have the voice speak 500ms before text
     // I quick fixed it by doing 0 but I could remove or repurpose for remove after x ms

     //this is problem
     let current = c || player.video.firstChar;
     while (current && current.startTime < position ) {
       // 新しい文字が発声されようとしている
       if (c !== current) {
         newChar(current);
         c = current;
       }
       current = current.next;
     }
   },
 
   /* 楽曲の再生が始まったら呼ばれる */
   onPlay() {
     const a = document.querySelector("#control > a#play");
     while (a.firstChild) a.removeChild(a.firstChild);
     a.appendChild(document.createTextNode("\uf28b"));
   },
 
   /* 楽曲の再生が止まったら呼ばれる */
   onPause() {
     const a = document.querySelector("#control > a#play");
     while (a.firstChild) a.removeChild(a.firstChild);
     a.appendChild(document.createTextNode("\uf144"));
   },
 });
 
 /* 再生・一時停止ボタン */
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
 
 /* 停止ボタン */
 document.querySelector("#control > a#stop").addEventListener("click", (e) => {
   e.preventDefault();
   if (player) {
     player.requestStop();
     resetChars();
   }
   return false;
 });
 
 





// Making a line as many times as needed
// X max = 300, Y Max = 150
// width 2-3 is good
// hight 15 maybe

drawArc(ctx, 10, 150, 150, 50, false);
drawLineLeft(ctx, faded);
drawLineCenter(ctx, faded);
drawLineRight(ctx, faded);

// 11 is the number of fellas in a standard screen 
for(let i = 0; i < 12; i++){
 
  // This Section makes a new canvas then makes it copy what the og had
  var canv = document.createElement('canvas');
  canv.id = 'person ' + i;
  var canvDraw = canv.getContext('2d');
  
  
  //set dimensions
  canvDraw.width = ctx.width;
  canvDraw.height = ctx.height;
      //draws the OG to the source
      
      canvDraw.drawImage(audience, 0, 0);
  
    document.body.appendChild(canv); // adds the canvas to the body element
  
  arena.appendChild(canv); // adds the canvas to arena
  }


drawArc(platCtx, 5, 150, 10, 130, true);








 /**
  * 新しい文字の発声時に呼ばれる
  * Called when a new character is being vocalized
  */
 function newChar(current) {

  if(lyricWidth >= textBox.clientWidth - 50){
    resetChars();
   }
   // 品詞 (part-of-speech)
   // https://developer.textalive.jp/packages/textalive-app-api/interfaces/iword.html#pos
   const classes = [];
   
 
   // フレーズの最後の文字か否か
   if (current.parent.parent.lastChar === current) {
     classes.push("lastChar");
     lyricWidth = lyricWidth + 40;
   }
 
   // 英単語の最初か最後の文字か否か
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
 

   const div = document.createElement("div");
   div.appendChild(document.createTextNode(current.text));
 
   // 文字を画面上に追加
   const container = document.createElement("div");
   container.className = classes.join(" ");
   container.appendChild(div);
   lyrics.appendChild(container);

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



// This draws an arc,
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



function drawLineLeft(selectedCanvas, color) {
  drawLine(selectedCanvas, [30, 50], [100, 110], color, 16);

  if(color != faded)
  drawLine(selectedCanvas, [80, 93], [100, 110], "black", 16);
}

function drawLineCenter(selectedCanvas, color) {
  drawLine(selectedCanvas, [150, 0], [150, 90], color, 16);

  if(color != faded)
  drawLine(selectedCanvas, [150, 63], [150, 90], "black", 16);
}

function drawLineRight(selectedCanvas, color) {
  drawLine(selectedCanvas, [200, 110], [270, 50], color, 16);

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
