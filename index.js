const musicList = document.getElementById("music_list")


const ALL_MUSIC = [
    {
    title:'time',
    artiste:'hans zimmer',
    length:'1:00'
},

    {
    title:'time',
    artiste:'hans zimmer',
    length:'1:00'
}
]



const renderSongs = ()=>{
    
    ALL_MUSIC.forEach((music)=>{
        const MUSIC_CARD = document.createElement("div")
        MUSIC_CARD.className="one_music_card"

        MUSIC_CARD.innerHTML=`<div class="music_image">

                        </div>
                        <div>
                            <span class="song_name">${music.title}</span>
                            <span class="artiste_name">${music.artiste}</span>
                        </div>
                        
                        <span class="time" style="margin-left: 300px;">${music.length}</span>`
        
        musicList.appendChild(MUSIC_CARD);
    })

   
}



renderSongs()