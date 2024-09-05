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
