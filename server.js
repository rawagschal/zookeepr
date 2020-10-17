const express = require('express');
const { animals } = require('./data/animals.json');
const PORT = process.env.PORT || 3001;

// instantiate the server by assigning it to `app` const
const app = express();

// filter through the animals from `req.query` (user search query)
// returning a new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // save the animalsArray as filteredResults
    let filteredResults = animalsArray;
    // save personalityTraits as a dedicated array
    if (query.personalityTraits){
        //add animals with at least the given trait to the array
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // loop through each personality trait in the array
        // using forEach() so that the new array only contains animals w/the indicated trait
        personalityTraitsArray.forEach(trait => {
            //check the trait against each animal in the personalityTraits array
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}


// add a route (test this before filterByQuery, but place it after in your code)
app.get('/api/animals', (req, res) => {
    let results = animals;
    // if there is a query, filter accordingly
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    //respond with the results in json format
    res.json(results);
});

// get an animal by it's ID parameter 
app.get('/api/animals/:id', (req, res) => {
    // use findById(req.params.id) because each animal's id is unique
    // and there won't be any queries on a single animal
    const result = findById(req.params.id, animals);
        if (result) {
            res.json(result);
        } else {
            res.send(404);
        }    
})

// add POST route here at 11.2.3

// chain `listen()` method to `app` variable to tell the server to listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})