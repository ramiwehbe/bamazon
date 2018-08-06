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
    inquirer
        .prompt([{
            type: 'list',
            name: 'managerOptions',
            message: 'Choose from the following options:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }]).then(function (answer) {
            switch (answer.managerOptions) {
                case 'View Products for Sale':
                    {
                        displayInventory();
                        break;
                    }
                case 'View Low Inventory':
                    {
                        filterLowInventory();
                        break;
                    }
                case 'Add to Inventory':
                    {
                        addInventory();
                        break;
                    }

                case 'Add New Product':
                    {
                        addProduct();
                        break;
                    }
            };
        })
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
        start();
    });
    
}

function filterLowInventory() {
    connection.query("SELECT * FROM products where stock_quantity <= 100", function (err, results) {
        if (err) throw err;
        console.log(`=======================================================================================`);
        console.log(`Item ID |  Low Inventory     |      Department               |  Price    |    Quantity |`);
        console.log(`=======================================================================================`);
        for (var i = 0; i < results.length; i++) {
            console.log(`${results[i].item_id}          ${results[i].product_name}        ${results[i].department_name}        ${results[i].price}           ${results[i].stock_quantity}`);
        }
        console.log(`=======================================================================================`);
        start();
    })
}

function addInventory() {
    inquirer
        .prompt([{
            type: "input",
            name: "itemToAdd",
            message: "Input the Item's ID you want to add to: "
        }, {
            type: "input",
            name: "quantityToAdd",
            message: "How many items do you like to add: "
        }])
        .then(function (answer) {
            var query = "SELECT stock_quantity, item_id from products where ?";
            connection.query(query, {
                item_id: answer.itemToAdd
            }, function (err, results) {
                let queryInternal = "UPDATE products SET ? where ?";
                connection.query(queryInternal, [{
                    stock_quantity: parseInt(results[0].stock_quantity + parseInt(answer.quantityToAdd))
                }, {
                    item_id: answer.itemToAdd
                }], function (err, res) {});

            })
            var resQuery = "SELECT stock_quantity, item_id, product_name from products where ?";
            connection.query(resQuery, {
                item_id: answer.itemToAdd
            }, function (err, res) {
                console.log(res[0].stock_quantity + " " + res[0].product_name + " are currently available");
                console.log("You have successfully added " + answer.quantityToAdd + " items")
            })
            start();
        });
        
}

function addProduct() {
    inquirer
        .prompt([{
            type: "input",
            name: "productName",
            message: "Input the product name: "
        }, {
            type: "input",
            name: "deptName",
            message: "Input Department Name: "
        }, {
            type: "input",
            name: "unitPrice",
            message: "Input unit price: "
        }, {
            type: "input",
            name: "quantity",
            message: "How many items do you want to add: "
        }])
        .then(function (answer) {
            let query = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)";
            connection.query(query, [answer.productName, answer.deptName, answer.unitPrice, answer.quantity], function (err, res) {
                console.log("Successfully added " + answer.productName + " as a new product!!");
            });
            start();
        })
}