# Менеджер для хранения паролей
с открытым исходным кодом. 
С помощью этого менеджера свои секреты можно и [нужно][place_on_your_site] хранить на своих мощностях.

## Концепция
- приложение в виде одной веб-страницы, в теле которой хранятся в зашифрованном виде значения секретных полей
- все значения полей  шифруются одним ключом шифрования (passphrase), алгоритм AES
- секреты хранятся в кеше браузера, что обеспечивает доступ в отстутсвии интернета.
- страница хранится в выбранной папке на [drive.google.com][drive_google_com] - ещё одна степень защиты
- история изменений/дополнений списка секретов хранится на [drive.google.com][drive_google_com] в виде файлов с секретами, дата записи файла отражается в имени файла
- каждая сохраненная страница автономна, т.е. можно имея только страницу получить доступ к своим секретам
- создавался как замена менеджеру паролей [keymemo.com][caйт_keymemo.com]

Официальный сайт KeyMemo.next - [keymemo.github.io][caйт_keymemo.github.io].

Весь исходный код доступен на [github.com/keymemo/keymemo.github.io][исходный_код_keymemo.github.io]



## Подробности:
- доменное имя и сертификат «не зависят» от третьих лиц, кавычки можно убрать если разместить на своих мощностях
- секреты хранятся в одном файле html
- работает без интернета (конечно до пропадания интернета надо хотя бы раз зайти браузером, браузер закеширует)
- только чистый js, не используются фреймворки и flash
- никаких ссылок на внешние ресурсы, все библиотеки на борту, за исключением гугловских для доступа к [drive.google.com][drive_google_com]
- работает в Chrome, в Yandex-браузере и в Firefox. В том числе под мобильными версиями
- файл с секретами хранится на вашем [drive.google.com][drive_google_com] в отдельной (выбранной) папке, можно создать отдельный аккаунт для хранения секретов
- каждый раз при сохранении на [drive.google.com][drive_google_com] сохраняется новый файл, который в дальнейшем используется как основной
- секреты также сохраняется в localStorage браузера (в шифрованном виде)
- список секретов обернут в `<div></div>` и имеет `id="div_list_secrets"`
- секреты состоят из записей, секрет обернут в `<div></div>`
- каждая запись обернута в `<div></div>`
- запись это пара значений `имя поля`/`значение поля`
- «имя поля» не шифруется
- `значение поля` шифруется ключом шифрования (**passphrase**), реализация алгоритма [AES][CryptoJS_aes], библиотеки шифрования из проекта [CryptoJS][CryptoJS], можете поменять на свой алгоритм
- значение дешифруется при получении полем ввода фокуса и шифруется в момент потери фокуса полем ввода и сохраняется в виде шифрованного значения в innerHTML
- запись может быть одного из 4 типов (`обычная`, `пароль` — поможет сгенерировать, `ссылка` — при нажатии на название откроет новую вкладку, `заметка` — многострочный текст
- обязательные записи секрета это `Name`, `Login`, `Password`, `Tags`
- обязательные записи не удаляются
- остальные записи не обязательны, могут добавлятся и удалятся.
- флаг удаления хранится в `data-removable`, по умолчанию `false`
- количество записей в секрете не ограничено
- количество секретов не ограничено
- поиск ведется по всем `значениям поля`
- сайтом удобно (на мой взгляд) пользоваться со смартфона
- есть импорт из файлов [keymemo.com](https://keymemo.com)
- есть импорт из файлов [keymemo.github.io][caйт_keymemo.github.io]
- весь код доступен [github.com/keymemo/keymemo.github.io][исходный_код_keymemo.github.io]
- можно и [нужно][place_on_your_site] разместить на своём ресурсе
- резервная копия делается из настроек. Полученный файл содержит всё, что необходимо для доступа к паролям. Доступа к [drive.google.com][drive_google_com] браузер из локального файла не даст.

### [Инструкция по размещению на своём ресурсе][place_on_your_site].


[caйт_keymemo.github.io]:https://keymemo.github.io/
[caйт_keymemo.com]:https://keymemo.com/
[исходный_код_keymemo.github.io]:https://github.com/keymemo/keymemo.github.io/
[drive_google_com]:https://drive.google.com
[CryptoJS]:https://code.google.com/archive/p/crypto-js/
[CryptoJS_aes]:https://github.com/jakubzapletal/crypto-js/blob/master/README.md#aes
[place_on_your_site]:https://github.com/keymemo/keymemo.github.io/blob/master/place_on_your_site.md