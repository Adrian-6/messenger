import mongoose, { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface IUser extends mongoose.Document {
    username: String;
    contacts: String[];
    refreshToken?: String;
    avatar?: String;
    email?: String;
    contactRequests: String[];
}
// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
    username: { type: String, required: true },
    contacts: { type: [String] },
    refreshToken: { type: String },
    avatar: String,
    email: String,
    contactRequests: { type: [String] },
});

// 3. Create a Model.
const User = model<IUser>('User', userSchema);
export default User;
