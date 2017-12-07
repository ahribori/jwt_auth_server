import asyncRoute from '../lib/asyncRoute';

const Login = asyncRoute(() => import('./Login'));
const Join = asyncRoute(() => import('./Join'));
const MyPage = asyncRoute(() => import('./MyPage'));

export {
    Login,
    Join,
    MyPage,
};
