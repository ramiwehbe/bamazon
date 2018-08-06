var inquirer = require("inquirer");

let mysql = require("mysql")
let subtotal = 0;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Freshstart100!",
    database: "bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    displayInventory();
}

function displayInventory() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log(`=======================================================================================`);
        console.log(`Item ID |  Product Name      |      Department               |  Price    |    Quantity |`);
        console.log(`=======================================================================================`);
        for (var i = 0; i < results.length; i++) {
            console.log(`${results[i].item_id}          ${results[i].product_name}        ${results[i].department_name}        ${results[i].price}           ${results[i].stock_quantity}`);
        }
        console.log(`=======================================================================================`);
        purchaseDecision();
    });
}
function purchaseDecision() {
    inquirer
        .prompt([{
            type: 'list',
            name: 'purchaseDecision',
            message: 'What do you want to do?',
            choices: ['Purchase Items', 'Proceed to CheckOut']
        }
        ]).then(function (answer) {
            switch (answer.purchaseDecision) {
                case 'Purchase Items': 
                    purchaseOrder();
                    break;
                case 'Proceed to CheckOut': 
                    console.log("Thank you for visting our website !!");
                    console.log("====================================");
                    console.log('+  Your total balance is: ' + subtotal);
                    console.log("====================================");
                    break;            
            };
        })
}
function purchaseOrder() {
    inquirer
        .prompt([
            {
                name: "product_ID",
                type: "input",
                message: "Please type in the product ID you want to purchase: "
            }, {
                name: "quantity",
                type: "input",
                message: "How many items are you interested in buying today: "
            }])
        .then(function (answer) {
            var query = "SELECT stock_quantity, price, product_sale from products where ?";
            connection.query(query, { item_id: answer.product_ID }, function (err, results) {
                if (results[0].stock_quantity > answer.quantity) {
                    updateTable(results[0].stock_quantity, results[0].price, results[0].product_sale);
                    console.log("====================================");
                    console.log('+  Your current total is: ' + calculateSubtotal(answer.quantity, results[0].price));
                    console.log("====================================");
                    displayInventory();
                }
                else {
                    console.log("Insufficient Quantity in Stock !!");
                    purchaseOrder();
                }
                function updateTable(stock_quantity, price, product_sale) {
                    var queryInternal = "UPDATE products SET ? , ? where ?";
                    connection.query(queryInternal, [
                        { stock_quantity: parseInt(stock_quantity - answer.quantity) },
                        { product_sale: parseInt(parseInt(product_sale) + parseInt(answer.quantity * price))}, 
                        { item_id: answer.product_ID }
                    ], function (err, res) {
                    })
                }
                function calculateSubtotal(quantity, price) {
                    subtotal += parseFloat(quantity * price);
                    return subtotal;
                }
            });
        })
}