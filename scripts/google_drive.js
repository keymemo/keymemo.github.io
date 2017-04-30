/*global self */
/*jslint bitwise: true, indent: 4,   plusplus: true */

/*
 не забывать поправлять на
 https://console.developers.google.com/apis/credentials?project=keymemo-org
поле "Разрешенные источники JavaScript"
должно содержать адрес сервера, например
http://127.0.0.1:62221
http://keymemo.erchov.ru:13425
*/









/******************** GLOBAL VARIABLES ********************/
/*
var SCOPES = ['https://www.googleapis.com/auth/drive', 'profile'];
var CLIENT_ID = '755812565959-j9s33gfg3s2n33ssr0v4romk7b9eod3h.apps.googleusercontent.com';
var FOLDER_NAME = "";
var FOLDER_ID = "root";
var FOLDER_PERMISSION = true;
var FOLDER_LEVEL = 0;
var NO_OF_FILES = 1000;
var DRIVE_FILES = [];
var FILE_COUNTER = 0;
var FOLDER_ARRAY = [];
*/

/******************** AUTHENTICATION ********************/
var CLIENT_ID = '755812565959-j9s33gfg3s2n33ssr0v4romk7b9eod3h.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';
/******************** END AUTHENTICATION ********************/

/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {
    window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 * Проверка авторизован ли текущий пользователь
 */
function checkAuth() {
    gapi.auth.authorize({
            'client_id': CLIENT_ID,
            'scope': SCOPES,
            'immediate': true
        },
        handleAuthResult);
}

/**
 * Called when authorization server replies.
 * разбор ответа сервера авторизации
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authButton = document.getElementById('authorizeButton');
    var filePicker = document.getElementById('filePicker');
    var uploadButton = document.getElementById('uploadButton');
    authButton.style.display = 'none';
    filePicker.style.display = 'none';
    uploadButton.style.display = 'none';
    if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        filePicker.style.display = 'block';
        filePicker.onchange = loadImageFile;
        uploadButton.onclick = UploadSecretsOnGoogleDrive;
        show_span("Ok   ");
    } else {
        // No access token could be retrieved, show the button to start the authorization flow.
        authButton.style.display = 'block';
        authButton.onclick = function () {
            gapi.auth.authorize({
                    'client_id': CLIENT_ID,
                    'scope': SCOPES,
                    'immediate': false
                },
                handleAuthResult);
        };
    }
}

//loadScript("https://apis.google.com/js/client.js?onload=handleClientLoad");
function exportHTML() {
    const fileTitle = "keymemo.html";

    const mimeType = "text/html";
}


function getData(url) {
    return (dispatch, getState) => {
        let timeout = new Promise((resolve, reject) => {
            setTimeout(reject, 300, 'request timed out');
        })
        let fetch = new Promise((resolve, reject) => {
            fetch(url)
                .then(response => response.json())
                .then(json => resolve(json))
                .catch(reject)
        })
        return Promise
            .race([timeout, fetch])
            .then(json => dispatch(getDataSuccess(json)))
            .catch(err => dispatch(getDataTimeoutOrError(err)))
    }
}



//загрузка файла на drive.google
function UploadSecretsOnGoogleDrive(evt) {
    gapi.client.load('drive', 'v2', function () {
        //var theImage = document.getElementById('editedImage');
        //        var fileTitle = theImage.getAttribute('fileName');
        var fileTitle = "keymemo.html";

        var mimeType = "text/html";
        //        var mimeType = theImage.getAttribute('mimeType');
        var metadata = {
            'title': fileTitle,
            'mimeType': mimeType
        };

        // async function
        async function fetchAsync(url) {
            // await response of fetch call
            let response = await fetch(url, {
                mode: 'no-cors'
            });
            // only proceed once promise is resolved
            //            let data = await response.json();
            let text = await response.text();
            // only proceed once second promise is resolved
            return text;
        }



        //на входе узел script
        async function load(url) {
            'use strict';
            let response = await fetch(url, {
                mode: 'no-cors'
            });
            //    fetch_out = response.text();
            //return response.text();
            return response;
        }

        function get_scripts(script) {
            'use strict';
            let result = load(script.src);
            return result;
        }


        // сохранение текущего содержимого window в файл
        // ссылки на скрипты заменяем на включения самих файлов
        function create_fallback_html() {
            var result = "";
            // сохраняем сюда
            //var fragment = document.createDocumentFragment();
            //  fragment.innerHTML = "<!DOCTYPE html>" + document.getElementsByTagName('html')[0].innerHTML;
            //        var html = document.getElementsByTagName('html')[0];
            // в html вся страница




            var html = "<!DOCTYPE html>" + document.documentElement;
            //интегрируем скрипты в страницу
            function js_script_integrate(node) {
                // количество узлов
                var count_nodes = node.childElementCount;
                var i = 0;
                for (; i < count_nodes; i++) {

                }


            }

            // обработки body
            var body = document.createDocumentFragment();
            body = document.documentElement;
            //все скрипты
            var scripts = body.getElementsByTagName('script')
            for (i = 0; i < scripts.length; i++) {
                var script_innerHTML = "";
                script_innerHTML = fetchAsync(scripts[i].src);
            }
            return result;
        }
        var html = document.getElementsByTagName('html')[0];
        //        var base64Data = window.btoa(unescape(html.innerHTML));
        var base64Data = ("<!DOCTYPE html>" + html.innerHTML).b64encode();
        var base64Data = create_fallback_html();
        newInsertFile(base64Data, metadata);
    });
}

/**
 * загрузка нового файла
 *
 * @param {Image} Base 64 image data
 * @param {Metadata} Image metadata
 * @param {Function} callback Function to call when the request is complete.
 */
function newInsertFile(base64Data, metadata, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var contentType = metadata.mimeType || 'application/octet-stream';
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {
            'uploadType': 'multipart'
        },
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });
    if (!callback) {
        callback = function (file) {
            alert('done');
        };
    }
    request.execute(callback);
}






function loadImageFile(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.file = file;
    //reader.onload = onImageReaderLoad;
    reader.onload = onSecretsLoad;
    reader.readAsDataURL(file);
}

function onSecretsLoad(evt) {
    var file = this.file;
    var mimeType = file.type;
    uploadButton.style.display = 'block';

    //writeSomeText(file.name, file.type, evt.target.result);
}

/*function onImageReaderLoad(evt) {
    var file = this.file;
    var mimeType = file.type;
    //writeSomeText(file.name, file.type, evt.target.result);
}*/

function newUploadFile(evt) {
    gapi.client.load('drive', 'v2', function () {
        var theImage = document.getElementById('editedImage');
        var fileTitle = theImage.getAttribute('fileName');
        var mimeType = theImage.getAttribute('mimeType');
        var metadata = {
            'title': fileTitle,
            'mimeType': mimeType
        };
        var pattern = 'data:' + mimeType + ';base64,';
        var base64Data = theImage.src.replace(pattern, '');
        newInsertSecret(base64Data, metadata);
    });
}


/**
 * Закачка файла.
 *
 * @param {Image} Base 64 image data
 * @param {Metadata} Image metadata
 * @param {Function} callback Function to call when the request is complete.
 */
function newInsertSecret(base64Data, metadata, callback) {
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var contentType = metadata.mimeType || 'application/octet-stream';
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {
            'uploadType': 'multipart'
        },
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });
    if (!callback) {
        callback = function (file) {
            alert('done');
        };
    }
    request.execute(callback);
}


// загружаем скрипт и авторизуемся на гугле
loadScript("https://apis.google.com/js/client.js?onload=handleClientLoad");



//checkAuth();

/*gapi.auth2.init({
      client_id: CLIENT_ID
    });
*/
/*gapi_init = function () {
    gapi.auth2.init({
        client_id: CLIENT_ID
    });
}*/



function showUserInfo() {
    var request = gapi.client.drive.about.get();
    request.execute(function (resp) {
        if (!resp.error) {
            show_span(resp.name);
            show_span(formatBytes(resp.quotaBytesTotal));
            show_span(formatBytes(resp.quotaBytesUsed));
            show_span(resp.items);
            //    show_span(app.get_gDrive_userName());


            //            $("#drive-info").show();
            //            $("#span-name").html(resp.name);
            //            $("#span-totalQuota").html(formatBytes(resp.quotaBytesTotal));
            //            $("#span-usedQuota").html(formatBytes(resp.quotaBytesUsed));
        } else {
            show_span(resp.error.message);
            //            showErrorMessage("Error: " + resp.error.message);
        }
        return resp;
    });
}

function gDrive(field) {
    var request = gapi.client.drive.about.get();
    var result = "";
    request.execute(function (resp) {
        if (resp.error) {
            show_span(resp.error.message);
            result = resp.error.message;
        } else {
            if (field === "name") {
                result = resp.name;
            }
        }
    });
    return result;
}



//This will get the files information
function getFiles() {
    var query = "";
    //if (ifShowSharedFiles()) {
    //$(".button-opt").hide();
    query = (FOLDER_ID == "root") ? "trashed=false and sharedWithMe" : "trashed=false and '" + FOLDER_ID + "' in parents";
    if (FOLDER_ID != "root" && FOLDER_PERMISSION == "true") {
        //$(".button-opt").show();
    }
    //	}else{
    //$(".button-opt").show();
    //query = "trashed=false and '" + FOLDER_ID + "' in parents";
    //	}
    var request = gapi.client.drive.files.list({
        'maxResults': NO_OF_FILES,
        'q': query
    });

    request.execute(function (resp) {
        if (!resp.error) {
            showUserInfo();
            DRIVE_FILES = resp.items;
            //            buildFiles();
        } else {
            //     showErrorMessage("Error: " + resp.error.message);
        }
    });
}


//function to return bytes into different string data format
function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
    else return (bytes / 1073741824).toFixed(3) + " GB";
};


function show_span(value) {
    var span = document.getElementById('span-google-test');
    span.innerHTML = span.innerHTML + value + "<br>";
}

