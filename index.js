import express from "express"
import FileUpload from "express-fileupload"
import db from "./config/Database.js"
import router from "./routes/route.js"
// import product from "./models/ProductModels.js"
const app = express()
try {
    db.authenticate()
    console.log("database conected")
    // product.sync()
} catch (error) {
    console.log(error.message);
}
app.use((req,res,next) => {
    res.setHeader("Access-Control-ALlow-Origin","http://localhost:3000")
    res.setHeader("Access-Control-Allow-Methods","POST,GET,DELETE,PATCH,OPTIONS")
    next();
})
app.use(express.json())
app.use(FileUpload());
app.use(express.static("public"));
app.use(router);
app.listen(5050,() => console.log("server is running"));