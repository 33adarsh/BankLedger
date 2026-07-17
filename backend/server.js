import dotenv from "dotenv";
dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });
import app from "./src/app.js";
import connectDB from "./src/db/db.js"

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`server is running ${PORT}`)
})

export default app;