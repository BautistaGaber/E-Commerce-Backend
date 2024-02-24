import userModel from '../fileSystem/mongodb/models/user.model.js';

class UserMongo{
    constructor(){
        this.model = userModel;
    }

    async getUserByCart(cart){
        try{
            return await userModel.findOne({cart: cart});
        }catch(e){
            throw new Error(e.message);
        }
    }
}

export {UserMongo}