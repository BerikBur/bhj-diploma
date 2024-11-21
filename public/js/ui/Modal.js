/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */
class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    if(!element) {
      throw new Error('Элемента не передан')
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {
    // Находим все кнопки закрытия в модальном окне
    const closeButtons = this.element.querySelectorAll('[data-dismiss="modal"]');
    const closeIcon = this.element.querySelector('.close');
    
    // Добавляем обработчик для каждой кнопки закрытия
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });

    // Добавляем обработчик для иконки закрытия (×)
    if (closeIcon) {
      closeIcon.addEventListener('click', () => this.close());
    }

    // Закрытие по клику на затемненную область (опционально)
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {
    this.close();
  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {
    this.element.style.display = 'block';
    document.body.classList.add('modal-open');
  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}