const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const Organization = require('../models/Organization')

/** 
 * @desc Get all users
 * @route GET /users
 * @access Private
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    res.json(users)
})

/** 
 * @desc Create a new user
 * @route POST /users
 * @access Private
 */
const createNewUsers = asyncHandler(async (req, res) => {
    const { username, password, roles, firstname, lastname } = req.body

    if (!(username && password && firstname && lastname && Array.isArray(roles) && roles.length)) {
        return res.status(400).json({ message : 'Missing required fields' })
    }
    
    const duplicateUser = await User.findOne({ username }).lean().exec()
    if (duplicateUser) {
        return res.status(409).json({ message : 'User already exists' })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const createUserObject = { username, password: hashPassword, roles, firstname, lastname }

    const user = await User.create(createUserObject)
    if (!user) {
        return res.status(400).json({ message: `Invalid User data` })
    } 
    res.status(201).json({ message: `New user ${username} created` })
})

/** 
 * @desc Updater a user
 * @route PUT /users
 * @access Private
 */
const updateUsers = asyncHandler(async (req, res) => {
    const { id, username, password, roles, firstname, lastname, active } = req.body

    if (!(id && username && password && Array.isArray(roles) && roles.length && typeof active === 'boolean')) {
        return res.status(400).json({ message : 'All fields are required' })
    }
    
    const duplicateUser = await User.findOne({ username }).lean().exec()
    if (duplicateUser && duplicateUser?._id.toString() !== id) {
        return res.status(409).json({ message : 'User with same username exists' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: `User data not found` })
    } 

    
    const hashPassword = await bcrypt.hash(password, 10);
    
    user.username = username
    user.password = hashPassword
    user.roles = roles
    user.firstname = firstname
    user.lastname = lastname
    user.active = active

    const updateUser = await user.save()

    res.json({ message: `User ${updateUser.username} updated` })
})

/** 
 * @desc Delete a user
 * @route DELETE /users
 * @access Private
 */
const deleteUsers = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message : 'User ID required' })
    }

    const user = await User.findById(id).exec()
    if (!user) {
        return res.status(400).json({ message: `User data not found` })
    }

    const result = await user.deleteOne()
    if (!result?.deletedCount) {
        return res.json({ message: `User ${user.username} not deleted` })
    }
    res.json({ message: `User ${user.username} Deleted` })
})

module.exports = { getAllUsers, createNewUsers, updateUsers, deleteUsers }