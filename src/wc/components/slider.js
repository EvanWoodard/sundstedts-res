import { LitElement, html, css } from 'lit-element'

class Slider extends LitElement {
    static get properties() {
        return {
            moveEvents: { type: Array }
        }
    }

    get max() {
        return 100
    }

    get cachedVol() {
        return localStorage.getItem('sun-slider::vol') || 50
    }

    set cachedVol(vol) {
        const e = new CustomEvent('vol-changed', {
            detail: {
                vol: vol
            }
        })
        this.dispatchEvent(e)
        return localStorage.setItem('sun-slider::vol', vol)
    }

    get _thumb() {
        return this.shadowRoot.querySelector('#thumb')
    }

    get _track() {
        return this.shadowRoot.querySelector('#track')
    }

    get _width() {
        return this._track.clientWidth
    }

    get _zero() {
        return this._track.offsetLeft
    }

    get _full() {
        return this._zero + this._width
    }

    get _moveEvents() {
        const x = this.moveEvents
        this.moveEvents = []
        return x
    }

    constructor() {
        super()
        this.moveEvents = []
        console.log('Sun-Slider v0.1.0')
    }

    firstUpdated() {
        super.firstUpdated()
        this.setProgress(this.cachedVol)
        this._thumb.addEventListener('mousedown', this.setThumbMove.bind(this))
    }

    setThumbMove(e) {
        e.preventDefault()
        const tMove = this.thumbMove.bind(this)
        const tStop = this.thumbStop.bind(this)
        this.moveEvents.push({ label: 'mousemove', func: tMove })
        this.moveEvents.push({ label: 'mouseup', func: tStop })
        document.addEventListener('mousemove', tMove)
        document.addEventListener('mouseup', tStop)
    }

    thumbMove(e) {
        if (e.x < this._zero) {
            this.setProgress(0)
            return
        }

        if (e.x > this._full) {
            this.setProgress(this.max)
            return
        }

        let val = ((e.x - this._zero) / (this._full - this._zero)) * this.max
        console.log('Slider::moveval:', val)
        if (val < 5) { 
            val = 0
        }
        this.setProgress(val)
        console.log('Slider::movevalfinal:', val)
    }

    thumbStop(e) {
        this.thumbMove(e)
        const l = this._moveEvents
        for (let i = 0; i < l.length; i++) {
            document.removeEventListener(l[i].label, l[i].func)
        }
    }

    setProgress(val) {
        this.cachedVol = val
        let tp = val;
        if (tp > 100) tp = 100
        if (tp < 0) tp = 0
        let ta = 100 - val + 4
        if (ta > 100) ta = 100
        let thp = val - 8
        if (thp < 0) thp = 0

        this._track.style.setProperty('--track-progress', tp + '%')
        this._track.style.setProperty('--track-available', ta + '%')
        this._thumb.style.setProperty('--thumb-progress', thp + '%')
    }

    static getStyles() {
        return css`
            .sl-container{
                display: flex;
                width: 100%;
                height: 2rem;
            }

            .sl-track {
                --track-progress: 8%;
                --track-available: 96%;
                width: 100%;
                margin-top: auto;
                margin-bottom: auto;
                position: relative;
            }

            .sl-track:before {
                content: "";
                display:block;
                position: absolute;
                top: .5rem;
                left: 0;
                width: var(--track-progress);
                border-radius: .5rem;
                height: 1rem;
                background: var(--color--primary-light);
            }

            .sl-track:after {
                content: "";
                display:block;
                position: absolute;
                top: .5rem;
                right: 0;
                width: var(--track-available);
                border-radius: .5rem;
                height: 1rem;
                background: var(--color--primary);
            }

            .sl-thumb {
                --thumb-progress: 0%;
                display:block;
                height:inherit;
                position:relative;
                left: var(--thumb-progress);
                height: 2rem;
                width: 2rem;
                z-index: 2;
                border-radius: 50%;
                box-shadow: .2rem 0 .2rem .2rem var(--bg-color);
                background: var(--color--primary-light);
                cursor: pointer;
            }
        `
    }

    render() {
        return html`
            <link href="shared/css/theme.dark.css" rel="stylesheet" />

            <div class="sl-container">
                <div id="track" class="sl-track">
                    <span id="thumb" class="sl-thumb"></span>
                </div>
            </div>
        `
    }
}

customElements.define('sun-slider', Slider)