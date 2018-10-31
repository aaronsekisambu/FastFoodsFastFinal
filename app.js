// Global express initialisation
const express = require('express');


//Start to use express
const app = express();

// call Joi for authotication
const Joi = require('joi');

// call express to json objects
app.use(express.json());


/* start orders end points 
Required is name and continent*/
const orders = [];


// Root of the API get endpoint 
app.get('/', (req, res) => {
    res.send('You have made no request.')
});

// shows all orders available
app.get('/orders', (req, res) => {
    res.send(orders);
});

// gets/looks up specific order among all and returns a 404 error if order not available
app.get('/orders/:id', (req, res) => {
    const order = orders.find(order => order.id === parseInt(req.params.id));
    if (order) {
        res.send(order)
    }else {
    res.status(404).send('No such food');
    };
});

// inserts a new order into the orders endpoint
app.post('/orders', (req, res) => {
    const {error} = validateOrder(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    const order = {
        id: orders.length + 1,
        name: req.body.name,
        continent: req.body.continent
    }
    orders.push(order);
    res.send(order);
});

// updates the the exisitng list of orders
app.put('/orders/:id', (req, res) => {
    const order = orders.find(order => order.id === parseInt(req.params.id));
    if (!order) {
        res.status(404).send('No such food');
        return;
    };
    const {error} = validateOrder(req.body);
    if(error) {
        res.status(400).send(error.details[0].message);
        return;
    };
    order.name = req.body.name;
    order.continent = req.body.continent;
    res.send(order);
});

// deletes or removes any specified order
app.delete('/orders/:id', (req, res) => {
    const order = orders.find(order => order.id === parseInt(req.params.id));
    if (!order) {
        res.status(404).send('Nothing to delete');
        return;
    };

    const index = orders.indexOf(order);
    orders.splice(index, 1);
    res.send(order);
});

// using Joi to validate in this function
function validateOrder(order) {
    const schema = {
        name: Joi.string().min(2).required(),
        continent: Joi.string().min(3).required()
    };
    return Joi.validate(order, schema);
};


// check on wrong input
app.all('*', (req, res) => {
    res.status(404).send({message: "Page not found"});
})


// port liatening at port 3000 asigned manually
app.listen(3000, (console.log("listening at port 3000!")));