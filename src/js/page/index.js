// 引入css
import '../../css/lib/reset.css';
import '../../css/common/global.css';
import '../../css/common/grid.css';
import '../../css/page/index.css';


function getComponent() {
    return import(/* webpackChunkName: "lodash" */ 'lodash').then((_) => {
        const element = document.createElement('div');
        element.innerHTML = _.join([
            'Hello', 'webpack'
        ], ' ');
        return element;
    }).catch((error) => {
        console.log(error);
    });
}

async function getComponent2() {
    const element = document.createElement('div');
    const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');

    element.innerHTML = _.join([
        'Hello', 'webpack'
    ], ' ');

    return element;
}

/* eslint-disable no-undef */
$('.g-bd').append('<p class="text">这是由js生成的一句话。</p>');

$('.btn').click(() => {
    require.ensure(['../components/dialog/index.js'], (require) => {
        const Dialog = require('../components/dialog/index.js');
        new Dialog();
    });

    getComponent().then((component) => {
        document.querySelector('.g-hd').appendChild(component);
    });

    getComponent2().then((component) => {
        document.querySelector('.g-bd').appendChild(component);
    });
});
