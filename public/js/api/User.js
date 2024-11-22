/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static URL = '/user';
  
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    localStorage.clear();
    //localStorage.setItem('logout', 'true');
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    //console.log('Current user from localStorage:', localStorage.getItem('currentUser'));
    const userJSON = localStorage.getItem('currentUser');
    return userJSON ? JSON.parse(userJSON) : null;
  }

  /**
   * Получает нформацию о текущем
   * авторизованном ползователе.
   * */
  static async fetch(callback) {
    try {
      const response = await createRequest({
        url: `${this.URL}/current`,
        method: 'GET'
      });
      
      if (response && response.success) {
        this.setCurrent(response.user);
      } else {
        this.unsetCurrent();
      }
      callback(null, response);
    } catch (err) {
      this.unsetCurrent();
      callback(err, null);
    }
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static async login(data) {
    const response = await createRequest({
      url: this.URL + '/login',
      method: 'POST',
      data
    });
    if (response.success) {
      this.setCurrent(response.user);
      App.update();
    }
    return response;
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной регистрации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static async register(data) {
    console.log('User.register called with data:', data);
    try {
        const response = await createRequest({
            url: this.URL + '/register',
            method: 'POST',
            data
        });
        
        console.log('Register response:', response);
        
        if (response && response.success) {
            console.log('Success, setting current user');
            this.setCurrent(response.user);
            return response;
        } else {
            console.log('Response not successful:', response);
            throw new Error(response?.error || 'Ошибка регистрации');
        }
    } catch (error) {
        console.log('Register error:', error);
        throw error;
    }
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static async logout(callback) {
    try {
      const response = await createRequest({
        url: `${this.URL}/logout`,
        method: 'POST',
      });

      if (response && response.success) {
        this.unsetCurrent();
      };
      callback(null, response);
    } catch (error) {
      callback(error, null);
    }
  }
}
