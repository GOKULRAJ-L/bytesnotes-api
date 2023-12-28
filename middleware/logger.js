const{format} = require('date-fns')
const {v4:uuid} = require('uuid')
const fs = require('fs')
const fspromises = require('fs').promises
const path = require('path')

const logevent = async (message , logFilename)=>{
    const dataTime = `${format(new Date(),'dd/MM/yyyy\tHH:mm:ss')}`
    const logItem = `${dataTime} \t ${uuid()} \t ${message}\n`
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fspromises.mkdir(path.join(__dirname,'..','logs'))
        }
        await fspromises.appendFile(path.join(__dirname,'..','logs',logFilename),logItem)

    }
    catch(err){
        console.log(err)
    }

}
const logger = (req,res,next)=>{
    logevent(`${req.method}\t${req.url}\t${req.headers.origin}`,'logeventfile.log')
    console.log(`${req.method}\t${req.path}`)
    next()
}

module.exports = {logevent,logger}