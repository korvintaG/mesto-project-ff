/* функция открытия попапа
 * @function
 * @param {object} popup - DOM-элемент, содержащий всю структуру попапа с формой внутри
 */
export function openModal(popup) {
  popup.classList.add('popup_is-opened'); // открываем форму
  document.addEventListener("keydown", closeByEsc);  // слушатель добавляем - Esc - закрытие формы
}

/* функция закрытия попапа по клику по оверлею
 * @function
 * @param {object} evt - стандартный объект события event
 */
export function closeWindowOverlay(evt) {
  if (evt.target.classList.contains('popup'))
    closeModal(evt.target);
}

// обработка варианта закрытия формы по Esc
function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closeModal(openedPopup);
  }
}

/* функция закрытия попапа
 * @function
 * @param {object} popup - DOM-элемент, содержащий всю структуру попапа с формой внутри
 */
export function closeModal(popup) {
  document.removeEventListener("keydown", closeByEsc); // слушатель снимаем
  popup.classList.remove('popup_is-opened'); // собственно говоря закрываем
}