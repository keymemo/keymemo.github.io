// настройк jslint
/*jslint vars: true,plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jslint white: true */
/*jslint browser: true*/

//upp
/*
var ABC = new Array('', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
*/
var ABC = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

//=
var abc =['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
//dig
var digit =['', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
// spec
var spec = [',', '.', '/', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '~', '<', '>', '?', ':'];

// случайное число от x до y
function rnd(x, y, z) {
    'use strict';
    var num = 0;
    do {
        num = parseInt(Math.random() * z);
        if (num >= x && num <= y) {
            break;
        }
    } while (true);
    return (num);
}

/**
 * Генерируем пароль
 */
function gen_pass() {
    'use strict';
    var password_value = '';
    var znak, s,
        k = 0,
        i,
        r = 0;
    var n = document.form_password_generate.password_lenght.value;
    var pass = [];
    var w = rnd(30, 80, 100);
    for (r = 0; r < w; r++) {
        if (form_password_generate.pass_ABC.checked) {
            znak = rnd(1, ABC.length - 1, 100);
            pass[k] = ABC[znak];
            k++;
        }
        if (form_password_generate.pass_abc.checked) {
            znak = rnd(1, abc.length - 1, 100);
            pass[k] = abc[znak];
            k++;
        }
        if (form_password_generate.pass_0_9.checked) {
            znak = rnd(1, digit.length - 1, 100);
            pass[k] = digit[znak];
            k++;
        }
        if (form_password_generate.pass_spec.checked) {
            znak = rnd(1, spec.length - 1, 100);
            pass[k] = spec[znak];
            k++;
        }
        // есл=и не выбраны символы для пароля
        if (k === 0) {
            break;
        }
    }
    // если не выбраны символы для пароля
    if (k === 0) {
        password_value = '123qwe';
    } else {
        for (i = 0; i < n; i++) {
            s = rnd(1, k - 1, 100);
            password_value += pass[s];
        }
    }
    document.form_password_generate.Password_for_insert.value = password_value;
}

// кнопка insert
function insertPassword(div_input) {
    'use strict';
    if (div_input.value !== '') {
        div_hide_id('div_password_generate');

        GeneratedPassword.focus();
        GeneratedPassword.value = document.form_password_generate.Password_for_insert.value;
    }
}
