import React, { Component } from 'react';

import api from "../../services/api";
import { text } from '../../services/locales'

import { Icon, Popup } from 'semantic-ui-react';

export default class Ping extends Component {

    state = {
        online: false
    }

    componentDidMount() {
        this.handlePing();
        this.interval = setInterval(() => this.handlePing(), 30000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handlePing = async e => {
        api.get("/ping?salt=" + (new Date().getTime()))
            .then((response) => {
                if (response.data.ping === "aicare") {
                    this.setState({ online: true })
                } else {
                    this.setState({ online: false })
                }
            })
            .catch((error) => {
                this.setState({ online: false })
            });
    }

    render() {

        const { online } = this.state;

        return (
            <>
                <Popup content={online ? text("ping.online") : text("ping.offline")} trigger={
                    <Icon name='wifi' color={online ? 'green' : 'red'} />
                } />
            </>
        )
    }
}