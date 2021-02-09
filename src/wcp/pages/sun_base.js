import { LitElement } from 'lit-element'

export class SunBase extends LitElement {
    static get properties() {
        return {
            name: { type: String, attribute: false },
            version: { type: String, attribute: false }
        }
    }
    constructor(componentName, version) {
        super()
        this.name = componentName
        this.version = version
        this.debug(this.version)
    }

    log(...args) {
        console.log(`${this.name}::log -`, ...args)
    }

    debug(...args) {
        console.debug(`${this.name}::debug -`, ...args)
    }

    warn(...args) {
        console.warn(`${this.name}::warn -`, ...args)
    }

    error(...args) {
        console.error(`${this.name}::error -`, ...args)
    }

    store(key, val) {
        localStorage.setItem(`sun::${this.name}::${key}`, val)
    }

    retrieve(key) {
        return localStorage.getItem(`sun::${this.name}::${key}`)
    }
}