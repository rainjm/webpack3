// 引入css
import '../../css/lib/reset.css';
import '../../css/common/global.css';
import '../../css/common/grid.css';
import '../../css/page/index.css';

/* eslint-disable no-undef */
$('.g-bd').append('<p class="text">这是由js生成的一句话。</p>');

// 增加事件
$('.btn').click(() => {
    require.ensure(['../components/dialog/index.js'], (require) => {
        const Dialog = require('../components/dialog/index.js');
        new Dialog();
    });
});
