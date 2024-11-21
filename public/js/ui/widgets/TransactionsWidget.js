/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.addEventListener('click', e => {
      if (e.target.closest('.create-income-button')) {
        App.getModal('newIncome').open();
      }
      if (e.target.closest('.create-expense-button')) {
        App.getModal('newExpense').open();
      }
    });
  }

  update() {
    const accountId = document.querySelector('.active.account').dataset.id;
    Transaction.list({ account_id: accountId }).then(transactions => {
      this.renderTransactions(transactions);
    });
  }

  renderTransactions(transactions) {
    const container = this.element.querySelector('.content');
    container.innerHTML = transactions.map(transaction => `
      <div class="transaction transaction_${transaction.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
            <h4 class="transaction__title">${transaction.name}</h4>
            <div class="transaction__date">${new Date(transaction.created_at).toLocaleString()}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
            ${transaction.sum} ₽
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${transaction.id}">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
  }
}
