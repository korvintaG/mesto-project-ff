// @todo: Темплейт карточки
// @todo: DOM узлы
// @todo: Функция создания карточки
// @todo: Функция удаления карточки
// @todo: Вывести карточки на страницу

const cardTemplate = document.querySelector("#card-template").content; // Темплейт карточки
const cardTemplateElement = cardTemplate.querySelector(".places__item"); // Элемент внутри тэмплейта
const cardContainer = document.querySelector(".places__list"); // DOM узел куда добавлять

/* функция удаления DOM-элемента карточки
 * @param {DOM-object} cardElement - DOM-элемент, который нужно удалить  
 */
function deleteCard(cardElement) {
  cardElement.remove();
}

/* функция создания DOM-элемента новой карточки  
 * @constructor
 * @param {object} card - данные о карточке из двух строковых примитивов - имени и ссылки
 * @param {function} deleteFunction - функция удаления карточки для коллбэка
 */
function createCard(cardRecord, deleteFunction) {
  const cardElement = cardTemplateElement.cloneNode(true); // клонируем шаблон
  const cardElementImage = cardElement.querySelector(".card__image"); // изображение
  const cardElementTitle = cardElement.querySelector(".card__title"); // заголовок карточки
  const cardElementDelButton = cardElement.querySelector(".card__delete-button"); // кнопка удаления
  // устанавливаем значения
  cardElementImage.src = cardRecord.link;
  cardElementImage.alt = cardRecord.name;
  cardElementTitle.textContent = cardRecord.name;
  // добавляем обработчик клика
  cardElementDelButton.addEventListener("click", () => deleteFunction(cardElement));
  // возврат подготовленного DOM-элемента карточки
  return cardElement;
}

// выводим все карточки на страницу
initialCards.forEach((cardRecord) => {
  const cardElement = createCard(cardRecord, deleteCard);
  cardContainer.append(cardElement); // добавляем карточку на страницу
});
