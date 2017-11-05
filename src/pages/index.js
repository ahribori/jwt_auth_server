import asyncRoute from '../lib/asyncRoute';

const Home = asyncRoute(() => import('./Home'))
const About = asyncRoute(() => import('./About'))

export {
    Home,
    About
}
