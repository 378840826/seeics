import request from '@/router/axios';

//获取表格数据，修改排序，修改表格页数
export const getkeywordList = (current, size, formInline) => {
    return request({
      url: '/api/seeics-analysis/keyword-ranking/page',
      method: 'get',
      params: {
        current,
        size,
        attachId: formInline.attachId,
        searchCountry: formInline.searchCountry,
      }
    })
}

//发起关键词分析
export const analysiskeyword = (params,id) => {
    return request({
      url: '/api/seeics-analysis/keyword-ranking/analyze',
      method: 'post',
      data: {
        ...params,
        id,
      },  
    })
}

//导出
export const exportKeyword = (id) => {
    return request({
      url: `/api/seeics-analysis/keyword-ranking/download?id=${id}`,
      method: 'get',
      responseType: 'blob'
    })
}

//选择文件
export const selectFile = () => {
    return request({
      url: '/api/blade-resource/attach/user/templateList',
      method: 'post'
    })
}

//关键字导入
export const importKeyword = (data) => {
    return request({
      url: '/api/seeics-analysis/keyword-ranking/import',
      method: 'post',
      data,
    })
}
