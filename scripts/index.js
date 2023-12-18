// @todo: Темплейт карточки
// @todo: DOM узлы
// @todo: Функция создания карточки
// @todo: Функция удаления карточки
// @todo: Вывести карточки на страницу

const cardTemplate = document.querySelector("#card-template").content; // Темплейт карточки
const cardTemplateElement = cardTemplate.querySelector(".places__item"); // Элемент внутри тэмплейта
const cardContainer = document.querySelector(".places__list"); // DOM узел куда добавлять

// функция удаления карточки
function DeleteCard(evt) {
  evt.target.closest(".places__item").remove();
}

// функция добавления новой карточки
function AddCard(card, deleteFunction) {
  const cardElement = cardTemplateElement.cloneNode(true); // клонируем шаблон
  const cardElementImage = cardElement.querySelector(".card__image"); // изображение
  const cardElementTitle = cardElement.querySelector(".card__title"); // заголовок карточки
  const cardElementDelButton = cardElement.querySelector(".card__delete-button"); // кнопка удаления
  // устанавливаем значения
  cardElementImage.src = card.link;
  cardElementImage.alt = card.name;
  cardElementTitle.textContent = card.name;
  // добавляем обработчик клика
  cardElementDelButton.addEventListener("click", deleteFunction);
  // возврат подготовленного элемента карточки
  return cardElement;
}

// выводим все карточки на страницу
initialCards.forEach( card => {
  cardContainer.append(AddCard(card, DeleteCard)); // добавляем карточку на страницу
});
