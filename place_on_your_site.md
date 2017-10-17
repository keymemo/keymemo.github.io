# Для размещения [keymemo.next][caйт_keymemo.github.io] на своём ресурсе:
- нужен веб сервер работающий по вашему доменному имени и отдающий контент по https с валидным сертификатом
- в корень домена необходимо поместить [исходный код с сайта keymemo.github.io][исходный_код_keymemo.github.io]
- необходим аккаунт Google
- по [ссылке](https://console.developers.google.com/flows/enableapi?apiid=drive) соглашаемся с условиями, создаем проект(автоматически включится *Drive API*)
- жмём *Continue*, затем *Go to credentials*
- на странице *Add credentials to your project* жмём кнопку *Cancel*
- на странице выбираем вкладку *OAuth consent screen*.
 + выбираем нужный *Email*
 + вписываем в *Product name shown to users* имя, которое увидят пользователи
 + остальное по желанию
 + жмем *Save*
- на вкладе *Credentials* выбираем *Create credentials*, затем *Oauth client ID*
 + выбираем тип *Web application*, заполняем *Name*
 + в *Authorized JavaScript origins* вписываем ваш домен (в виде *https://<ваш домен>*)
 + жмем *Create*
- необходимо изменить в scripts/settings.js параметр *CLIENT_ID* полученный ранее (что такое [CLIENT_ID](https://developers.google.com/identity/protocols/OAuth2))
- проверьте доступность api для доступа к [drive.google.com][drive_google_com] и домены, с которых можно запрашивать доступ с этим ID


[caйт_keymemo.github.io]:https://keymemo.github.io/
[исходный_код_keymemo.github.io]:https://github.com/keymemo/keymemo.github.io/
[drive_google_com]:https://drive.google.com
[CryptoJS]:https://code.google.com/archive/p/crypto-js/
[CryptoJS_aes]:https://github.com/jakubzapletal/crypto-js/blob/master/README.md#aes