import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	socketId: { type: String, default: null }
})

export default mongoose.model('Player', PlayerSchema);