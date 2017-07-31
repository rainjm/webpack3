// 引入css
import '../../css/lib/reset.css';
import '../../css/common/global.css';
import '../../css/common/grid.css';
import '../../css/page/list.css';

let html = '';
for (let i = 0; i < 5; i++) {
    html += `<li>列表 ${i + 1} </li>`;
}
/* eslint-disable no-undef */
$('#list').html(html);
