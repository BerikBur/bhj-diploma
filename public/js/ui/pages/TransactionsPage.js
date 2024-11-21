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
      throw new Error('Element not found');
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
      }, 300);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методам TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', e => {
      const removeAccount = e.target.closest('.remove-account');
      if (removeAccount) {
        e.preventDefault();
        this.removeAccount();
      }

      const removeTransaction = e.target.closest('.transaction__remove');
      if (removeTransaction) {
        e.preventDefault();
        this.removeTransaction(removeTransaction.dataset.id);
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
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove(this.lastOptions.account_id)
        .then(response => {
          if (response && response.success) {
            this.clear();
            setTimeout(() => {
              App.updateWidgets();
              setTimeout(() => {
                App.updateForms();
                setTimeout(() => {
                  document.location.href = '#/accounts';
                }, 300);
              }, 300);
            }, 300);
          } else {
            throw new Error(response?.error || 'Не удалось удалить счёт');
          }
        })
        .catch(err => {
          console.error('Error removing account:', err);
          if (err.message.includes('404')) {
            this.clear();
            setTimeout(() => {
              App.updateWidgets();
              setTimeout(() => {
                App.updateForms();
                setTimeout(() => {
                  document.location.href = '#/accounts';
                }, 300);
              }, 300);
            }, 300);
          } else {
            alert('Не удалось удалить счёт');
          }
        });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (!id) {
      console.error('No transaction ID provided');
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
          console.error('Error removing transaction:', err);
          alert('Не удалось удалить транзакцию');
        });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options || !options.account_id) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id)
      .then(account => {
        if (!account) {
          return Promise.reject(new Error('Account not found'));
        }
        if (account.name) {
          this.renderTitle(account.name);
        } else {
          console.error('Account name is missing:', account);
          this.renderTitle('Название счёта');
        }

        return Transaction.list(options.account_id);
      })
      .then(transactions => {
        this.renderTransactions(transactions);
      })
      .catch(err => {
        console.error('Error rendering transactions page:', err);
        this.clear();
      });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    // Возвращаем страницу к изначальному состоянию
    this.element.innerHTML = `
        <div class="content-wrapper">
            <section class="content-header">
                <h1>
                    <span class="content-title">Название счёта</span>
                    <small class="content-description">Счёт</small>
                    <button class="btn btn-danger remove-account">
                        <span class="fa fa-trash"></span>
                        Удалить счёт
                    </button>
                </h1>
            </section>
            <section class="content">
            </section>
        </div>`;

    // Скрываем кнопку удаления счета
    const removeButton = this.element.querySelector('.remove-account');
    if (removeButton) {
        removeButton.style.display = 'none';
    }

    // Очищаем сохраненные опции
    this.lastOptions = null;
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
        removeButton.style.display = 'block';
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
      return;
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