import { css, html } from 'lit-element'
import { SunBase } from './sun_base'

class Toggle extends SunBase {
    static get properties() {
        return {
            toggled: { type: Boolean, reflect: true }
        }
    }

    get _tgl() {
        return this.shadowRoot.querySelector('#tgl')
    }

    constructor() {
        super('Sun-Toggle', 'v0.1.4')
        this.toggled = false
    }

    firstUpdated() {
        super.firstUpdated()
        this._tgl.addEventListener('click', () => {
            this.toggled = !this.toggled
            const e = new CustomEvent('toggle', { 
                detail: {
                    toggled: this.toggled
                }
            })
            this.dispatchEvent(e)
        })
    }

    static getStyles() {
        return css`
            .tgl {
                display: flex;
                width: 100%;
                height: 100%;
                padding: 0 1rem;
            }

            .tgl-track {
                width: 3rem;
                height: 1rem;
                margin-top: auto;
                margin-bottom: auto;
                position: relative;
                background: var(--color--primary);
                border-radius: .5rem;
                -webkit-transition: background-color .4s;
                transition: background-color .4s;
            }

            .tgl-track.toggled {
                background: var(--color--primary-light);
            }

            .tgl-thumb {
                display:block;
                height:inherit;
                position:relative;
                left: -.5rem;
                top: -.5rem;
                height: 2rem;
                width: 2rem;
                z-index: 2;
                border-radius: 50%;
                box-shadow: .2rem 0 .2rem .2rem var(--bxs-color);
                background: var(--color--primary-light);
                cursor: pointer;
                -webkit-transition: .4s;
                transition: .4s;
            }

            .tgl-thumb.toggled {
                -webkit-transform: translateX(2rem);
                -ms-transform: translateX(2rem);
                transform: translateX(2rem);
            }
        `
    }

    render() {
        return html`
            <div id="tgl" class="tgl">
                <div id="track" class="tgl-track ${this.toggled ? 'toggled' : ''}">
                    <span class="tgl-thumb ${this.toggled ? 'toggled' : ''}"></span>
                </div>
            </div>
        `
    }
}

customElements.define('sun-toggle', Toggle)