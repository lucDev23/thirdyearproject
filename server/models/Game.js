import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
	code: { type: String, unique: true, required: true},
	players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
})

export default mongoose.model('Game', GameSchema);