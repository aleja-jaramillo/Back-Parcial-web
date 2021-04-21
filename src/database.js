const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/web', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(db => console.log('database is conectded'))
    .catch(err => console.log(err));
