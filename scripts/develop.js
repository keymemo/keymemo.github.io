/*globals app */
/*globals div_show_id, div_hide_id, clear_div, get_div_byId, get_child_div, console */

/**
 * определяем passphrase, запускаем третий этам
 */
set_passphrase = function () {
    //    app.passPhrase =  header_input.value;
    app.passPhrase = (header_input.value === '') ? 'default_PassPhrase' : header_input.value;
    header_input.value = '';
    app.state2();
}

menuButton = function () {
    'use strict';
    div_show_id('div_settings');
};

function state() {
    return {
        state0: function () {
            // ссылка в заголовке
            app.header_link.style.display = 'block';
            // надписть в заголовке
            app.header_input.placeholder = 'KeyMemo';

            app.header_input.type = 'search';
            // ширина поля input в заголовке
            app.header_input_div.style.marginLeft = 140;
            // кнопка ⧖ ☓
            app.header_button.innerHTML = '☓';
            // обработка Enter
            app.header_input.onkeyup = app.keyEnter;
        },
        state1: function () {
            app.header_link.style.display = 'block';
            app.header_input.placeholder = 'Enter pass pharse';
            app.header_input.type = 'password';
            app.header_input_div.style.marginLeft = 140;
            app.header_button.innerHTML = '⊳';
            app.header_button.onclick = set_passphrase;
        },
        state2: function () {
            app.header_link.style.display = 'none';
            app.header_input.placeholder = 'Search';
            app.header_input.type = 'Search';
            app.header_input_div.style.marginLeft = 0;
            app.header_button.innerHTML = '≣';
            app.header_button.onclick = menuButton;
            app.header_input.onkeyup = app.search_header_input;
            app.header_input.onsearch = app.search_header_input;
        }
    }
}

var title_state = state();

var timer_autosave_in = timer_autosave();

// https://habrahabr.ru/post/228325/
fnDelay = (function () {
    'use strict';
    let timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();

// управление автосохранением
function timer_autosave(value) {
    'use strict';
    let time_logout = 0;
    var timer = 0;
    var _this = this;
    return {
        // тики таймера
        tick: function () {
            time_logout--;

            if (time_logout % 2) {
                autosave_in.classList = 'autosave_in';
            } else {
                autosave_in.classList = 'autosave_in_alarm';
            }
            if (time_logout < 1) {
                clearTimeout(_this.timer);
                _this.timer = 0;
                _this.exit();
            }
            autosave_in.innerHTML = time_logout;

        },
        // инициализация таймера
        init: function () {
            _this = this;
            time_logout = 10;
            autosave_in.innerHTML = time_logout;
            _this.timer = setInterval(this.tick, (time_logout * 6000));
            //            _this.timer = setInterval(this.tick, (time_logout * 60));
        },
        // сброс таймера
        reset: function () {
            if (_this && _this.timer && _this.timer !== 0) {
                time_logout = 10;
                if (typeof autosave_in != 'undefined') {
                    autosave_in.innerHTML = time_logout;
                }
            }
        },
        // автоматическое сохранение
        exit: async function () {
            autosave_in.innerHTML = 'now';
            await app.logout();
        },
        // удаление таймера
        remove: async function () {
            clearTimeout(_this.timer);
        }
    }
}
