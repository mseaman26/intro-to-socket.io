const router = require('express').Router();
const { User } = require('../models');
const { signToken } = require('../utils/auth');


router.get('/', (req, res) => {
  res.json('Hello, World!');
})

router.post('/signup', async (req, res) => {
    const { email, username, password } = req.body;

    try{
        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }

        const newUser = await User.create({
            email, 
            username, 
            password
        });
        const plainUser = newUser.get({plain: true});   
        const tokenData = { email: plainUser.email, username: plainUser.username, id: plainUser.id };
        const token = signToken(tokenData);


        res.status(200).json({token, user: newUser});

        
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: 'Invalid email or password'});
        }
        const plainUser = user.get({plain: true});
        const validPassword = await user.isCorrectPassword(password);
        if(!validPassword){
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = signToken(plainUser);
        res.status(200).json({token, plainUser});

    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    }
})

module.exports = router;