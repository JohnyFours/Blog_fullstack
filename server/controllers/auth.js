import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//Register user
export const register = async (req, res) => {
    try {
        const { username, password } = req.body

        const isUsed = await User.findOne({ username })
        if (isUsed) {
            return res.status(402).json({
                massage: "This name is already in use"
            })
        }

        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            username,
            password: hash,
        })

        await newUser.save()

        res.json({
            newUser, massage: "Registration completed successfully"
        })

    } catch (error) {
        res.json({
            massage: "Error creating user"
        })

    }
}

//Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            return res.json({
                massage: "Wrong user or password"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.json({
                massage: "Wrong user or password"
            })
        }

        const token = jwt.sign({
            id: user._id,
        },
            process.env.JWT_SECRET,
            { expiresIn: '30d' })

        res.json({ token, user, massage: 'You have successfully logged' })

    } catch (error) {
        res.json({
            massage: "Authorization errorr"
        })
    }
}

//Get me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({
                massage: "No such user exists"
            })
        }

        const token = jwt.sign({
            id: user._id,
        },
            process.env.JWT_SECRET,
            { expiresIn: '30d' })

        res.json({ user, token })

    } catch (error) {
        return res.json({
            massage: "No access"
        })
    }
}