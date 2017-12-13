import React, { Component } from 'react';
import {
    withRouter,
} from 'react-router-dom';
import Particles from 'react-particles-js';

import './style/App.scss';
import routes from './routes';
import particlesSnow from './style/particles/snow.json';
import particlesNasa from './style/particles/nasa.json';
import bg0 from './style/images/0.jpg';
import bg1 from './style/images/1.jpg';
import bg2 from './style/images/2.jpg';
import bg3 from './style/images/3.jpg';
import bg4 from './style/images/4.jpg';
import bg5 from './style/images/5.jpg';
import bg6 from './style/images/6.jpg';
import bg7 from './style/images/7.jpg';
import bg8 from './style/images/8.jpg';
import bg9 from './style/images/9.jpg';
import bg10 from './style/images/10.jpg';

class App extends Component {
    componentWillReceiveProps(nextProps) {
        const { pathname } = this.props.location;
        if (nextProps.isLoggedIn && pathname !== '/myPage') {
            this.redirectTo('/myPage');
        }
    }

    redirectTo = (continueURL) => {
        window.location.replace(continueURL);
    };

    renderParticles = () => {
        const images = [bg0, bg1, bg2, bg3, bg4, bg5, bg6,
            bg7, bg8, bg9, bg10];
        const particles = [
            particlesNasa,
            particlesSnow,
        ];
        const randomImageIndex = Math.round(Math.random() * 10);
        const randomParticleIndex = Math.round(Math.random());
        document.body.style.backgroundImage = `url(${images[randomImageIndex]})`;
        return (<Particles
            className="particles"
            width="100vw"
            height="100vh"
            params={particles[randomParticleIndex]}
            key={2}
        />);
    };

    render() {
        return [
            <div className="App" key={1}>
                {routes}
            </div>,
            this.renderParticles(),
        ];
    }
}

export default withRouter(App);
