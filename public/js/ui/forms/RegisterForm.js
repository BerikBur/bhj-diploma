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
    try {
      const response = User.register();
    } catch(error) {

    }
    await User.register();
    App.setState( 'user-logged' );
  }
}