let currentPopup;  // текущий попап
let buttontClose;  // кнопка закрытия формы

/* функция открытия попапа
 * @function
 * @param {object} popup - DOM-элемент, содержащий всю структуру попапа с формой внутри
 */
export function openModal(popup) {
  // означивание
  currentPopup = popup;
  buttontClose = popup.querySelector(".popup__close");  
  // открываем форму
  popup.classList.add('popup_is-opened');  
  
  // слушатели добавляем
  buttontClose.addEventListener("click", closeModalInner);  // кнопка закрытия
  document.addEventListener("keydown", handleKey);  // Esc - закрытие формы
  popup.addEventListener("click", closeWindowOverlay);  // за пределами формы клыц, закрытие значит
}

// внутренняя служебная функция закрытия. Нужна, т.к. должна быть функция для снятия
function closeModalInner(evt) {
  closeModal(currentPopup);
}

// закрытие попапа при клике на оверлей
function closeWindowOverlay(evt) {
  if (evt.target.classList.contains('popup'))
    closeModal(currentPopup);
}

// обработка варианта закрытия формы по Esc
function handleKey(evt) {
  if (evt.key === 'Escape') {
    closeModal(currentPopup);
  }
}

/* функция закрытия попапа
 * @function
 * @param {object} popup - DOM-элемент, содержащий всю структуру попапа с формой внутри
 */
export function closeModal(popup) {
  // слушатели снимаем
  buttontClose.removeEventListener("click", closeModalInner);  
  document.removeEventListener("keydown", handleKey);  
  popup.removeEventListener("click", closeWindowOverlay); 
  // собственно говоря закрываем
  popup.classList.remove('popup_is-opened');
}