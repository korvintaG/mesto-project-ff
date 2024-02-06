import './pages/index.css'; // добавьте импорт главного файла стилей 
import { initialCards } from './components/cards.js'
import { createCard, deleteCard, likeCard } from './components/card.js'
import { openModal, closeModal, closeWindowOverlay } from './components/modal.js'

const cardContainer = document.querySelector(".places__list"); // DOM узел куда добавлять новые карточки
// профайл - основная страница
const profileEditButton = document.querySelector(".profile__edit-button");  // кнопка редактирования профиля на основной странице
const profileTitle = document.querySelector(".profile__title"); // заголовок профайла
const profileDescription = document.querySelector(".profile__description");  // комментарий профайла
// профайл - попап 
const popupProfileEdit = document.querySelector(".popup_type_edit"); // часть DOM - попап редактирования профайла
const popupProfileForm = document.forms["edit-profile"]; // форма попапа
const profileFormName = popupProfileForm.elements.name; // поле формы с именем профвйла
const profileFormDescription = popupProfileForm.elements.description; // поле формы с описание профайла
// новое место - добавление карточки
const buttonAddCard = document.querySelector(".profile__add-button"); // кнопка добавления новой карточки на основной странице
const popupNewCard = document.querySelector(".popup_type_new-card"); // часть DOM - попап создания новой карточки
const popupNewCardForm = document.forms["new-place"]; // форма попапа добавления новой карточки
const newCardFormName = popupNewCardForm.elements["place-name"]; // поле формы "название"
const newCardFormLink = popupNewCardForm.elements.link; // поле формы "ссылка"
// попап "Фото"
const popupImage = document.querySelector(".popup_type_image");
const popupImageImage = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");

// обработчик события - редактирование профайла
function editProfile(evt) {
  openModal(popupProfileEdit); // открываем попап
  profileFormName.value = profileTitle.textContent; // означиваем название
  profileFormDescription.value = profileDescription.textContent; // означиваем текстовое описание
}

// обработчик события - submit формы редактирования профайла
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // отменяем стандартную обработку submit
  profileTitle.textContent = profileFormName.value; // меняем имя профайла из формы 
  profileDescription.textContent = profileFormDescription.value; // меняем описание профайла из формы 
  closeModal(popupProfileEdit); // закрываем попап
}

// обработчик события - submit формы создания новой карточки
function handleNewCardFormSubmit(evt) {
  evt.preventDefault(); // отменяем стандартную обработку submit
  const cardElement = createCard({ name: newCardFormName.value, link: newCardFormLink.value }, // создаем карточку
    {deleteFunction: deleteCard, popupFunction:popupCardImage, likeFunction:likeCard});
  cardContainer.prepend(cardElement); // добавляем карточку на страницу в начало
  popupNewCardForm.reset(); // очистка полей формы
  closeModal(popupNewCard); // закрываем попап
}

// обработчик события - попап изображения карточки (передается запись карточки - name и link)
function popupCardImage(cardRecord) {
  openModal(popupImage);
  popupImageImage.src = cardRecord.link;
  popupImageImage.alt = cardRecord.name;
  popupImageCaption.textContent = cardRecord.name;
}

// выводим все карточки на страницу
initialCards.forEach((cardRecord) => {
  const cardElement = createCard(cardRecord, 
    {deleteFunction: deleteCard, popupFunction:popupCardImage, likeFunction:likeCard});
  cardContainer.append(cardElement); // добавляем карточку на страницу
});

// перебираем все кнопки закрытия попапов
document.querySelectorAll('.popup__close').forEach(buttonClose => {
  const popup = buttonClose.closest('.popup');
  buttonClose.addEventListener('click', () => closeModal(popup)); // вешаем закрытие попапа
  popup.addEventListener("mousedown", closeWindowOverlay);  // за пределами формы щелчок мыши, закрытие по оверлею
  popup.classList.add('popup_is-animated'); // делаем все попапы с небольшой анимацией как в ТЗ
}) 

// назначаем события
profileEditButton.addEventListener("click", editProfile); // редактирование профайла
buttonAddCard.addEventListener("click", () => { openModal(popupNewCard); }); // добавление новой карточки
// кнопка close

// submit
popupProfileForm.addEventListener('submit', handleProfileFormSubmit); // сохранение профайла
popupNewCardForm.addEventListener('submit', handleNewCardFormSubmit); // создание новой карточки
