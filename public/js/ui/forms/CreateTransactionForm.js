/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList()
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const select = this.element.querySelector('.accounts-select')
    if (!select) {
      return Promise.resolve()
    }

    return Account.list()
      .then(accounts => {
        if (accounts.length) {
          select.innerHTML = accounts
            .map(account => `
              <option value="${account.id}">
                ${account.name} (${account.sum} ₽)
              </option>
            `).join('')
        } else {
          select.innerHTML = '<option value="">Нет доступных счетов</option>'
        }
      })
      .catch(err => {
        console.error('Failed to load accounts:', err)
        select.innerHTML = '<option value="">Ошибка загрузки счетов</option>'
      })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    // Проверяем наличие всех необходимых данных
    if (!data.name || !data.sum || !data.account_id || !data.type) {
      throw new Error('Все поля должны быть заполнены');
    }

    // Проверяем корректность суммы
    const sum = Number(data.sum);
    if (isNaN(sum) || sum <= 0) {
      throw new Error('Сумма должна быть положительным числом');
    }

    return Transaction.create({
      name: data.name.trim(),
      sum: sum,
      account_id: data.account_id,
      type: data.type.toLowerCase()  // приводим к нижнему регистру как ожидает сервер
    });
  }

  success(response) {
    if (response && response.success) {
      this.element.reset()
      const modalName = this.element.id === 'new-income-form' ? 'newIncome' : 'newExpense';
      App.getModal(modalName).close()
      
      // Увеличили задержку перед обновлением до 3 секунд
      setTimeout(() => {
        App.update()
      }, 3000)
    } else {
      throw new Error(response?.error || 'Ошибка создания транзакции');
    }
  }

  error(error) {
    console.error('Error creating transaction:', error)
    alert(error.message || 'Не удалось создать транзакцию. Попробуйте позже.')
  }
}