const {Router} = require('express');
const router = Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');

router.get('/', (req, res) => res.send('hello world'))

router.post('/signup', async (req, res) => {
    const{username, password} = req.body;
    const newUser = new User({username, password})
    await newUser.save();

    const token= jwt.sign({_id: newUser._id}, 'secretKey')
    return res.status(200).json({token})
    
})


router.post('/signin', async (req, res) => {

    const {username, password} = req.body;
    const user = await User.findOne({username})
    if(!user) return res.status(401).send("the username doesn't exist");
    if(user.password !== password) return res.status(401).send ('Wrong password');

    const token = jwt.sign({_id:user._id}, 'secretKey');
    return res.status(200).json({token});
});

router.get('/task', (req, res) => {
    res.json({
        name: 'task',
        description: 'lorem ipsum'
    })
})

router.get('/private-task', verifyToken, (req, res) => {
    res.json({
        name: 'task',
        description: 'lorem ipsum'
    })
})

module.exports = router;

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        return res.status(401).send('Unathorize Request');
    }

    const token = req.headers.authorization.split(' ')[1]
    if (token === 'null'){
        return res.status(401).send('Unathorize Request')
    }

    const payload = jwt.verify(token, 'secretKey')
    req.userId = payload._id;
    next();
}