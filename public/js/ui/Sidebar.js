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
    const logoutButton = document.querySelector('.menu-item_logout a');
    
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        User.logout((err, response) => {
          if (response && response.success) {
            // После успешного выхода перезагружаем страницу
            window.location.reload();
          }
        });
      });
    }
  }
}