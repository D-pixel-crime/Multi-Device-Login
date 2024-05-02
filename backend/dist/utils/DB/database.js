var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import "colors";
let databaseConnected = false;
export const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose.set("strictQuery", true);
    try {
        const res = yield mongoose.connect(process.env.MONGO_URI);
        databaseConnected = true;
        console.log(`MongoDB connected: ${res.connection.host}`.bgCyan.bold);
    }
    catch (error) {
        console.error(`Error: ${error.message}`.red);
        process.exit(1);
    }
});
