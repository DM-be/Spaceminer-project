const express = require('express');
const hbs = require('hbs');


const port = process.env.PORT || 3001;


var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname));


// app.route({
//     method: 'GET',
//     path: '/phaser.js',
//     handler: {
//         directory: {
//             path:    __dirname + '/public',
//             listing: false,
//             index:   false
//         }
//     }
// });

// app.route({
//     method: 'GET',
//     path: '/script.js',
//     handler: {
//         directory: {
//             path:    __dirname + '/public',
//             listing: false,
//             index:   false
//         }
//     }
// });
//
// app.route({
//     method: 'GET',
//     path: '/',
//     handler: function(request, reply) {
//         reply.view('homepage');
//     }
// });

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home.hbs')
});




app.listen(port);



