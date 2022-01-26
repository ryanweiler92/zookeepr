//sets variable that sets route that we can request data from. this is the animals json file.
const { animals } = require('./data/animals');
//variable to require the npm package express
const express = require('express');
const e = require('express');

//when Heroku runs our app it sets and environment variable called "process.env.PORT". We are telling our app to use that port if it has been set, and if not to default to port 80(???)
//module says to use the port that has been set or default to port 80 but then has us write "3001" (???)
const PORT = process.env.PORT || 3001;
//istantiate the server
const app = express();

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

// app = express() above. we chain the .listen to app. Listen to PORT, a variable defined as const PORT = process.env.PORT || 3001. 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});