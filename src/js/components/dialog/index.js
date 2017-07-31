// 加载模块css
// import './css/dialog.css';
// 加载模板
// import html from './tmpl/dialog.html';

// 加载模块css
import style from './css/dialog.css';
import img from './img/1.png';
// 加载模板
const html = `<div class="${style.dialog}">
                <span class="close ${style.close}">&times;</span>
                <img class="${style.img}" src="${img}" />
            </div>
            `;

/* eslint-disable no-undef */
module.exports = () => {
    const $dialog = $(html).clone();
    $dialog.find('.close').on('click', () => {
        $dialog.fadeOut(() => {
            $dialog.remove();
        });
    });
    $('body').append($dialog);
    $dialog.fadeIn();
};
