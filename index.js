const musicList = document.getElementById("music_list");
const songName = document.getElementById("song_name");
const artisteName = document.getElementById("artiste_name");
const musicInput = document.getElementById("music_input");
const addASong = document.getElementById("add_a_song");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("forward");
const prevBtn = document.getElementById("back");
const musicLength = document.getElementById("music_length")
const musicLengthLine = document.getElementById("music_length_line")
const progressCircle = document.getElementById("progress_circle")



const AUDIO_PLAYER = new Audio()
let currentIndex = -1;
let isPlaying = false


const PAUSE = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
</svg>
`
const PLAY = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                        </svg>`

playBtn.innerHTML=isPlaying? PLAY : PAUSE

const ALL_MUSIC = [
    // {
    //     title: "Tim",
    //     artiste: "Hans Zimmer",
    //     length: "1:00",
    //     image: null,
    //     url: "" // no file yet, demo only
    // }
];



const STORAGE_KEY = "all_music"

const saveMusic = ()=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ALL_MUSIC))
}

const loadMusic = ()=>{
    const RAW = localStorage.getItem(STORAGE_KEY)
    if(RAW){
        try{
            ALL_MUSIC = JSON.parse(RAW)
        }
        catch(e){
            console.log("There was an error loading the songs")
            ALL_MUSIC=[];

        }
    }
}




// RENDER SONGS LIST
const renderSongs = () => {
    musicList.textContent = "";

    ALL_MUSIC.forEach((music, index) => {
        const MUSIC_CARD = document.createElement("div");
        MUSIC_CARD.className = "one_music_card";

        MUSIC_CARD.innerHTML = `
            <div class="music_image"></div>
            <div>
                <span class="song_name">${music.title}</span>
                <span class="artiste_name">${music.artiste}</span>
            </div>
            <span class="time">${music.length}</span>
        `;

        MUSIC_CARD.addEventListener("click", () => {
            playSong(index);
        });

        musicList.appendChild(MUSIC_CARD);
    });

    console.log(ALL_MUSIC)
};



const playSong = (index,)=>{
    
    const SONG = ALL_MUSIC[index]
    currentIndex = index;
    //music_div.style.backgroundColor = "green"
    songName.textContent = SONG.title
    artisteName.textContent = SONG.artiste
    musicLength.textContent = SONG.length
    
    isPlaying = true
    playBtn.innerHTML=isPlaying? PLAY : PAUSE
    isPlaying? AUDIO_PLAYER.play() : AUDIO_PLAYER.pause()
    AUDIO_PLAYER.src = SONG.url;
    AUDIO_PLAYER.play();
    //return true

}


const togglePlayAndPause = ()=>{
    isPlaying = !isPlaying
    isPlaying? AUDIO_PLAYER.play() : AUDIO_PLAYER.pause()
    playBtn.innerHTML=isPlaying? PLAY : PAUSE
    console.log(isPlaying)

}


playBtn.addEventListener('click', togglePlayAndPause)


nextBtn.addEventListener("click", () => {
    if (ALL_MUSIC.length === 0) return;
    currentIndex = (currentIndex + 1) % ALL_MUSIC.length;
    playSong(currentIndex);
});

// PREVIOUS SONG
prevBtn.addEventListener("click", () => {
    if (ALL_MUSIC.length === 0) return;
    currentIndex = (currentIndex - 1 + ALL_MUSIC.length) % ALL_MUSIC.length;
    playSong(currentIndex);
});

// ADD SONG FROM DEVICE
addASong.addEventListener("click", () => musicInput.click());

musicInput.addEventListener("change", () => {
    Array.from(musicInput.files).forEach(file => {
        if (!file.type.startsWith("audio/")) return;

        jsmediatags.read(file, {
            onSuccess: tag => {
                const newSong = {
                    title: tag.tags.title || file.name,
                    artiste: tag.tags.artist || "Unknown Artist",
                    length: "--:--",
                    file,
                    url: URL.createObjectURL(file)
                };


        const FIND_SONG = ALL_MUSIC.find((music)=> music.title=== newSong.title);

        if(FIND_SONG){
            alert("Song already exists")
        }
        else{
            ALL_MUSIC.push(newSong);
         
          

        }
                

                // Get song duration
                const tempAudio = new Audio(newSong.url);
                tempAudio.addEventListener("loadedmetadata", () => {
                    const minutes = Math.floor(tempAudio.duration / 60);
                    const seconds = Math.floor(tempAudio.duration % 60).toString().padStart(2, "0");
                    newSong.length = `${minutes}:${seconds}`;
                    renderSongs();
                });
                renderSongs();
            },
            onError: error => {
                const newSong = {
                    title: file.name,
                    artiste: "Unknown Artist",
                    length: "--:--",
                    file,
                    url: URL.createObjectURL(file)
                };
                ALL_MUSIC.push(newSong);
                renderSongs();
            }
        });
    });

    musicInput.value = "";
});


AUDIO_PLAYER.addEventListener('timeupdate', ()=>{
  const progressWidth = musicLengthLine.clientWidth - progressCircle.clientWidth;
  const percentPlayed = AUDIO_PLAYER.currentTime / AUDIO_PLAYER.duration;
  progressCircle.style.left = `${percentPlayed * progressWidth}px`;

})

renderSongs();
