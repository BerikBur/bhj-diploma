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
  async onSubmit(data) {
    console.log('onSubmit started');
    try {
        console.log('Sending register request with data:', data);
        const response = await User.register({
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password
        });
        
        console.log('Got response:', response);
        
        if (response && response.success) {
            console.log('Перед закрытием модального окна');
            const modal = App.getModal('register');
            console.log('Модальное окно:', modal);
            modal.close();
            console.log('После закрытия модального окна');
            
            const user = User.current();
            if (user) {
                App.setState('user-logged');
            } else {
                setTimeout(() => {
                    const user = User.current();
                    if (user) {
                        App.setState('user-logged');
                    }
                }, 1000);
            }
            
            return response;
        } else {
            console.log('Response not successful:', response);
        }
    } catch (error) {
        console.log('Caught error:', error);
        this.error(error);
        throw error;
    }
  }

  error(error) {
    console.error('Ошибка регистрации:', error);
    alert('Не удалось зарегистрироваться. Попробуйте позже.');
  }
}