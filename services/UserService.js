class UserService {
  constructor(User) {
    this.User = User;
    this.saveUser = this.saveUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getUserById = this.getUserById.bind(this);
  }

  async saveUser(user) {
    await user.save();
    return user;
  }

  async getUser(username, password, name, room) {
    return await this.User.findOne({ username, password, name, room });
  }

  async getUserById(userId) {
    return await this.User.findById(userId);
  }
}

module.exports = UserService;
