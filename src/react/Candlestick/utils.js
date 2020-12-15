/*
* @Date: 2020/5/19
* @Author: XueChengwu <xuechengwu@erayt.com>
* @Copyright: 2015-2019 Erayt, Inc.
* @Description: If you have some questions, please contact: xuechengwu@erayt.com.
*/
export default {
  formatDate: (date, format) => {
    let o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(format))
      format=format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(let k in o)
      if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return format;
  },
  addDate: (date, days) => {
    let time = date.getTime();
    let timeDiff = time + days * 24 * 60 * 60 * 1000;
    return new Date(timeDiff);
  },
}
