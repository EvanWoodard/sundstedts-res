import { css, html } from "lit-element";
import { SunBase } from "./sun_base";
import './toggle'


class ThemePicker extends SunBase {
    static get properties() {
        return {
            theme: { type: String, attribute: false },
            toggled: { type: Boolean, attribute: false }
        }
    }

    constructor() {
        super('Sun-Theme-Picker', 'v0.1.0-beta.8')
        this.theme = 'light'
        this.toggled = false
    }

    firstUpdated() {
        super.firstUpdated()
        const theme = getComputedStyle(document.documentElement).getPropertyValue('--theme').trim()
        this.debug('Theme', theme)
        if (theme == 'light') { this.toggled = true }
        if (theme == 'dark') { this.toggled = false }
    }

    async changeTheme(e) {
        if (e.detail && e.detail.toggled !== undefined) {
            this.theme = e.detail.toggled ? 'light' : 'dark'
        }

        const resp = await fetch(`https://cdn.sundstedt.us/js/theme.${this.theme}.json`)
        const jresp = await resp.json()
        for (const [key, value] of Object.entries(jresp)) {
            document.documentElement.style.setProperty(key, value)
        }
    }

    static getStyles() {
        return css`
            .picker{
                display: flex;
                flex-direction: row;
            }
        `
    }

    render() {
        this.debug(this.toggled)
        return html`
            <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
            <div class="picker">
                <i class="material-icons icn">dark_mode</i>
                    <sun-toggle .toggled="${this.toggled}" @toggle="${this.changeTheme}"></sun-toggle>
                <i class="material-icons icn">light_mode</i>
            </div>
        `
    }
}

customElements.define('sun-theme-picker', ThemePicker)