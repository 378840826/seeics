import user from './user';
import menu from './menu';
import oauth from './oauth';
import param from './param';
import autoAd from './autoAd';
import ppc from './ppc';
import adManage from './adManage';

/**
 * 模拟数据mock
 *
 * mock是否开启模拟数据拦截
 */

const options = { mock: false };

user(options);

menu(options);

oauth(options);

param(options);

autoAd(options);
// autoAd({ mock: true });

ppc(options);
// ppc({ mock: true });

// adManage(options);
adManage({ mock: true });
