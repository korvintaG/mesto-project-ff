import './pages/index.css'; // добавьте импорт главного файла стилей
import {
  createCard,
  deleteCard as deleteCardDOM,
  likeCard as likeCardDOM,
  setLikeCount,
  likeClass
} from "./components/card.js";
import {
  openModal,
  closeModal,
  closeWindowOverlay,
} from "./components/modal.js";
import {
  getInitialCards,
  postCard,
  deleteCard as deleteCardAPI,
  getUser,
  patchUser,
  patchAvatar,
  likeCard as likeCardAPI,
} from "./api.js";
import { enableValidation, clearValidation } from "./validation.js";

const cardContainer = document.querySelector(".places__list"); // DOM узел куда добавлять новые карточки
// профайл - основная страница
const profileImage = document.querySelector(".profile__image"); // изображение профайла
const profileEditButton = document.querySelector(".profile__edit-button"); // кнопка редактирования профиля на основной странице
const profileTitle = document.querySelector(".profile__title"); // заголовок профайла
const profileDescription = document.querySelector(".profile__description"); // комментарий профайла
// профайл - попап
const popupProfileEdit = document.querySelector(".popup_type_edit"); // часть DOM - попап редактирования профайла
const popupProfileForm = document.forms["edit-profile"]; // форма попапа
const popupProfileButton = popupProfileEdit.querySelector(".popup__button"); // кнопка сабмита
const profileFormName = popupProfileForm.elements.name; // поле формы с именем профвйла
const profileFormDescription = popupProfileForm.elements.description; // поле формы с описание профайла
// профайл аватар - попап
const popupAvatarEdit = document.querySelector(".popup_type_avatar"); // часть DOM - попап редактирования аватара
const popupAvatarForm = document.forms["edit-avatar"]; // форма попапа
const popupAvatarButton = popupAvatarEdit.querySelector(".popup__button"); // кнопка сабмита
const popupAvatarEditURL = popupAvatarForm.elements.avatar; // часть DOM - попап редактирования аватара
// новое место - добавление карточки
const buttonAddCard = document.querySelector(".profile__add-button"); // кнопка добавления новой карточки на основной странице
const popupNewCard = document.querySelector(".popup_type_new-card"); // часть DOM - попап создания новой карточки
const popupNewCardForm = document.forms["new-place"]; // форма попапа добавления новой карточки
const popupNewCardButton = popupNewCard.querySelector(".popup__button"); // кнопка сабмита
const newCardFormName = popupNewCardForm.elements["place-name"]; // поле формы "название"
const newCardFormLink = popupNewCardForm.elements.link; // поле формы "ссылка"
// удаление карточки
const popupDelCard = document.querySelector(".popup_type_del-card"); // часть DOM - попап удаления карточки
const popupDelCardForm = document.forms["del-place"]; // форма попапа удаления карточки
const popupDelCardButton = popupDelCard.querySelector(".popup__button"); // кнопка подтверждения удаления
// попап "Фото"
const popupImage = document.querySelector(".popup_type_image");
const popupImageImage = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");

// объект настроек валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type-error",
  errorClass: "popup__error_visible",
};

// обработчик события - редактирование профайла
function editProfile(evt) {
  openModal(popupProfileEdit); // открываем попап
  clearValidation(popupProfileForm, validationConfig);
  profileFormName.value = profileTitle.textContent; // означиваем название
  profileFormDescription.value = profileDescription.textContent; // означиваем текстовое описание
}

// обработчик события - редактирование аватара
function editAvatar(evt) {
  openModal(popupAvatarEdit); // открываем попап
  clearValidation(popupAvatarForm, validationConfig);
  const style = profileImage.getAttribute("style");
  const reg = /(?:\(['"]?)(.*?)(?:['"]?\))/;
  const url = reg.exec(style)[1]; // извлекаем URL
  popupAvatarEditURL.value = url; // означиваем
}

// обработчик события - submit формы редактирования профайла
function handleProfileFormSubmit(evt) {
  evt.preventDefault(); // отменяем стандартную обработку submit
  const oldText = popupProfileButton.textContent;
  popupProfileButton.textContent = popupProfileButton.textContent + "...";
  patchUser({
    name: profileFormName.value,
    about: profileFormDescription.value,
  })
    .then(() => {
      profileTitle.textContent = profileFormName.value; // меняем имя профайла из формы
      profileDescription.textContent = profileFormDescription.value; // меняем описание профайла из формы
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
    .finally(() => {
      popupProfileButton.textContent = oldText;
    });
  closeModal(popupProfileEdit); // закрываем попап
}

// обработчик события - submit формы редактирования аватара профайла
function handleAvatarFormSubmit(evt) {
  evt.preventDefault(); // отменяем стандартную обработку submit
  const oldText = popupAvatarButton.textContent;
  popupAvatarButton.textContent = popupAvatarButton.textContent + "...";
  patchAvatar(popupAvatarEditURL.value)
    .then(() => {
      profileImage.setAttribute(
        "style",
        `background-image: url('${popupAvatarEditURL.value}');`
      );
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
    .finally(() => {
      popupAvatarButton.textContent = oldText;
    });
  closeModal(popupAvatarEdit); // закрываем попап
}

// обработчик события - submit формы создания новой карточки
function handleNewCardFormSubmit(evt, userID) {
  evt.preventDefault(); // отменяем стандартную обработку submit
  const oldText = popupNewCardButton.textContent;
  popupNewCardButton.textContent = popupNewCardButton.textContent + "...";
  const cardRecord = {
    name: newCardFormName.value,
    link: newCardFormLink.value,
    likes: [],
    owner: { _id: userID },
  };
  postCard(cardRecord)
    .then((res) => {
      cardRecord._id = res._id;
      const cardElement = createCard(cardRecord, userID, {
        deleteFunction: deleteCard,
        popupFunction: popupCardImage,
        likeFunction: likeCard,
      });
      cardContainer.prepend(cardElement); // добавляем карточку на страницу в начало
      popupNewCardForm.reset(); // очистка полей формы
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    })
    .finally(() => {
      popupNewCardButton.textContent = oldText;
    });
  closeModal(popupNewCard); // закрываем попап
}

// функция комплексного удаления карточки - и в DOM, и на сервере (с подтверждением)
function deleteCard(cardElement, cardID) {
  openModal(popupDelCard);
  handleDelCardFormSubmitLet({ cardID, cardElement }); // проставление переменных для удаления карточки
}

// функция удаления карточки посредством механизма замыкания
function handleDelCardFormSubmit(evt) {
  let cardToDel; // переменная удаления карточки
  return function (evt) {
    if (evt.target === undefined) {
      // передача параметров
      cardToDel = evt;
    } else {
      evt.preventDefault(); // отменяем стандартную обработку submit
      const oldText = popupDelCardButton.textContent;
      popupDelCardButton.textContent = 'Удаление...';
      deleteCardAPI(cardToDel.cardID)
        .then(() => {
          deleteCardDOM(cardToDel.cardElement);
          closeModal(popupDelCard); // закрываем попап
        })
        .catch((err) => {
          console.log(err); // выводим ошибку в консоль
        })
        .finally (() => popupDelCardButton.textContent = oldText);
    }
  };
}
let handleDelCardFormSubmitLet = handleDelCardFormSubmit(); // инициализация контекста замыкания

// обработчик события - попап изображения карточки (передается запись карточки - name и link)
function popupCardImage(cardRecord) {
  openModal(popupImage);
  popupImageImage.src = cardRecord.link;
  popupImageImage.alt = cardRecord.name;
  popupImageCaption.textContent = cardRecord.name;
}

// новая функция лайка карточки сложное с API
function likeCard(likeButtonElement, cardID) {
  likeCardAPI(
    cardID,
    likeButtonElement.classList.contains(likeClass)
  )
    .then((res) => {
      likeCardDOM(likeButtonElement);
      setLikeCount(likeButtonElement, res.likes.length);
    })
    .catch((err) => {
      console.log(err); // выводим ошибку в консоль
    });
}

// перебираем все кнопки закрытия попапов
document.querySelectorAll(".popup__close").forEach((buttonClose) => {
  const popup = buttonClose.closest(".popup");
  buttonClose.addEventListener("click", () => closeModal(popup)); // вешаем закрытие попапа
  popup.addEventListener("mousedown", closeWindowOverlay); // за пределами формы щелчок мыши, закрытие по оверлею
  popup.classList.add("popup_is-animated"); // делаем все попапы с небольшой анимацией как в ТЗ
});

// назначаем события
profileEditButton.addEventListener("click", editProfile); // редактирование профайла
profileImage.addEventListener("click", editAvatar); // обновление аватара
buttonAddCard.addEventListener("click", () => {
  openModal(popupNewCard);
  popupNewCardForm.reset();
  clearValidation(popupNewCardForm, validationConfig);
}); // добавление новой карточки

// submit
popupDelCardForm.addEventListener("submit", handleDelCardFormSubmitLet); // удаление карточки
popupProfileForm.addEventListener("submit", handleProfileFormSubmit); // сохранение профайла
popupAvatarForm.addEventListener("submit", handleAvatarFormSubmit); // сохранение аватара профайла

// загружаем профайл и карточки
Promise.all([getUser(), getInitialCards()])
  .then(([user, cards]) => {
    popupNewCardForm.addEventListener("submit", (evt) =>
      handleNewCardFormSubmit(evt, user._id)
    ); // создание новой карточки
    // проставляем профайл
    profileTitle.textContent = user.name; // означиваем название
    profileDescription.textContent = user.about; // меняем описание профайла из формы
    profileImage.setAttribute(
      "style",
      `background-image: url('${user.avatar}');`
    );
    // загружаем карточки
    cards.forEach((card) => {
      const cardElement = createCard(card, user._id, {
        deleteFunction: deleteCard,
        popupFunction: popupCardImage,
        likeFunction: likeCard,
      });
      cardContainer.append(cardElement); // добавляем карточку на страницу
    });
  })
  .catch((err) => {
    console.log(err); // выводим ошибку в консоль
  });

enableValidation(validationConfig); // включаем валидацию для всех input всех форм
