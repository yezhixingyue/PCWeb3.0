# 登录

  1. 取消在勾选记住密码后 本地缓存长时间记住token值的设置
    转 -> 使用cookie记录token： 勾选记住密码状态保存时间30天 否则保存时间1天 (待验证)
    衍生问题：
    1. 本地缓存更改事件触发函数```onstorage```失效，需探讨多开窗口时页面的变化
    2. 下单系统刷新时登录账号token与cookie中token中不一致的情况时需重新更新详情数据， 官网系统此处已调整
    3. cookie可多页面共享， 此处导致的在一个页面中修改账号信息，其它页面信息不会修改的问题（存至cookie内 ? or 重新获取数据）-- （ 主页存储会话缓存 同样存在该问题 ）

  2. 登出时 清除cookie中的token与user
  
## 下单系统快捷方式指向问题

## 配置开关

  assets - js - setup :  useCookie 开关 用于切换cookie使用或缓存使用2种方式

## axios 取值 更改  缓存 ---> cookie

sessionStorage.removeItem('token');
localStorage.removeItem('token');
Cookie.removeCookie('token');

## router 导航守卫 更改
