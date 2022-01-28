const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


const fs = require('fs');
const path = require('path');

//sets variable that sets route that we can request data from. this is the animals json file.
const { animals } = require('./data/animals');
//variable to require the npm package express
const express = require('express');
const e = require('express');

//when Heroku runs our app it sets and environment variable called "process.env.PORT". We are telling our app to use that port if it has been set, and if not to default to port 80(???)
//module says to use the port that has been set or default to port 80 but then has us write "3001" (???)
const PORT = process.env.PORT || 3001;
//instantiate the server
const app = express();

//these 2 variables are related to the POST method; BOTH of these middleware functions need to be set up every time you create a server that accept POST data
//parse incoming string or array data     app.use() method is middleware; This method takes incoming POST data and converts to key/value pairings that can be accessed in req.body object; extended true means that there maybe sub-array data nested as well.
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data into the req.body object
app.use(express.json());

//middleware that makes a location (folder) have files that are static resources. This is how the HTML page can access the CSS and javascript.
app.use(express.static('public'));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);



// app = express() above. we chain the .listen to app. Listen to PORT, a variable defined as const PORT = process.env.PORT || 3001. 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});