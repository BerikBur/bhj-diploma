/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Элемент не передан');
    }
    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      setTimeout(() => {
        this.render(this.lastOptions);
      }, 200);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методам TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    // Обработчик удаления счета
    document.querySelector('.remove-account').addEventListener('click', () => {
      this.removeAccount();
    });
    
    // Обработчик удаления транзакций
    document.querySelector('.content-wrapper').addEventListener('click', e => {
        const transactionRemoveButton = e.target.closest('.transaction__remove');
        if (transactionRemoveButton) {
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем всплытие события
            const transactionId = transactionRemoveButton.dataset.id;
            this.removeTransaction(transactionId);
        }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  async removeAccount() {
    if (!this.lastOptions) {
        throw new Error('Не переданы данные счета');
    }

    if (!confirm('Вы действительно хотите удалить счёт?')) {
        return;
    }

    try {
        const response = await Account.remove(this.lastOptions.account_id);
        if (response && response.success) {
            this.clear();
            try {
                await App.updateWidgets();
                await App.updateForms();
            } catch (updateError) {
                console.error('Ошибка при обновлении интерфейса:', updateError);
                alert('Счёт удален, но не удалось обновить интерфейс. Пожалуйста, перезагрузите страницу.');
            }
        }
    } catch (err) {
        console.error('Ошибка при удалении счета:', err);
        alert('Не удалось удалить счёт');
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте ткщую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (!id) {
      console.error('Не передан ID транзакции');
      return;
    }

    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove(id)
        .then(response => {
          if (response && response.success) {
            return new Promise(resolve => {
              setTimeout(() => {
                this.update();
                setTimeout(() => {
                  App.getWidget('accounts').update();
                  resolve();
                }, 300);
              }, 300);
            });
          } else {
            throw new Error(response?.error || 'Ошибка при удалении транзакции');
          }
        })
        .catch(err => {
          alert('Не удалось удалить транзакцию');
        });
    }
  }

  /**
   * С помощью Account.get() получает навание счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  async render(options) {
    console.log('render', options);
    
    if (!options) {
      throw new Error('Не передан id счета');
    }

    this.lastOptions = options;
    
    try {
        // Получаем информацию о счете
        const response = await Account.get(options.account_id);
        console.log('TransactionsPage got response:', response);
        if (response && response.success) {
            const account = response.data;
            
            this.renderTitle(account.name);

            // Получаем список транзакций
            const transactionsResponse = await Transaction.list(options.account_id);
            this.renderTransactions(transactionsResponse);
        };
    } catch (err) {
        throw new Error ('Ошибка при загрузке данных:', err);
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const contentWrapper = this.element.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.innerHTML = `
            <section class="content-header">
                <h1>
                    <span class="content-title"></span>
                    <small class="content-description"></small>
                    <button class="btn btn-danger remove-account" style="display: none;">
                        <span class="fa fa-trash"></span>
                        Удалить счёт
                    </button>
                </h1>
            </section>
            <section class="content">
            </section>
        `;
    }
    this.lastOptions = null;
    
    // Вызываем renderTransactions с пустым массивом
    this.renderTransactions([]);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const titleElement = this.element.querySelector('.content-title');
    const descriptionElement = this.element.querySelector('.content-description');
    
    if (titleElement) {
        titleElement.textContent = name;
    }
    if (descriptionElement) {
        descriptionElement.textContent = 'Счёт';
    }

    // Показываем кнопку удаления счета, так как счет выбран
    const removeButton = this.element.querySelector('.remove-account');
    if (removeButton) {
        removeButton.style.display = 'inline-block';
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    
    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
      <div class="transaction transaction_${item.type.toLowerCase()} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = this.element.querySelector('.content');
    if (!content) {
      throw new Error('Не передан элемент .content');
    }

    if (data.length) {
      content.innerHTML = data
        .map(item => this.getTransactionHTML(item))
        .join('');
    } else {
      content.innerHTML = '<div class="no-content">Нет транзакций</div>';
    }
  }
}