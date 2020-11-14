import { LitElement, html, css } from 'lit-element'
import './slider'

class AudioPlayer extends LitElement {
    static get properties() {
        return {
            vol: { type: Number },
            currentTrackPos: { type: Number },
            currentTrackId: { type: String },
            looping: { type: Boolean },
            tracks: { type: Array }
        }
    }

    get _audio() {
        return this.shadowRoot.querySelector('#audio');
    }

    get _vol() {
        return this.vol || 50
    }

    set _vol(vol) {
        this.vol = vol
        if (this.vol < 1) {
            this._audio.muted = true
        } else {
            this._audio.volume = this.vol / 100
            this._audio.muted = false
        }
        this.update()
    }

    get _trackPath() {
        return this.trackURL + this.currentTrackId
    }

    get _playing() {
        if (!this._audio) return false 
        return !this._audio.paused
    }

    get _muted() {
        if (!this._audio) return false
        return this._audio.muted
    }

    constructor() {
        super()
        console.log('Sun-Audio v0.1.1')
        this.tracksURL = 'https://evenson.sundstedt.us/music/tracks'
        this.trackURL = 'https://evenson.sundstedt.us/music/track/'
        this.currentTrackPos = 0
        this.currentTrackId
        this.looping = false
        this.tracks = []

        this.addEventListener('tracks-loaded', e => { 
            console.log(e)
            this.tracks = e.detail
            this.playTrack(this.tracks[0].id, 0)
        })
    }

    static getStyles() {
        return css`
            .btn--track{
                color: var(--color--text-on-primary);
                background-color: var(--bg-color);
                width: 100%;
                height: 5.6rem;
                border-radius: unset;
                text-transform: unset;
                padding: 1.2rem;
            }
            .btn--track.active{ background-color: var(--bg-color--light); border-left: .4rem inset var(--color--primary-light); }
            .btn--track .artist{ font-size: 1.2rem; }
            .track-list{ background-color: var(--bg-color--light); color: var(--color--text-on-primary); height: 100%; box-shadow: -1rem 0px 2rem .4rem var(--color--box-shadow); }
            .track-list--header{ display: flex; align-items: center; box-shadow: 0 4px 2px -2px var(--color--box-shadow); height: 5rem; padding: 0 1.4rem; }
            .audio-content{ padding: 2rem; }
        `
    }

    render() {
        return html`
            <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
            <link href="https://res.sundstedt.us/css/theme.dark.css" rel="stylesheet" />
            <link href="https://res.sundstedt.us/css/mobile.css" rel="stylesheet" />
            <link href="https://res.sundstedt.us/css/standard.css" rel="stylesheet" />

            <div class="row full-height">
                <div class="col col-5">
                    <audio controls id="audio" class="hidden">
                        <source src="${this._trackPath}" type="audio/mpeg">
                    </audio>
                </div>
                <div class="col col-3 track-list">
                    <div class="col--header track-list--header">
                        <i class="material-icons icn--btn" @click="${() => { this.getPrevTrack(true) } }">skip_previous</i>
                        <i class="material-icons icn--btn" @click="${this.togglePlay}">
                            ${ this._playing ? "pause" : "play_arrow" }
                        </i>
                        <i class="material-icons icn--btn" @click="${() => { this.getNextTrack(true) } }">skip_next</i>
                        <hr style="width: .1rem; height: 68%; background: var(--bg-color); margin: 0 2rem; border: none;"></hr>
                        ${  this.looping ?
                            html`<i class="material-icons icn--btn icn--active" @click="${this.toggleLoop}">repeat</i>`:
                            html`<i class="material-icons icn--btn" @click="${this.toggleLoop}">repeat</i>`
                        }
                        <div class="spc"></div>
                        <!-- <input id="vol" type="range" min="0" max="80" step="1" value="80"></input> -->
                        <sun-slider @vol-changed="${this.changeVol}" style="width: 15rem; padding-right: 1.4rem;"></sun-slider>
                        <i class="material-icons icn--btn" @click="${this.toggleMute}">
                            ${ this._muted ? "volume_off" : "volume_up" }
                        </i>
                    </div>
                    ${ this.tracks.map((t, i) => {
                        return html`
                            <div
                                class="btn btn--track ${ t.id == this.currentTrackId ? 'active' : '' }"
                                @click="${() => { this.playTrack(t.id, i) }}"
                            >
                                <div class="row title">${t.title}</div>
                                <div class="row artist">${t.artist}</div>
                            </div>
                        `
                    }) }
                </div>
            </div>
        `;
    }

    firstUpdated() {
        super.firstUpdated()
        this._audio.addEventListener('ended', this.getNextTrack.bind(this))
        this.getTracks()
    }

    async getTracks() {
        const resp = await fetch(this.tracksURL)
        if (resp.ok) {
            const body = await resp.json()
            let tLoaded = new CustomEvent('tracks-loaded', { detail: body['tracks'] })
            this.dispatchEvent(tLoaded)
        }
    }

    togglePlay() {
        if (this._audio.paused) {
            this._audio.play()
        } else {
            this._audio.pause()
        }
        this.update()
    }

    playTrack(id, i) {
        this.currentTrackPos = i
        this.currentTrackId = id
        // this.update()
        this._audio.load()
        this._audio.play()
    }

    changeVol(e) {
        if (e.detail && e.detail.vol !== undefined) {
            this._vol = e.detail.vol
        }
    }

    getNextTrack(override) {
        let i = this.currentTrackPos
        if (i + 1 > this.tracks.length-1) {
            if (this.looping || override) {
                i = -1
            } else {
                return
            }
        }
        const next = i + 1

        this.playTrack(this.tracks[next].id, next)
    }

    getPrevTrack(override) {
        let i = this.currentTrackPos
        if (i == 0) {
            if (this.looping || override) {
                i = this.tracks.length
            } else {
                return
            }
        }
        const next = i - 1

        this.playTrack(this.tracks[next].id, next)
    }

    toggleLoop() {
        this.looping = !this.looping
    }

    setVolume(e) {
        this._audio.volume = e.target.value / 100;
    }

    toggleMute() {
        this._audio.muted = !this._audio.muted
        this.update()
    }
}

customElements.define('sun-audio-player', AudioPlayer)