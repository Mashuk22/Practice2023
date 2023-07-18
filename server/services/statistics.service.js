class StatisticsService {
  static #statistics = {};

  getUserStatistics(user) {
    return this.#statistics[user];
  }

  static addStatistics(user, route, data) {
    const stat = {
      date: new Date(),
      route,
      params: data,
    };

    if (this.#statistics[user]?.length) {
      this.#statistics[user].push(stat);
    } else {
      this.#statistics[user] = [stat];
    }

    console.log(this.#statistics[user]);
  }
}

module.exports = StatisticsService;
