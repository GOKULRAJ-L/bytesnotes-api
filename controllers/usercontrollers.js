const User = require('../models/User')
const Note = require('../models/notes')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')


//@get all users
//@GET/users
//@priate access
const getallUser = asyncHandler(async (req,res)=>{
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message:'No users Found'})
    }
    res.json(users)
    
})

//@create new user
//@POST /users
//@priate access
const createUser = asyncHandler(async (req,res)=>{
    //confirm data 
    const {username,password,roles} = req.body
    if(!username || !password || !roles.length || !Array.isArray(roles)){
        return res.status(400).json({message:"All fields are required"})
    }

    //check for duplication of data
    const duplicate = await User.findOne({username}).lean().exec()
    if (duplicate){
         return res.status(404).json({message:'Username already exists'})
    }
    //hashing password
    
    const hashpass = await bcrypt.hash(password,10)

    //creating new user
    const data = {username,"password":hashpass,roles}
    const user = await User.create(data)

    if(user){
        return res.status(201).json({message:`Profile is created for ${username}`})
    }
    else{
        return res.status(400).json({message:'Invalid user data received'})
    }

})

//@update all users
//@PUT/users
//@priate access
const updateUser = asyncHandler(async (req ,res)=>{
    const {id, username , roles , active , password} = req.body
    //confirm data 
    if(!id || !username || Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message:'All fields are required'})
    }

    const user = await User.findById(id).exec()
     if (!user){
        return res.status(400).json({message:'user not found'})
     }
     //check for duplicates
    const duplicates = await User.findOne({username}).lean().exec()
    if(duplicates && dupliclates?._id.toString() !== id){
        return res.status(409).json({message:'Try for another username'})
    }

    user.username = username
    user.roles = roles
    user.active = active
    // don't always execute a password
    if(password){
        user.password = await bcrypt.hash(password,10)
    }
    const updateduser = await user.save()
    res.json({message:`${updateduser.username} is updated successfully` })

})

//@delete all users
//@DELETE/users
//@priate access
const deleteUser = asyncHandler(async (req , res)=>{
    const { id } = req.body
    //checking for id 
    if(!id){
        return res.status(400).json({message:'User ID is required'})

    }
    //checking if user is assinged for any notes
    const notes = await Note.findOne({user:id}).lean().exec()
    if(notes){
        return res.status(400).json({message:'User has assigned Notes'})
    }

    //checking if user exists
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message:"User doesn't exist"})
    }
    const data = await user.toObject() 
    await user.deleteOne()

    const reply = `username ${data.username} is deleted`

    res.json(reply)

})



module.exports = {
    getallUser,
    createUser,
    updateUser,
    deleteUser
}
