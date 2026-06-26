const mongoose = require('mongoose')

const connectDB = async () => {
   try {
      mongoose.connect(process.env.MONGO_URI)
      console.log('DB connected')
   } catch (err) {
      console.log(err)
   }
}

module.exports = connectDB