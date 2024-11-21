/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm { 
  //Вызов конструктора родительского класса AsyncForm
  constructor(element) {
    super(element);
  }
  
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  //Вызвать функцию асинхронно
  onSubmit(data) {
    return User.register({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password
    });
  }

  success(response) {
    if (response && response.success) {
      App.getModal('register').close();
      
      // Сначала получаем данные пользователя
      User.current()
        .then(user => {
          if (user) {
            // Только после успешного получения данных пользователя меняем состояние
            App.setState('user-logged');
          } else {
            // Если не удалось получить данные, пробуем еще раз через секунду
            setTimeout(() => {
              User.current().then(user => {
                if (user) {
                  App.setState('user-logged');
                }
              });
            }, 1000);
          }
        });
    } else {
      throw new Error('Ошибка регистрации');
    }
  }

  error(error) {
    console.error('Ошибка регистрации:', error);
    alert('Не удалось зарегистрироваться. Попробуйте позже.');
  }
}