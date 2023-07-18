const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const StatisticsService = require("./services/statistics.service");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Добавляем промежуточное ПО для обработки данных в формате JSON
app.use(bodyParser.json());

// Моковые данные пользователей
const users = [
  { id: 1, name: "User 1", email: "user1@example.com", oauthToken: "token1" },
  { id: 2, name: "User 2", email: "user2@example.com", oauthToken: "token2" },
];

const sellers = [
  {
    id: 1,
    company_name: "Company 1",
    email: "seller1@example.com",
    password: "password1",
  },
  {
    id: 2,
    company_name: "User 2",
    email: "seller2@example.com",
    password: "password2",
  },
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

users[0].favouritePromotions = [promotions[0]];
users[1].favouritePromotions = promotions;

// Регистрация пользователя
app.post("/registration", (req, res) => {
  const { name, email, oauthToken } = req.body;
  const newUser = { id: users.length + 1, name, email, oauthToken };
  users.push(newUser);

  StatisticsService.addStatistics(newUser.id, "/registration", newUser);

  res.status(200).json({ message: "Registration successful" });
});

// Авторизация пользователя
app.post("/login", (req, res) => {
  const { email, oauthToken } = req.body;
  const user = users.find(
    (user) => user.email === email && user.oauthToken === oauthToken
  );

  StatisticsService.addStatistics(user.id, "/login", { email, oauthToken });

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
  res.status(200).json(promotions);
});

// Получение доступных методов сортировки акций
app.get("/promotions/sort-types", (req, res) => {
  res.status(200).json({ sortTypes: ["Sort Type 1", "Sort Type 2"] });
});

// Сортировка акций
app.post("/promotions/sort", (req, res) => {
  const selectedSortType = req.body.sortType;
  const userId = req.body.userId;
  StatisticsService.addStatistics(userId, "/promotions/sort", { selectedSortType });
  // Сортируем акции согласно выбранному методу сортировки и возвращаем отсортированный список
  const sortedPromotions = promotions.sort((a, b) => a.id - b.id);
  res.status(200).json(sortedPromotions);
});

// Добавление акции в избранное
app.post("/promotions/favorite", (req, res) => {
  const promotionId = req.body.promotionId;
  const userId = req.body.userId;
  StatisticsService.addStatistics(userId, "/promotions/favorite", { promotionId });

  const promotion = promotions.find((p) => p.id === promotionId);
  const user = users.find((u) => u.id === parseInt(userId));
  user.favouritePromotions.push(promotion);
  res.status(200).json({ message: "Operation successful" });
});

// Получение подробной информации об акции
app.get("/promotions/:id", (req, res) => {
  const promotionId = req.params.id;
  // Получаем все данные об акции из таблицы Promotions и возвращаем их
  const promotion =
    promotions.find((p) => p.id === parseInt(promotionId)) || null;
  res.status(200).json(promotion);
});

// Начало прохождения акции
app.post("/promotions/:id/start", (req, res) => {
  const promotionId = req.params.id;
  const userId = req.body.userId;
  StatisticsService.addStatistics(userId, `/promotions/${promotionId}/start`, { promotionId });
  // Создаем запись в таблице User_progress для отслеживания прогресса пользователя
});

// Получение информации о профиле пользователя
app.get("/user/profile", (req, res) => {
  const userId = req.query.userId;
  StatisticsService.addStatistics(userId, "/user/profile", { userId });
  // Возвращаем данные пользователя из таблицы Users
  const user = users.find((u) => u.id === parseInt(userId)) || null;
  res.status(200).json(user);
});

// Получение акций, которые проходит пользователь
app.get("/user/in-progress", (req, res) => {
  const userId = req.query.userId;
  StatisticsService.addStatistics(userId, "/user/in-progress", { userId });
  // Возвращаем список акций, связанных с пользователем в таблице User_progress
  const user = users.find((u) => u.id === parseInt(userId));
  res.status(200).json(user.favouritePromotions);
});

// Получение избранных акций пользователя
app.get("/user/favorite", (req, res) => {
  const userId = req.query.userId;
  StatisticsService.addStatistics(userId, "/user/favorite", { userId });
  // Возвращаем список избранных акций, связанных с пользователем в таблице Favourite_promotions
  const user = users.find((u) => u.id === parseInt(userId));
  res.status(200).json(user.favouritePromotions);
});

// Получение пройденных акций пользователя
app.get("/user/completed", (req, res) => {
  // Возвращаем список пройденных акций, связанных с пользователем в таблице Promotion_statistics
});

// Выход из аккаунта
app.post("/logout", (req, res) => {
  const userId = req.query.userId;
  StatisticsService.addStatistics(userId, "/logout", { userId });
  // Удаляем текущую сессию пользователя
});

// Регистрация продавца
app.post("/seller/registration", (req, res) => {
  const { company_name, email, password } = req.body;

  const newSeller = { id: sellers.length + 1, company_name, email, password };
  StatisticsService.addStatistics(newSeller.id, "/seller/registration", { company_name, email, password });

  sellers.push(newSeller);
  res.status(200).json({ message: "Registration successful" });
});

// Авторизация продавца
app.post("/seller/login", (req, res) => {
  const { email, password } = req.body;
  const seller = sellers.find(
    (seller) => seller.email === email && seller.password === password
  );
  if (seller) {
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Создание акции
app.post("/promotions/create", (req, res) => {
  const { seller_id, title, product_name, description, received_discount } =
    req.body;
  StatisticsService.addStatistics(seller_id, "/promotions/create", { seller_id, title, product_name, description, received_discount });
  const newPromotion = {
    id: promotions.length + 1,
    seller_id,
    title,
    product_name,
    description,
    received_discount,
  };
  promotions.push(newPromotion);
  res.status(200).json(newPromotion);
});

// Получение списка акций продавца
app.get("/seller/promotions", (req, res) => {
  const sellerId = req.query.sellerId;
  StatisticsService.addStatistics(sellerId, "/seller/promotions", { sellerId });
  // Возвращаем список акций, связанных с продавцом, отсортированных в порядке добавления
  const sellerPromotions =
    promotions.find((p) => p.seller_id === parseInt(sellerId)) || null;
  res.status(200).json(sellerPromotions);
});

// Получение доступных фильтров для акций продавца
app.get("/seller/filters", (req, res) => {
  // Возвращаем доступные фильтры для акций продавца
  res.status(200).json({ filters: ["Filter 1", "Filter 2"] });
});

// Применение фильтров к акциям продавца
app.post("/seller/filters", (req, res) => {
  const selectedFilters = req.body.filters;
  // Применяем выбранные фильтры к акциям продавца и возвращаем отфильтрованный список
  res.status(200).json(promotions);
});

// Получение доступных методов сортировки акций продавца
app.get("/seller/sort-types", (req, res) => {
  const sellerId = req.query.sellerId;
  StatisticsService.addStatistics(sellerId, "/seller/sort-types", { sellerId });
  // Возвращаем доступные методы сортировки акций продавца
  res.status(200).json({ sortTypes: ["Sort Type 1", "Sort Type 2"] });
});

// Сортировка акций продавца
app.post("/seller/sort", (req, res) => {
  const sellerId = req.query.sellerId;
  StatisticsService.addStatistics(sellerId, "/seller/sort", { sellerId });
  // Сортируем акции продавца согласно выбранному методу сортировки и возвращаем отсортированный список
  const sortedPromotions = promotions
    .find((p) => p.seller_id === parseInt(sellerId))
    ?.sort((a, b) => a.id - b.id);
  res.status(200).json(sortedPromotions);
});

// Получение информации о профиле продавца
app.get("/seller/profile", (req, res) => {
  const sellerId = req.query.sellerId;
  StatisticsService.addStatistics(sellerId, "/seller/profile", { sellerId });
  // Возвращаем данные продавца из таблицы Sellers
  const seller = sellers.find((s) => s.id === parseInt(sellerId));
  res.status(200).json(seller);
});

// Редактирование акции
app.post("/promotions/:id/edit", (req, res) => {
  const promotionId = req.params.id;
  const sellerId = req.body.sellerId;
  const { title, product_name, description, received_discount } = req.body;
  StatisticsService.addStatistics(sellerId, `/promotions/${promotionId}/edit`, { title, product_name, description, received_discount });
  promotions.map((p) => {
    if (p.id === promotionId) {
      return {
        id: p.id,
        title,
        product_name,
        description,
        received_discount,
      };
    }

    return p;
  });
  res.status(200).json({ message: "Edit successful" });
  // Обновляем запись акции в таблице Promotions с новыми данными
});

// Выход из аккаунта продавца
app.post("/logout", (req, res) => {
  const sellerId = req.body.sellerId;
  StatisticsService.addStatistics(sellerId, `/logout`, { sellerId });
  // Удаляем текущую сессию продавца
});

// Запуск сервера
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
