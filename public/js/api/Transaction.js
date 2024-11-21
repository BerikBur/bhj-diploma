/**
 * Класс Transaction наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/transaction'
 * */
class Transaction extends Entity {
    static URL = '/transaction';
    
    static create(data) {
        return createRequest({
            url: this.URL,
            method: 'PUT',
            data: data
        });
    }

    static list(account_id) {
        return createRequest({
            url: `${this.URL}?account_id=${account_id}`,
            method: 'GET'
        })
        .then(response => {
            if (response?.success) {
                return response.data;
            }
            return [];
        });
    }

    static remove(id) {
        const formData = new FormData();
        formData.append('id', id);
        
        return createRequest({
            url: this.URL,
            method: 'DELETE',
            data: formData  // отправляем как FormData
        });
    }
}

