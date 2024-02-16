// параметры подключения к API
const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-6",
  headers: {
    authorization: "eb899e12-a04f-4c16-96b5-30dfc2482325",
    "Content-Type": "application/json",
  },
};

// универсальная функция обработки результата запросов
function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

/* функция получения с сервера информации о текущем пользователе
 * @promise
 */
export const getUser = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then((res) => handleResponse(res))
};

/* функция сохранения на сервере информации о текущем пользователе
 * @promise
 * @param {object} userRecord - объект с информации о текущем пользователе
 */
export const patchUser = (userRecord) => {
  const jsonStr = JSON.stringify(userRecord);
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: jsonStr,
  }).then((res) => handleResponse(res))
};

/* функция сохранения на сервере информации об аватаре текущего пользователе
 * @promise
 * @param {String} avatar - строка URL картинки
 */
export const patchAvatar = (avatar) => {
  const jsonStr = JSON.stringify({ avatar });
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: jsonStr,
  }).then((res) => handleResponse(res))
};

/* функция получения с сервера карточек
 * @promise
 */
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then((res) => handleResponse(res))
};


/* функция добавления на сервер новой карточки
 * @promise
 * @param {object} cardRecord - объект новой карточки
 */
export const postCard = (cardRecord) => {
  const jsonStr = JSON.stringify(cardRecord);
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: jsonStr,
  }).then((res) => handleResponse(res))
};

/* функция удаления на сервере карточки
 * @promise
 * @param {String} cardID - ID карточки, которую нужно удалить
 */
export const deleteCard = (cardID) => {
  return fetch(`${config.baseUrl}/cards/` + cardID, {
    method: "DELETE",
    headers: config.headers,
  }).then((res) => handleResponse(res))
};

/* функция лайка/дизлайка карточки на сервере
 * @promise
 * @param {String} cardID - ID карточки, которую нужно лайкнуть/дизлайкнуть
 * @param {bool}   oldLike - состояние лайка до нажатия
 */
export const likeCard = (cardID, oldLike) => {
  let method = "PUT";
  if (oldLike) {
    // уже был лайкнутый
    method = "DELETE";
  }
  return fetch(`${config.baseUrl}/cards/likes/` + cardID, {
    method,
    headers: config.headers,
  }).then((res) => handleResponse(res))
};
