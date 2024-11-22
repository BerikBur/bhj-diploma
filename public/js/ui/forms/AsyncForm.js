/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы. Вместо этого данные
 * с таких форм собираются и передаются в метод onSubmit
 * для последующей обработки
 * */
class AsyncForm {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан');
    }
    this.element = element;
    this.registerEvents();
  }

  /**
   * Необходимо запретить отправку формы и в момент отправки
   * вызывает метод submit()
   * */
  registerEvents() {
    this.element.addEventListener('submit', e => {
      e.preventDefault();
      this.submit();
    });
  }

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    const formData = new FormData(this.element);
    return Object.fromEntries(formData);
  }

  onSubmit(options) {
    throw new Error('Метод должен быть реализован');
  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData()
   * */
  submit() {
    const data = this.getData();
    
    this.onSubmit(data)
      .then(response => {
        if (response && response.success) {
          this.element.reset();
          this.success(response);
        } else {
          throw new Error(response?.error || 'Произошла ошибка');
        }
      })
      .catch(e => {
        if (typeof this.error === 'function') {
          this.error(e);
        } else {
          console.error(e);
          alert(e.message || 'Произошла ошибка');
        }
      });
  }

  success(response) {
    // Переопределяется в дочерних классах
  }
}