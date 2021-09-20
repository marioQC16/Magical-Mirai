import { Player } from "textalive-app-api";

const player = new Player({
    app: { token: "ra0mvlhTPtvkLq8s" },
    mediaElement: document.querySelector("#media"),
    mediaBannerPosition: "bottom right"
  });

  const lyric = document.querySelector("#lyric");
 
  const stage = document.querySelector("#stage");
  let b, c;
  player.addListener({
  onAppReady: (app) => {
    if (!app.managed) {
      
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

   /* 楽曲情報が取れたら呼ばれる */
   onVideoReady(video) {
    // 楽曲情報を表示
    document.querySelector("#artist span").textContent =
      player.data.song.artist.name;
    document.querySelector("#song span").textContent = player.data.song.name;

    // 最後に表示した文字の情報をリセット
    c = null;
  },

  
});


