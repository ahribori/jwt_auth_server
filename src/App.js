import React, { Component } from 'react';
import {
    withRouter,
} from 'react-router-dom';
import url from 'url';
import Particles from 'react-particles-js';

import './style/App.scss';
import routes from './routes';
import particlesDefault from './style/particles/default.json';
import particlesSnow from './style/particles/snow.json';
import particlesNasa from './style/particles/nasa.json';
import particlesMove from './style/particles/move.json';
import bgMountain from './style/images/poly-mountain-dark.jpg';
import bgStar from './style/images/poly-star.jpg';
import bgTown from './style/images/poly-mountain-light.jpg';

class App extends Component {
    componentWillReceiveProps(nextProps) {
        const { pathname } = this.props.location;
        const { query } = url.parse(window.location.href, window.location.search);
        const redirectURL = query ? query.continue : null;
        if (redirectURL) {
            // TODO redirect url + token을 보냈을 때 탈취 위험 고려
            this.redirectTo(`${redirectURL}?token=${this.props.auth.token}`);
            return;
        }
        if (nextProps.isLoggedIn && pathname !== '/myPage') {
            this.redirectTo('/myPage');
        }
    }

    redirectTo = (continueURL) => {
        window.location.replace(continueURL);
    };

    renderParticles = () => {
        const images = [
            bgStar,
            bgMountain,
            bgTown,
        ];
        const particles = [
            particlesDefault,
            particlesMove,
            particlesNasa,
            particlesSnow,
        ];
        const randomImageIndex = Math.round(Math.random() * 2);
        let randomParticleIndex = 0;
        if (randomImageIndex === 0) { // star
            randomParticleIndex = Math.round(Math.random());
        } else { // else
            randomParticleIndex = Math.round(Math.random()) + 2;
        }
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
