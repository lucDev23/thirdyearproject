import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
	code: { type: String, unique: true, required: true},
	bismarckPlayer: { type: String, unique: true },
	bismarckPlayerSocket: { type: String, unique: true },
	swordfishPlayer: { type: String, unique: true },
	swordfishPlayerSocket: { type: String, unique: true },
	// bismarckPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null },
	// swordfishPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: null }
})

export default mongoose.model('Game', GameSchema);