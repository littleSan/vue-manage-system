import request from '../utils/request';

// const  BaseURL= 'http://manage.dimei-med.com/back'
export const fetchData = () => {
    return request({
        // url: './mock/table.json',
        method: 'get'
    });
};
export const bannerList = (param) => {
    return request({
        url: '/back/api/banner/list',
        method: 'get',
        params:param
    });
};
export const bannerAdd = (param) => {
    return request({
        url: '/back/api/banner/save',
        method: 'put',
        data:param
    });
};

export const bannerUpdate = (param) => {
    return request({
        url: '/back/api/banner/update',
        method: 'post',
        data:param
    });
};

export const deleteBanner = (param) => {
    return request({
        url: '/back/api/banner/delete',
        method: 'delete',
        params:param
    });
};

export const informationList = (param) => {
    return request({
        url: '/back/api/information/page/list',
        method: 'get',
        params:param
    });
};

export const informationAdd = (param) => {
    return request({
        url: '/back/api/information/save',
        method: 'put',
        data:param
    });
};

export const informationUpdate = (param) => {
    return request({
        url: '/back/api/information/update',
        method: 'post',
        data:param
    });
};

export const informationDelete = (param) => {
    return request({
        url: '/back/api/information/delete',
        method: 'delete',
        params:param
    });
};


export const productList = (param) => {
    return request({
        url: '/back/api/product/page/list',
        method: 'get',
        params:param
    });
};
export const productAdd = (param) => {
    return request({
        url: '/back/api/product/save',
        method: 'put',
        data:param
    });
};
export const productUpdate = (param) => {
    return request({
        url: '/back/api/product/update',
        method: 'post',
        data:param
    });
};

export const productDelete = (param) => {
    return request({
        url: '/back/api/product/delete',
        method: 'delete',
        params:param
    });
};
export const sysLogin = (param) => {
    return request({
        url: '/back/api/sys/login',
        method: 'post',
        data:param
    });
};

export const productCategoryList = (param) => {
    return request({
        url: '/back/api/category/list',
        method: 'get',
        params:param
    });
};

export const productCategoryUpdate = (param) => {
    return request({
        url: '/back/api/category/update',
        method: 'post',
        data:param
    });
};
export const productCategoryAdd = (param) => {
    return request({
        url: '/back/api/category/save',
        method: 'put',
        data:param
    });
};

export const companyInfo = (param) => {
    return request({
        url: '/back/api/company/getInfo',
        method: 'get',
        params:param
    });
};

export const updateCompanyInfo = (param) => {
    return request({
        url: '/back/api/company/update',
        method: 'post',
        data:param
    });
};

export const filePageList = (param) => {
    return request({
        url: '/back/api/file/listPage',
        method: 'get',
        params:param
    });
};
export const fileAdd = (param) => {
    return request({
        url: '/back/api/file/save',
        method: 'post',
        data:param
    });
};

export const fileUpdate = (param) => {
    return request({
        url: '/back/api/file/update',
        method: 'PUT',
        data:param
    });
};

export const deleteFile = (param) => {
    return request({
        url: '/back/api/file/delete',
        method: 'delete',
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
