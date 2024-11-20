/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = ({ url, method, responseType, data, callback }) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.responseType = responseType;

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300) {
            callback(null, xhr.response);
        } else {
            callback(new Error(`Ошибка запроса: ${xhr.status}`));
        }
    };

    xhr.onerror = () => {
        callback(new Error('Ошибка сети'));
    }

    if(method === 'POST' && data) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
};
