//using router because we can't use app; allows us to declare routes in any file
const router = require('express').Router()
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//req is an object containing information about the HTTP request that raised the event. In response to req, you use res to send back the desired HTTP response.
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
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
router.post('/animals', (req, res) => {
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

module.exports = router;