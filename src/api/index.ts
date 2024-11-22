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
export const bannerAdd = (param) => {
    return request({
        url: '/api/banner/save',
        method: 'put',
        data:param
    });
};

export const deleteBanner = (param) => {
    return request({
        url: '/api/banner/delete',
        method: 'delete',
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
export const productAdd = (param) => {
    return request({
        url: '/api/product/save',
        method: 'put',
        data:param
    });
};
export const productUpdate = (param) => {
    return request({
        url: '/api/product/update',
        method: 'post',
        data:param
    });
};

export const productDelete = (param) => {
    return request({
        url: '/api/product/delete',
        method: 'post',
        data:param
    });
};
export const sysLogin = (param) => {
    return request({
        url: '/api/sys/login',
        method: 'post',
        data:param
    });
};

export const productCategoryList = (param) => {
    return request({
        url: '/api/category/list',
        method: 'get',
        params:param
    });
};

export const productCategoryUpdate = (param) => {
    return request({
        url: '/api/category/update',
        method: 'post',
        data:param
    });
};
export const productCategoryAdd = (param) => {
    return request({
        url: '/api/category/save',
        method: 'put',
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
