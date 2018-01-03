/*globals app */
/*globals div_show_id, div_hide_id, clear_div, get_div_byId, get_child_div, console */

/**
 * определяем passphrase, запускаем третий этам
 */
set_passphrase = function () {
    var decrypt_welcome_phrase;
    // если app.passPhrase==='', то назначаем default_PassPhrase=''
    app.passPhrase = (header_input.value === '') ? 'default_PassPhrase' : header_input.value;

    function to_state2() {
        header_input.value = '';
        app.state2();
    }

    // проверяем правильность passPhrase расшифровывая welcome_phrase
    if (localStorage['welcome_phrase']) {
        decrypt_welcome_phrase = app.decrypt(localStorage['welcome_phrase']);
        app.enter_number_press_to_in++;
        if (decrypt_welcome_phrase == "Error decrypting.") {
            // Error decrypting
            document.getElementById('welcome_phrase').classList.add('welcome_phrase_alert');
            if (default_enter_number_press_to_in <= app.enter_number_press_to_in) {
                to_state2();
            }
        } else {
            document.getElementById('welcome_phrase').classList.remove('welcome_phrase_alert');
            to_state2();
        }

    } else {
        to_state2();
    }
    // welcome_phrase
    document.getElementById('welcome_phrase').style.display = 'block';
    document.getElementById('welcome_phrase').innerHTML = decrypt_welcome_phrase;

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
            app.header_input_placeholder.textContent = 'KeyMemo';

            app.header_input.type = 'text';
            // ширина поля input в заголовке
            app.header_input_div.style.marginLeft = 140;
            // кнопка ⧖ ☓
            app.header_button.innerHTML = '☓';
            // обработка Enter
            app.header_input.onkeyup = app.onkeyup;
        },
        state1: function () {
            app.header_link.style.display = 'block';
            app.header_input_placeholder.textContent = 'Enter pass phrase';
            app.header_input.type = 'password';
            app.header_input_div.style.marginLeft = 140;
            app.header_button.innerHTML = '⊳';
            app.header_button.onclick = set_passphrase;
            // обработка ввода для определения раскаладки и Caps Lock
            app.header_input.onkeypress = app.keypress;
        },
        state2: function () {
            app.header_link.style.display = 'none';
            app.header_input_placeholder.textContent = 'Search';
            app.header_input.type = 'Search';
            app.header_input_div.style.marginLeft = 0;
            app.header_button.onclick = menuButton;
            app.header_input.onkeyup = app.search_header_input;
            app.header_input.onsearch = app.search_header_input;
            // отключение обработки ввода
            app.header_input.onkeypress = undefined;
            app.header_input.classList.remove('input_keyboardLayout');
            // inbox_label
            app.header_input_placeholder.classList.remove('inbox_label');
            void app.header_input_placeholder.offsetWidth;
            app.header_input_placeholder.classList.add('inbox_label');

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
                app.isAuthorized = true;
            }
        }
    }
}

var title_state = state();

var timer_autosave_in = timer_autosave();

// управление автосохранением
function timer_autosave(value) {
    'use strict';
    let time_logout = 0;
    var timer = 0;
    var _this = this;

    function pie_restart() {
        // по новой запускаем круговую диаграмму
        app.pie_element.classList = '';
        void app.pie_element.offsetWidth;
        app.pie_element.classList = 'timer_1min';
    }
    return {
        // тики таймера, каждую минуту
        tick: function () {
            // обновить дату последнего изменения списка секретов
            app.last_change_list_secrets.innerHTML = app.data_change_diff_now(app.get_data_change_list_secret());
            time_logout--;
            pie_restart();

            if (time_logout < 1) {
                clearTimeout(_this.timer);
                app.pie_element.classList = '';
                _this.timer = 0;
                _this.exit();
            }
            if (time_logout < 10) {
                app.autosave_in_element.innerHTML = "0" + time_logout;
            } else {
                app.autosave_in_element.innerHTML = time_logout;
            }

        },
        // инициализация таймера
        init: function () {
            _this = this;
            time_logout = 10;
            app.autosave_in_element.innerHTML = time_logout;
            _this.remove();
            _this.timer = setInterval(this.tick, (time_logout * 6000));
            //            _this.timer = setInterval(this.tick, (time_logout * 60));
            app.esc_number_press_to_out = 0;
            // выход по кнопке ESC если не было изменений
            document.addEventListener("keyup", esc_to_out);
            app.timer_div_element.classList.add('element_show');
            pie_restart();
        },
        // сброс таймера
        reset: function () {
            if (_this && _this.timer && _this.timer !== 0) {
                time_logout = 10;
                if (typeof app.autosave_in_element != 'undefined') {
                    _this.init();
                }
            }
            app.esc_number_press_to_out = 0;
        },
        // автоматическое сохранение
        exit: async function () {
            app.timer_div_element.classList.add('element_hidden');
            // обновить дату последнего изменения списка секретов
            app.last_change_list_secrets.innerHTML = app.get_data_change_list_secret();
            app.autosave_in_element.innerHTML = 'now';
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
