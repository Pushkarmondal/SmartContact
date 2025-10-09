import express from "express"
import signup from "./src/auth/signup.services"
import login from "./src/auth/login.services"
import contacts from "./src/contactservices/contact.services"

const app = express()
const PORT = 4002

app.use(express.json())

app.use("/auth", signup)
app.use("/auth", login)

app.use("/contacts", contacts)

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})