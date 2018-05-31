var inquirer = require('inquirer');
var mysql = require("mysql");

// Connection to local db
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_DB"
});


// Initial connection
connection.connect(function(err, res) {
    if (err) throw err;
    console.log("You are connected to Bamazon_DB\n");
    console.log("You are in Manager mode");
    nexusBuildsProbes();
});

// Manager controller menu
function nexusBuildsProbes() {
    inquirer.prompt([
        {
        name: "inventory",
        type: "list",
        message: "Select an options:",
        choices: ["Current Stock", "Low Inventory Products", "Add To Inventory", "Add New Product", "Exit"]
        }
    ]).then(answers => {
        switch(answers.inventory) {
            case "Current Stock":
            readInventory();
            break;

            case "Low Inventory Products":
            needMorePylons();
            break;

            case "Add To Inventory":
            buildingMorePylons();
            break;
            
            case "Add New Product":
            buildCyberneticsCore();
            break;

            case "Exit":
            abortMission();
            break;
        }
    });
}

// Make function that shows user all inventory
function readInventory() {
    connection.query(" SELECT * FROM products ", function(err, res) {
        if (err) throw err;

        console.log("====================Processing====================");
        console.log("====================Completed=====================");
        // For loop to display all current products id, name, price, and quantity
        for (var i = 0; i < res.length; i++) {
        console.log("Product ID : " + res[i].item_id +
                     " || Product: " + res[i].product_name + 
                    " || Price: $" + res[i].price + 
                    " || Stock: " + res[i].stock_quantity + 
                    " || Product Sales: $" + res[i].product_sales + 
                   "\n");
        }
        nexusBuildsProbes()
    });
}

// functino for checking items that have low inventory
function needMorePylons() {
    connection.query(" SELECT * FROM products WHERE stock_quantity ", function(err, res) {
        if (err) throw err;

        console.log("====================Processing====================");
        console.log("====================Completed=====================");

        // Making new variable outside of forloop, if no items are stated in the loop, then var will remain undefined
        var sufficientProducts;

        // For loop to check if product quantity is below a threshold (10)
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity <= 10 ) {
                sufficientProducts = res[i].product_name;

                // Display to manager which items match the criteria above
                console.log("\n Products with low stock \n")
                console.log("Name: " + res[i].product_name + " || Stock: " + res[i].stock_quantity + "\n");
            }
        }

        
        if (sufficientProducts === undefined) {
            console.log("\nAll Products have sufficient inventory\n")
        }
        nexusBuildsProbes()
    });
}

// Run the inquire for Manager
function buildingMorePylons() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

    // Ask for Manager input
    inquirer.prompt([
        {
            // Manager picks ID from inventory table
        name: "name",
        type: "input",
        message: "To add to inventory, enter product ID"
        },
        {
            // Manager picks how many of that item they want to modify
        name: "quantity",
        type: "input",
        message: "How many desired?"
        }
    ]).then(answers => {

        // Change answer in to an integer, then match it to the inventory table's id
        for (var i = 0; i < res.length; i++) {
            if (parseInt(answers.name) ===  res[i].item_id) {

                // set global variables as inventory table items
                chosenProduct = res[i].product_name;
                chosenProductQuantity = res[i].stock_quantity;
            }
        }

        // Display what manager chose to modify
        console.log("Product ID: " + answers.name);
        console.log("Product Name: " + chosenProduct);
        console.log("Current Stock: " + chosenProductQuantity);
        console.log("====================Processing====================");
        
        // Changing inventory stock of item chosen to add desired quantity
        var newQuantity = (chosenProductQuantity + parseInt(answers.quantity));
        
        // If manager wants to buy more than the current stock
        if (newQuantity < 0) {
            console.log("\nYou cannot modify the stock to be negative, so you must not be a real manager!\n");
            connection.end();
        } else {

            // New query to update quantity in inventory table
            connection.query("UPDATE products SET ? WHERE ?",
            [
            {
                stock_quantity: newQuantity
            },
            {
                product_name: chosenProduct
            }
            ], function (err, res) {
                console.log("\nYou have added " + answers.quantity + " " + chosenProduct + "s to the product inventory.\n")

                // Display new updated information on modified item
                console.log("====================Completed====================");
                console.log("Product ID: " + answers.name);
                console.log("Product Name: " + chosenProduct);
                console.log("Updated Stock: " + newQuantity + "\n");
                nexusBuildsProbes()
            });
        }
    });
    });
}

// Function that adds new item to the bamazondb
function buildCyberneticsCore() {
    inquirer.prompt([
        {
            name: "productName",
            type: "input",
            message: "Name of product?"
        },
        {
            name: "dept",
            type: "list",
            message: "What department does this product belong to?",
            choices: ["Toys", "Clothing", "Electronics", "Essentials"]
        },
        {
            name: "price",
            type: "input",
            message: "Price of product?"
        },
        {
            name: "quantityAdd",
            type: "input",
            message: "Quantity to add?"
        }
    ]).then(answers => {
        connection.query("INSERT INTO products SET ?", 
            {
                // Adding a new row with information gained from inquirer
                product_name: answers.productName,
                department_name : answers.dept,
              price: parseInt(answers.price),
                stock_quantity: parseInt(answers.quantityAdd),
                product_sales: parseInt(0)
            },
        function(err, res) {
            if (err) throw err

            // Display information to manager confirming new addition
            console.log("====================Processing====================\n");
            console.log(res.affectedRows + " added to inventory\n");
            console.log("====================Completed====================\n");
            console.log("New Product Information:");
            console.log("Product Name: " + answers.productName);
            console.log("Product Price: " + answers.price);
            console.log("Product Stock: " + answers.quantityAdd + "\n");
            nexusBuildsProbes()
        });
    });
}

// Function that ends connection
function abortMission() {
    console.log("Exiting Manager Mode");
    connection.end();
}