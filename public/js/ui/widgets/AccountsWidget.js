/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан');
    }
    this.element = element;
    
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Ищем кнопку создания нового счёта
      const createAccount = e.target.closest('.create-account');
      if (createAccount) {
        // Используем правильный ID модального окна - 'newAccount'
        const modal = App.getModal('createAccount');
        modal.open();
        return;
      }

      // Обработка клика по счету
      const account = e.target.closest('.account');
      if (account) {
        this.onSelectAccount(account);
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  async update() {
    try {
      const response = await Account.list(null);
      
      if (!response || !response.success) {
        console.error('Failed to load accounts:', response);
        return;
      }
      
      this.clear();
      this.renderItem(response.data);
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    // Сохраняем структуру с заголовком, удаляя только счета
    this.element.innerHTML = `
      <li class="header">
          Счета
          <div class="pull-right">
              <span class="create-account label label-success">
                  <span class="fa fa-plus"></span>
                  Новый счёт
              </span>
          </div>
      </li>
    `;
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const accounts = this.element.querySelectorAll('.account');
    accounts.forEach(account => account.classList.remove('active'));
    element.classList.add('active');

    const accountId = element.dataset.id;
    App.showPage('transactions', { account_id: accountId });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const element = document.createElement('li');
    element.className = 'account';  // Оставляем только класс account
    element.dataset.id = item.id;
    element.innerHTML = `
        <a href="#">
          <span>${item.name}</span> /
          <span>${item.sum} ₽</span>
        </a>
    `;
    return element;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    data.forEach(item => {
        const element = this.getAccountHTML(item);
        this.element.appendChild(element);
    });
  }
}
