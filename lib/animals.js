const fs = require('fs');
const path = require('path');


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
        path.join(__dirname, '../data/animals.json'),
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
};

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};
