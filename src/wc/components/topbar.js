import { html, css } from 'lit-element'
import { SunBase } from './sun_base'

import './spacer'

class Topbar extends SunBase {
    static get properties() {
        return {
            title: { type: String },
            project: { type: String },
            authorized: { type: Boolean },
            menuOptions: { type: Array },
            open: { type: Boolean, attribute: false },
        }
    }

    get hasMenu() {
        return this.menuOptions.length > 0 ? true : false;
    }

    constructor() {
        super('Sun-Topbar', 'v0.1.0')
        this.open = false
    }

    firstUpdated() {
        super.firstUpdated()
        this.getIsAuthorized()
    }

    render() {
        return html`
            <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet" />
            <link href="https://cdn.sundstedt.us/css/mobile.css" rel="stylesheet" />
            <link href="https://cdn.sundstedt.us/css/standard.css" rel="stylesheet" />
            
            <div class="topbar">
                ${ this.hasMenu ?
                    html`<button id="menu" class="menu btn btn--icn" @click="${()=> this.toggleMenu() }"><i class="material-icons icn">menu</i></button>` : html``
                }
                <div class="logo"><img src="https://cdn.sundstedt.us/img/logo.png"/></div>
                <div class="title">${ this.title }</div>
                <div class="spc"></div>
                ${ !this.authorized ?
                    html`<button class="btn btn--login" @click="${()=> this.login(this.project, '')}">Login</button>` :
                    html`
                    <form class="logout_form" action="https://iam.sundstedt.us/logout" method="POST">
                        <input id="logout_redirect" type="hidden" name="redirect" value
                    `
                }

            </div>
        `
    }
}