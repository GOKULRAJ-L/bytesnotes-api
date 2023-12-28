const {logevent} = require('./logger')

const errHandler = (err, req,res,next)=>{
    logevent(`${err.name}:${err.message}\t ${req.method}\t${req.url}\t${req.headers.origin}`,'errlog.log')
    console.log(err.stack)
    const status = res.statusCode? res.statusCode: 500 //server error
    res.status(status)
    res.json({message:err.message})
    next()
}

module.exports = errHandler