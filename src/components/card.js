const cardTemplate = document.querySelector("#card-template").content; // Темплейт карточки
const cardTemplateElement = cardTemplate.querySelector(".places__item"); // Элемент внутри тэмплейта
export const likeClass = 'card__like-block_button_is-active'; // имя класса активного лайка

/* функция удаления DOM-элемента карточки
 * @param {DOM-object} cardElement - DOM-элемент, который нужно удалить
 */
export function deleteCard(cardElement) {
  cardElement.remove();
}

/* функция лайка/дизлайка карточки
 * @param {DOM-object} likeCardButton - кнопка лайка-сердечко
 */
export function likeCard(likeCardButton) {
  likeCardButton.classList.toggle(likeClass);
}

/* функция установки числа лайков карточки
 * @param {DOM-object} heartButton - кнопка сердечка
 * @param {integer} cnt - число лайков
 */
export function setLikeCount(heartButton, cnt) {
  const likeBlock = heartButton.closest(".card__like-block");
  const likeCount = likeBlock.querySelector(".card__like-block_count");
  likeCount.textContent = cnt;
}

/* функция создания DOM-элемента новой карточки
 * @constructor
 * @param {object} cardRecord - данные о карточке из двух строковых примитивов - имени и ссылки
 * @param {bool} isLiked - карточка уже лайкнутая?
 * @param {bool} canDelete - можно удалить карточку?
 * @param {object} handler - объект функций обработчиков:
 *                            deleteFunction - функция удаления карточки для коллбэка
 *                            popupFunction - функция попапа изображения карточки
 *                            likeFunction - функция лайка
 */
export function createCard(cardRecord, curUserID, handler) {
  const isLiked = cardRecord.likes.find((elem) => elem._id === curUserID); // проставлен ли IsLike изначально?
  const canDelete = cardRecord.owner._id === curUserID;

  const cardElement = cardTemplateElement.cloneNode(true); // клонируем шаблон
  const cardElementImage = cardElement.querySelector(".card__image"); // изображение
  const cardElementTitle = cardElement.querySelector(".card__title"); // заголовок карточки
  const cardElementDelButton = cardElement.querySelector(
    ".card__delete-button"
  ); // кнопка удаления
  const cardElementLikeButton = cardElement.querySelector(
    ".card__like-block_button"
  ); // кнопка like
  // устанавливаем значения
  cardElementImage.src = cardRecord.link;
  cardElementImage.alt = cardRecord.name;
  cardElementTitle.textContent = cardRecord.name;
  setLikeCount(cardElementLikeButton, cardRecord.likes.length);
  if (isLiked)
    cardElementLikeButton.classList.toggle(likeClass);
  // добавляем обработчик клика
  if (canDelete)
    cardElementDelButton.addEventListener("click", () =>
      handler.deleteFunction(cardElement, cardRecord._id)
    );
  else cardElementDelButton.remove();
  cardElementImage.addEventListener("click", () => {
    handler.popupFunction(cardRecord);
  });
  cardElementLikeButton.addEventListener("click", () =>
    handler.likeFunction(cardElementLikeButton, cardRecord._id)
  );
  // возврат подготовленного DOM-элемента карточки
  return cardElement;
}
