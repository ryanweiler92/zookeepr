const path = require('path');
const router = require('express').Router();

//FOR THE INDEX.HTML; respond with an HTML page to display in the browser; the '/' points us to the root route of the server
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
//FOR THE ANIMALS.HTML file
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});
//FOR ZOOKEEPERS.HTML file
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});
//wildcard route redirects any bad requests made when there are no routes that match; this must be last
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;