require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const {logevent,logger} = require('./middleware/logger')
const errHandler = require('./middleware/errorHandler')
const cors = require('cors') 
const mongoose = require('mongoose')
const connectDB = require('./config/dbConnection')
const corsOptions = require('./config/corsOoptions') 
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 3500

//env variables
console.log(process.env.NODE_ENV)
// usage of middleware
connectDB()
app.use(logger)
app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions)) 
app.use(express.static('public'))
app.use('/',require('./routes/root'))
app.use('/auth',require('./routes/authRoutes'))
app.use('/users' ,require('./routes/UserRoutes'))
app.use('/notes',require('./routes/NoteRoutes'))
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    } 
    else if(req.accepts('json')){
        res.json({message:"404 Not Found"})
    }
    else{
        res.type('txt').send('404 Not Found')
    }
})

app.use(errHandler)

// Listening to port and connection to the database
mongoose.connection.once('open',()=>{
    console.log('connected to MongoDB')
    app.listen(PORT,()=>{console.log(`Server is running on port ${PORT}`)})
})
mongoose.connection.on('error',(err) =>{
    console.log(err)
    logevent(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,'mongoErrlog.log')

})