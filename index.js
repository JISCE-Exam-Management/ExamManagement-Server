require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.DB_URL, {useNewUrlParser:true, useUnifiedTopology: true}, (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("Connected")
    }
})

app.use(require('cors'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/admin', require('./Routers/adminRoutes'));
app.use('/user', require('./Routers/userRoutes'));
app.use('/students', require('./Routers/studentsRouter'));
app.use('/exams', require('./Routers/examRoutes'));
app.use('/degrees', require('./Routers/degreeRoutes'));

app.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT)
});