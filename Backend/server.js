require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/utils/db')

connectDB()

const port = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    return res.send("Server is live")
})

app.listen(port, (req, res) => {
    console.log(`Server connected to port ${port}`)
})