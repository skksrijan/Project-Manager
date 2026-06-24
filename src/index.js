import dotenv from "dotenv" ;
import app from "./app.js" ;
import connectDB from "./db/index.js" ; 

dotenv.config({
    path : "./.env"
}) ;

const port = process.env.PORT ||3000;

connectDB()
.then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
})

.catch((err) => {
  console.log("Error connecting to the database:", err);
  process.exit(1); // Exit the process with an error code
})