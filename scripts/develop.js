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
            app.header_button.onclick = menuButton;
            app.header_input.onkeyup = app.search_header_input;
            app.header_input.onsearch = app.search_header_input;

            // если запуск с локального диска
            if (app.start_from_local_disk) {
                app.header_input_div.style.width = "100%";
                // скрываем кнопки
                // "Add secret"
                document.getElementById('add_new_secret').style.display = 'none';
                // "Свойства"
                document.getElementById('headerButton').style.display = 'none';
            } else {
                app.header_button.innerHTML = '≣';

            }
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
            // обновить дату последнего изменения списка секретов
            app.last_change_list_secrets.innerHTML = app.data_change_diff_now(app.get_data_change_list_secret());
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
            app.esc_number_press_to_out = 0;
            // выход по кнопке ESC если не было изменений
            document.addEventListener("keyup", esc_to_out);
        },
        // сброс таймера
        reset: function () {
            if (_this && _this.timer && _this.timer !== 0) {
                time_logout = 10;
                if (typeof autosave_in != 'undefined') {
                    autosave_in.innerHTML = time_logout;
                }
            }
            app.esc_number_press_to_out = 0;
        },
        // автоматическое сохранение
        exit: async function () {
            // обновить дату последнего изменения списка секретов
            app.last_change_list_secrets.innerHTML = app.get_data_change_list_secret();
            autosave_in.innerHTML = 'now';
            await app.logout();
        },
        // удаление таймера
        remove: async function () {
            clearTimeout(_this.timer);
        }
    }
}

// обработка нажатия ESC для выхода
esc_to_out = async function (e) {
    if (e.keyCode === 27) { // Escape
        if (app.need_save) {
            document.removeEventListener('keyup', esc_to_out, false);
        } else {
            app.esc_number_press_to_out++;
            //                console.log("esc press " + app.esc_number_press_to_out);
            if (app.esc_number_press_to_out >= default_esc_number_press_to_out) {
                document.removeEventListener('keyup', esc_to_out, false);
                await app.logout();
            }
        }
    } else {
        app.esc_number_press_to_out = 0;
    }
}
