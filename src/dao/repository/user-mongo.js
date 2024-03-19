import userModel from "../fileSystem/mongodb/models/user.model.js";

class UserMongo {
  constructor() {
    this.model = userModel;
  }

  async getUserByCart(cart) {
    try {
      return await userModel.findOne({ cart: cart });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateUser(user) {
    try {
      return await userModel.updateOne({ _id: user._id }, user);
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async getUserByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (e) {
      throw new Error(e.message);
    }
  }

  async updateUserByEmail(email, user) {
    try{
      return await userModel.findOneAndUpdate({ email: email, user: user });
    }
    catch(e){
      throw new Error(e.message);
    }
  }

  async getUserbyId(userId) {
    try {
      return await userModel.findById(userId);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export { UserMongo };
