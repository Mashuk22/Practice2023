const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Добавляем промежуточное ПО для обработки данных в формате JSON
app.use(bodyParser.json());

// Моковые данные пользователей
const users = [
  { id: 1, name: "User 1", email: "user1@example.com", oauthToken: "token1" },
  { id: 2, name: "User 2", email: "user2@example.com", oauthToken: "token2" },
];

// Моковые данные акций
const promotions = [
  {
    id: 1,
    seller_id: 1,
    title: "Promotion 1",
    product_name: "Product 1",
    description: "Description 1",
    received_discount: 10,
  },
  {
    id: 2,
    seller_id: 1,
    title: "Promotion 2",
    product_name: "Product 2",
    description: "Description 2",
    received_discount: 20,
  },
];

// Регистрация пользователя
app.post("/registration", (req, res) => {
  const { name, email, oauthToken } = req.body;
  const newUser = { id: users.length + 1, name, email, oauthToken };
  users.push(newUser);
  res.status(200).json({ message: "Registration successful" });
});

// Авторизация пользователя
app.post("/login", (req, res) => {
  const { email, oauthToken } = req.body;
  const user = users.find(
    (user) => user.email === email && user.oauthToken === oauthToken
  );
  if (user) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Получение ленты акций
app.get("/promotions/feed", (req, res) => {
  res.status(200).json(promotions);
});

// Получение доступных фильтров для акций
app.get("/promotions/filters", (req, res) => {
  res.status(200).json({ filters: ["Filter 1", "Filter 2"] });
});

// Применение фильтров к акциям
app.post("/promotions/filters", (req, res) => {
  const selectedFilters = req.body.filters;
  // Применяем выбранные фильтры к акциям и возвращаем отфильтрованный список
});

// Получение доступных методов сортировки акций
app.get("/promotions/sort-types", (req, res) => {
  res.status(200).json({ sortTypes: ["Sort Type 1", "Sort Type 2"] });
});

// Сортировка акций
app.post("/promotions/sort", (req, res) => {
  const selectedSortType = req.body.sortType;
  // Сортируем акции согласно выбранному методу сортировки и возвращаем отсортированный список
});

// Добавление акции в избранное
app.post("/promotions/favorite", (req, res) => {
  const promotionId = req.body.promotionId;
  // Связываем акцию с пользователем в таблице Favourite_promotions
});

// Получение подробной информации об акции
app.get("/promotions/:id", (req, res) => {
  const promotionId = req.params.id;
  // Получаем все данные об акции из таблицы Promotions и возвращаем их
});

// Начало прохождения акции
app.post("/promotions/:id/start", (req, res) => {
  const promotionId = req.params.id;
  // Создаем запись в таблице User_progress для отслеживания прогресса пользователя
});

// Получение информации о профиле пользователя
app.get("/user/profile", (req, res) => {
  // Возвращаем данные пользователя из таблицы Users
});

// Получение акций, которые проходит пользователь
app.get("/user/in-progress", (req, res) => {
  // Возвращаем список акций, связанных с пользователем в таблице User_progress
});

// Получение избранных акций пользователя
app.get("/user/favorite", (req, res) => {
  // Возвращаем список избранных акций, связанных с пользователем в таблице Favourite_promotions
});

// Получение пройденных акций пользователя
app.get("/user/completed", (req, res) => {
  // Возвращаем список пройденных акций, связанных с пользователем в таблице Promotion_statistics
});

// Выход из аккаунта
app.post("/logout", (req, res) => {
  // Удаляем текущую сессию пользователя
});

// Регистрация продавца
app.post("/seller/registration", (req, res) => {
  // Обработка регистрации продавца
});

// Авторизация продавца
app.post("/seller/login", (req, res) => {
  // Обработка авторизации продавца
});

// Создание акции
app.post("/promotions/create", (req, res) => {
  // Обработка создания акции
});

// Получение списка акций продавца
app.get("/seller/promotions", (req, res) => {
  // Возвращаем список акций, связанных с продавцом, отсортированных в порядке добавления
});

// Получение доступных фильтров для акций продавца
app.get("/seller/filters", (req, res) => {
  // Возвращаем доступные фильтры для акций продавца
});

// Применение фильтров к акциям продавца
app.post("/seller/filters", (req, res) => {
  // Применяем выбранные фильтры к акциям продавца и возвращаем отфильтрованный список
});

// Получение доступных методов сортировки акций продавца
app.get("/seller/sort-types", (req, res) => {
  // Возвращаем доступные методы сортировки акций продавца
});

// Сортировка акций продавца
app.post("/seller/sort", (req, res) => {
  // Сортируем акции продавца согласно выбранному методу сортировки и возвращаем отсортированный список
});

// Получение информации о профиле продавца
app.get("/seller/profile", (req, res) => {
  // Возвращаем данные продавца из таблицы Sellers
});

// Редактирование акции
app.post("/promotions/:id/edit", (req, res) => {
  const promotionId = req.params.id;
  // Обновляем запись акции в таблице Promotions с новыми данными
});

// Выход из аккаунта продавца
app.post("/logout", (req, res) => {
  // Удаляем текущую сессию продавца
});

// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
