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
  async renderAccountsList() {
    const select = this.element.querySelector('.accounts-select')
    try {
      const response = await Account.list()
      if (response && response.success) {
        select.innerHTML = response.data.map(account => `
          <option value="${account.id}">${account.name} (${account.sum}₽)</option>
        `).join('')
      }
    } catch (e) {
      console.error('Ошибка при получении списка счетов:', e)
    }
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
      
      // Устанавливаем задержку перед обновлением
      setTimeout(() => {
        App.update()
      }, 200)
    } else {
      throw new Error(response?.error || 'Ошибка создания транзакции');
    }
  }
  // Обработка ошибок
  error(error) {
    console.error('Error creating transaction:', error)
    alert(error.message || 'Не удалось создать транзакцию. Попробуйте позже.')
  }
}