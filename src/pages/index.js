import asyncRoute from '../lib/asyncRoute';

const Login = asyncRoute(() => import('./Login'));
const Join = asyncRoute(() => import('./Join'));
const MyPage = asyncRoute(() => import('./MyPage'));
const MyApplication = asyncRoute(() => import('./MyApplication'));
const Users = asyncRoute(() => import('./Users'));

export {
    Login,
    Join,
    MyPage,
    MyApplication,
    Users,
};
