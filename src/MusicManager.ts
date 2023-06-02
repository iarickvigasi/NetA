
const LIST_OF_SONGS = [
    '/music/HoliznaCC0 - An Ocean in Outer Space.mp3',
    '/music/HoliznaCC0 - Burning In The Atmosphere.mp3',
];

export default class MusicManager {
    private audioContext: AudioContext;
    private songs: any[];
    private currentIndex: number;
    constructor() {
        this.audioContext = new AudioContext();
        this.songs = LIST_OF_SONGS;
        this.currentIndex = 0;
    }

    async playNextSong() {
        if (this.songs.length === 0) {
            console.error('No songs available to play');
            return;
        }

        const songURL = `${this.songs[this.currentIndex]}`;
        const response = await fetch(songURL);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Create a GainNode and set the volume to 0.01
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 0.1;

        // Connect the source to the gainNode and gainNode to the destination
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        source.start();

        source.onended = () => {
            this.currentIndex = (this.currentIndex + 1) % this.songs.length;
            this.playNextSong();
        };
    }

    async start() {
        this.playNextSong();
    }
}