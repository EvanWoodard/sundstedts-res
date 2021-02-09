import { html } from 'lit-element'
import { SunBase } from './sun_base'

class LandingPage extends SunBase {
    constructor() {
        super('Sundstedt-Landing', 'v0.1.0')
    }

    render() {
        return html`<div>Hello, Family!</div>`
    }
}

customElements.define('sun-landing-page', LandingPage)

function loadPageTo(el) {
    const lp = document.createElement('sun-landing-page')
    el.innerHTML = ''
    el.appendChild(lp)
}

export { loadPageTo }