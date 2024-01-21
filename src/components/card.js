const cardTemplate = document.querySelector("#card-template").content; // Темплейт карточки
const cardTemplateElement = cardTemplate.querySelector(".places__item"); // Элемент внутри тэмплейта

/* функция удаления DOM-элемента карточки
 * @param {DOM-object} cardElement - DOM-элемент, который нужно удалить  
 */
export function deleteCard(cardElement) {
  cardElement.remove();
}

/* функция лайка/дизлайка карточки
 * @param {DOM-object} evt - стандартная переменная события
 */
export function likeCard(evt) {
  const heart = evt.target; // текущее сердечко
  heart.classList.toggle('card__like-button_is-active');
}

/* функция создания DOM-элемента новой карточки  
 * @constructor
 * @param {object} cardRecord - данные о карточке из двух строковых примитивов - имени и ссылки
 * @param {function} deleteFunction - функция удаления карточки для коллбэка
 * @param {function} popupFunction - функция попапа изображения карточки
 * @param {function} likeFunction - функция лайка
  */
export function createCard(cardRecord, deleteFunction, popupFunction, likeFunction) {
  const cardElement = cardTemplateElement.cloneNode(true); // клонируем шаблон
  const cardElementImage = cardElement.querySelector(".card__image"); // изображение
  const cardElementTitle = cardElement.querySelector(".card__title"); // заголовок карточки
  const cardElementDelButton = cardElement.querySelector(".card__delete-button"); // кнопка удаления
  const cardElementLikeButton = cardElement.querySelector(".card__like-button"); // кнопка like
  // устанавливаем значения
  cardElementImage.src = cardRecord.link;
  cardElementImage.alt = cardRecord.name;
  cardElementTitle.textContent = cardRecord.name;
  // добавляем обработчик клика
  cardElementDelButton.addEventListener("click", () => deleteFunction(cardElement));
  cardElementImage.addEventListener('click', popupFunction);
  cardElementLikeButton.addEventListener('click', likeFunction);
  // возврат подготовленного DOM-элемента карточки
  return cardElement;
}
