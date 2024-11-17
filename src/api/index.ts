import request from '../utils/request';
export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};
export const bannerList = (param) => {
    return request({
        url: '/api/banner/list',
        method: 'get',
        params:param
    });
};

export const informationList = (param) => {
    return request({
        url: '/api/information/page/list',
        method: 'get',
        params:param
    });
};

export const productList = (param) => {
    return request({
        url: '/api/product/page/list',
        method: 'get',
        params:param
    });
};
export const sysLogin = (param) => {
    return request({
        url: '/api/sys/login',
        method: 'post',
        data:param
    });
};
export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
