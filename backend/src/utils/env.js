import dotenv from "dotenv";
dotenv.config({ quiet: true });


export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI; 
export const CLIENT_URL = process.env.CLIENT_URL;

