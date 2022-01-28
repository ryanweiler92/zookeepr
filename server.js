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

//function is called from the first app.get.. takes parameter of query (EX. diet=carnivore???) and the animal array
function filterByQuery(query, animalsArray) {
    //we create an empty array becuase you can search for multiple personalityTraits 
    let personalityTraitsArray = [];
    //variable that will copy animalsArray but we can change it with the filter
    let filteredResults = animalsArray;
    //if the query property is personality traits
    if (query.personalityTraits) {
        // if there is only one personality trait, it is listed as a string. we make it an array for some reason
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            //if the personality traits are already an array we keep it as an array
            personalityTraitsArray = query.personalityTraits;
        }
        //we call a foreach loop on our own personalityTraitsArray we created 
        personalityTraitsArray.forEach(trait => {
            //at this point filteredResults is the animals array. We filter that array 
            filteredResults = filteredResults.filter(
                //I have no idea what's going on here. Super annoying the module doesn't explain this.
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    //if the query property is diet
    if (query.diet) {
        //at this point filteredResults equals the animals array. We redfine it as the animal array with .filter. We filter through each animal in the array and match the diet property
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    //if the query property is species
    if (query.species) {
        //at this point filteredResults equals the animals array. We redfine it as the animal array with .filter. We filter through each animal in the array and match the species property
        filteredResults = filteredResults.filter(animal => animal.species === query.species)
    }
    //if the query property is name
    if (query.name) {
        //at this point filteredResults equals the animals array. We redfine it as the animal array with .filter. We filter through each animal in the array and match the name property
        filteredResults = filteredResults.filter(animal => animal.name === query.name)
    }
    //this returns the animal array with just our filtered results
    return filteredResults;
}

//this function is for finding only one result by ID.
function findById(id, animalsArray) {
    //sets variable to filter the animals array and find each id that matches the parameter id (the [0] says choose only the first one??)
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

//this function is being called from the POST callback function; adds new animal data to the animalsArray
function createNewAnimal(body, animalsArray) {
    //this is the animal data being entered 
    const animal = body;
    //push the new animal data to the animals array
    animalsArray.push(animal)
    //synchronous verson of fs.writeFile(); doesn't require callback function
    fs.writeFileSync(
        //we want to write our animals.json file to the data subdirectory so we use path.join() to join the value of __dirname which is the directory of the file we execute code in with the path to the animals.json file
        path.join(__dirname, './data/animals.json'),
        //we need to save the array data as JSON; null means we dont want to edit any of our existing data. 2 indicates we want to create white space between our values to make more readable;
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    //return finished code to post route for response
    return animal;
};

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;s
    }
    return true
}

//req is an object containing information about the HTTP request that raised the event. In response to req, you use res to send back the desired HTTP response.
app.get('/api/animals', (req, res) => {
    //results equals the animals json file
    let results = animals;
    //if the request object has a query property? 
    if (req.query) {
        //the results variable now equals the filter function with the parameters of the request object query property and results (which is the animals array)?  
        results = filterByQuery(req.query, results);
    }
    //response from the request returns the results from the filter function in json format
    res.json(results)
})


//unlike the query object, the param object needs to be defiend in the route path with <route>/:<parameterName>
app.get('/api/animals/:id', (req, res) => {
    //we set result variable to the findById function. This function takes parameters of request(object).parameters(object).id and the animals array
    const result = findById(req.params.id, animals);
    if (result) {
        //if the function finds results based on the id, display the results
    res.json(result)
    } else {
        //if no results found, display 404 message
        res.send(404)
    }
});

//another method of the app object that allows us to create routes. POST requests represent the action of a client requesting the server to accept data rather than vice versa.
app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();
    //if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted');
    } else {
        //add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
    }
    //POST requests package up data as an object and send to server. req.body is property where we can access that data on server side
    res.json(req.body)
});
//FOR THE INDEX.HTML; respond with an HTML page to display in the browser; the '/' points us to the root route of the server
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
//FOR THE ANIMALS.HTML file
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});
//FOR ZOOKEEPERS.HTML file
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});
//wildcard route redirects any bad requests made when there are no routes that match; this must be last
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// app = express() above. we chain the .listen to app. Listen to PORT, a variable defined as const PORT = process.env.PORT || 3001. 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});