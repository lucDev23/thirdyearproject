import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, unique: true, required: true }
})

export default mongoose.model('Player', PlayerSchema);