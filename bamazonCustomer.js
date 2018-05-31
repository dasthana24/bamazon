var mysql = require("mysql");
var inquirer = require("inquirer");

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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});
var chosenProduct;
var chosenQuantity;
var chosenProductPrice;

function start() {
    connection.query(" SELECT * FROM products ", function (err, res) {
        if (err) throw err;
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
        }
        console.log("-----------------------------------");
        runSearch();
    });

}

function runSearch() {
    connection.query(" SELECT * FROM products ", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([{
                    type: "input",
                    name: "item",
                    message: "Please enter the ID of the product you would like to buy",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },

                {
                    type: "input",
                    name: "quantity",
                    message: "how many units of the product you like to buy",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },

            ])
            .then(function (answer) {


                console.log(res);
                for (var i = 0; i < res.length; i++) {
                    if (res[i].item_id === (parseInt(answer.item))) {


                        // set global variables as inventory table items
                        chosenProduct = res[i].product_name;
                        chosenProductQuantity = res[i].stock_quantity;
                        chosenProductPrice = res[i].price;
                        chosenProductSalesStart = res[i].product_sales;

                    }
                }

                console.log("Product ID: " + answer.item);
                console.log("Buy: " + chosenProduct);
                console.log("Quantity: " + chosenProductQuantity);
                console.log("***********************************");

             

                var newQuantity = (chosenProductQuantity - answer.quantity);
                var newSales = (parseInt(answer.quantity) * chosenProductPrice);
                var totalSales = (chosenProductSalesStart + newSales);

                if(newQuantity<0){
                    console.log("Insufficient Quantity\n");
                }
                else {

                    // New query to update quantity in inventory table
                    connection.query("UPDATE products SET ? WHERE ?",
                    [
                    {
                        product_sales: totalSales
                    },
                    {
                        product_name: chosenProduct
                    },
                
                    ], function (err, res) {
                  console.log("You have spent $" + (parseInt(answer.quantity) * parseInt(chosenProductPrice)));
            });
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
                    console.log("You have bought " + answer.quantity + " " + chosenProduct + "s.");

                    // Display new updated information on bought item
                    console.log("====================Completed Transaction====================");
                    console.log("Product ID: " + answer.quantity);
                    console.log("Product Name: " + chosenProduct);
                    console.log("Updated Stock: " + newQuantity + "\n");
                    shopMore();
                });
            }
        });
    });
}


// Function to give choice to user to buy more or end connection
function shopMore() {
    inquirer.prompt(
    {
        name: "continue",
        type: "list",
        message: "Keep shopping?",
        choices: ["Yes", "No"]
    }
    ).then(answers =>  {
        if (answers.continue === "Yes") {
            start();
      
        } else {
        console.log("Thank you for shopping on bamazon")
        connection.end();
        }
    });
}