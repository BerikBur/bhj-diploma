/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  
  /**
   * Получает информацию о счёте
   * */
  static get(id) {
    return createRequest({
      url: `${this.URL}/${id}`,
      method: 'GET'
    });
  }

  static list(attempt = 1, maxAttempts = 3) {
    return createRequest({
      url: this.URL,
      method: 'GET'
    })
    .then(response => {
      if (response?.data) {
        return response.data;
      }
      return [];
    })
    .catch(err => {
      if (attempt < maxAttempts) {
        // Повторяем запрос через небольшую задержку
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(this.list(attempt + 1, maxAttempts));
          }, 1000);
        });
      }
      throw err;
    });
  }

  static create(data) {
    return createRequest({
      url: this.URL,
      method: 'PUT',
      data: {
        name: data.name
      }
    });
  }

  static remove(id) {
    const formData = new FormData();
    formData.append('id', id);
    
    return createRequest({
      url: this.URL,
      method: 'DELETE',
      data: formData
    });
  }
}
