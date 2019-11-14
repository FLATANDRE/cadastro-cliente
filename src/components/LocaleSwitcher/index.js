import React, { Component } from 'react';

import {
    Dropdown,
    Flag
} from 'semantic-ui-react';

import { getCountry, setLocale, text } from '../../services/locales'

const trigger = (
    <span style={{ marginRight: '-15px' }}>
        <Flag name={getCountry()} />
    </span>
)

export default class LocaleSwitcher extends Component {

    handleChange = (e, { value }) => {
        setLocale(value);
        window.location.reload();
    }

    render() {
        return (
            <>
                <Dropdown trigger={trigger}  >
                    <Dropdown.Menu>
                        <Dropdown.Item selected={getCountry()==='br'} disabled={getCountry()==='br'} value="pt-BR" flag="br" text={text("locale_switcher.portugues")} onClick={this.handleChange} />
                        <Dropdown.Item selected={getCountry()==='us'} disabled={getCountry()==='us'} value="en-US" flag="us" text={text("locale_switcher.ingles")} onClick={this.handleChange} />
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}