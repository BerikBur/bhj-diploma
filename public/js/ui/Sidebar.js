/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки в мобильной версии сайта 
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const body = document.querySelector('body');
    
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        body.classList.toggle('sidebar-open');
        body.classList.toggle('sidebar-collapse');
      });
    }
  }

  /**
   * Инициализирует работу всех кнопок авторизации и разлогинивания
   * */
  static initAuthLinks() {
    // Инициализация кнопок Регистрации и Входа
    //Слушатель/обработчик события для кнопки Регистрация
    //Предназначен открыть форму
    const registrationBtn = document.querySelector('.menu-item_register');
    registrationBtn.addEventListener('click', () => App.openModal('register'));

    //Слушатель/обработчик события для кнопи Вход
    //Предназначен открыть форму
    const logInBtn = document.querySelector('.menu-item_login');
    logInBtn.addEventListener('click', () => App.openModal('login'));

    //Слушатель/обработчик события для кнопки Выход
    //Предназначен для выхода из системы
    const logoutButton = document.querySelector('.menu-item_logout a');
    // Обработчик события для кнопки Выход
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        User.logout((err, response) => {
          if (response && response.success) {
            App.setState('init');
          } else {
            throw new Error('Ошибка при выходе из системы', err);
          };
        });
      });
    }
  }
}