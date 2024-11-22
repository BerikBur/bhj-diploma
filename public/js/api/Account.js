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
  static async get(id) {
    try {
      const response = await createRequest({
        url: `${this.URL}/${id}`,
        method: 'GET' 
      });

      if (response && response.success) {
        return response;
      }
    } catch (error) {
      throw new Error('Ошибка', error);
    } 
  }

  static async list(data) {
    try {
      const response = await createRequest({
        url: this.URL,
        method: 'GET',
        data
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async create(data) {
    try {
      return await createRequest({
        url: this.URL,
        method: 'PUT',
        data: {
          name: data.name
        }
      });
    } catch (err) {
      throw err;
    }
  }

  static async remove(id) {
    try {
      const formData = new FormData();
      formData.append('id', id);
      
      return await createRequest({
        url: this.URL,
        method: 'DELETE',
        data: formData
      });
    } catch (err) {
      throw new Error('Ошибка при удалении счёта', err);
    }
  }
}
