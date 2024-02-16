/* функция активации валидации
 * @param {object} validationConfig - объект настроек валидации
 */
export function enableValidation(validationConfig) {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );
  formList.forEach((formElement) => {
    // Для каждой формы вызовем функцию setEventListeners, передав ей элемент формы
    setEventListeners(formElement, validationConfig);
  });
}

/* функция очистки валидации формы
 * @param {DOM-object} form - DOM-объект формы
 * @param {object} validationConfig - объект настроек валидации
 */
export function clearValidation(form, validationConfig) {
  const inputList = Array.from(
    form.querySelectorAll(validationConfig.inputSelector)
  );
  // Обойдём все элементы полученной коллекции
  const buttonElement = form.querySelector(
    validationConfig.submitButtonSelector
  );
  inputList.forEach((inputElement) => {
    hideInputError(form, inputElement, validationConfig);
  });
  disableSubmitButton(buttonElement, validationConfig);
}

// функция делания кнопки сабмита недоступной
function disableSubmitButton(buttonElement, validationConfig) {
  buttonElement.disabled = true;
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
}

// функция установки слушателей для валидации
function setEventListeners(formElement, validationConfig) {
  // Находим все поля внутри формы, сделаем из них массив методом Array.from
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  // Обойдём все элементы полученной коллекции
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  inputList.forEach((inputElement) => {
    // каждому полю добавим обработчик события input
    inputElement.addEventListener("input", () => {
      // Внутри колбэка вызовем isValid, передав ей форму и проверяемый элемент
      isValid(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
}

// функция проверки валидности элемента формы
function isValid(formElement, inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }
  if (!inputElement.validity.valid) {
    // showInputError теперь получает параметром форму, в которой находится проверяемое поле, и само это поле
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      validationConfig
    );
  } else {
    // hideInputError теперь получает параметром форму, в которой находится проверяемое поле, и само это поле
    hideInputError(formElement, inputElement, validationConfig);
  }
}

// Функция проверка на валидность списка полей
function hasInvalidInput(inputList) {
  // проходим по этому массиву методом some
  return inputList.some((inputElement) => {
    // Если поле не валидно, колбэк вернёт true, обход массива прекратится и вся функция hasInvalidInput вернёт true
    return !inputElement.validity.valid;
  });
}

// Функция принимает массив полей ввода и элемент кнопки, состояние которой нужно менять
function toggleButtonState(inputList, buttonElement, validationConfig) {
  // Если есть хотя бы один невалидный инпут
  if (hasInvalidInput(inputList)) {
    // сделай кнопку неактивной
    disableSubmitButton(buttonElement, validationConfig);
  } else {
    // иначе сделай кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
}

// Функция показывает сообщения об ошибке
function showInputError(
  formElement,
  inputElement,
  errorMessage,
  validationConfig
) {
  // Заменим содержимое span с ошибкой на переданный параметр
  const formError = formElement.querySelector(`.${inputElement.id}-error`);
  formError.textContent = errorMessage;
  inputElement.classList.add(validationConfig.inputErrorClass);
}

// Функция очищает сообщения об ошибке
function hideInputError(formElement, inputElement, validationConfig) {
  const formError = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  // Очистим ошибку
  formError.textContent = "";
}
