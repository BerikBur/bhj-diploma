/**
 * Основной метод для выполнения запросов на сервер
 */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    
    return new Promise((resolve, reject) => {
        try {
            const method = options.method || 'GET';
            const url = options.url;
            const formData = options.data;
            const retries = options.retries || 2; // Устанавливаем количество попыток
            let attempt = 0;

            function tryRequest() {
                attempt++;
                
                xhr.open(method, url);

                xhr.timeout = 1000; // Таймаут запроса

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else if (attempt < retries) {
                        setTimeout(tryRequest, 500); // Устанавливаем задержку
                    } else {
                        reject(new Error(xhr.response?.error || `Ошибка ${xhr.status}`));
                    }
                };

                xhr.onerror = function() {
                    if (attempt < retries) {
                        setTimeout(tryRequest, 500); // Устанавливаем задержку
                    } else {
                        reject(new Error('Ошибка сети'));
                    }
                };

                xhr.ontimeout = function() {
                    if (attempt < retries) {
                        setTimeout(tryRequest, 500);
                    } else {
                        reject(new Error('Превышено время ожидания'));
                    }
                };

                if (method !== 'GET' && formData) {
                    if (formData instanceof FormData) {
                        xhr.send(formData);
                    } else {
                        const sendFormData = new FormData();
                        Object.entries(formData).forEach(([key, value]) => {
                            sendFormData.append(key, value.toString());
                        });
                        xhr.send(sendFormData);
                    }
                } else {
                    xhr.send();
                }
            }

            tryRequest();

        } catch (e) {
            console.error('Ошибка в функции запроса createRequest:', e);
            reject(e);
        }
    });
};
