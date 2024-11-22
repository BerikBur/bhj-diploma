/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  constructor(element) {
    super(element);
  }

  onSubmit(data) {
    return Account.create(data);
  }

  success(response) {
    if (response && response.success) {
      App.getModal('createAccount').close();
      this.element.reset();
      
      // Добавляем небольшую задержку перед обновлением
      setTimeout(() => {
        App.update();
      }, 1000);
    }
  }

  error(error) {
    console.error('Ошибка при создании счета:', error);
    alert('Такой счёт уже существует.');
  }
}