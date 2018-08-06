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
            name: 'supervisorOptions',
            message: 'Choose one of the following options: ',
            choices: ['View Product Sales by Department', 'Create New Department']
        }]).then(function (answer) {
            switch (answer.supervisorOptions) {
                case 'View Product Sales by Department':
                    {
                        salesByDepartment();
                        break;
                    }
                case 'Create New Department':
                    {
                        newDepartment();
                        break;
                    }
            }
        })
}

function salesByDepartment() {
    let query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sale) AS totalProductSales FROM departments INNER JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id ";
    connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(`========================================================================================`);
        console.log(`Department ID | Department Name       | Over Head Cost |  Product Sales | Total Profit |`);
        console.log(`========================================================================================`);
        for (var i = 0; i < results.length; i++) {
            console.log(`${results[i].department_id}               ${results[i].department_name}    ${results[i].over_head_costs}              ${results[i].totalProductSales}                ${results[i].totalProductSales-results[i].over_head_costs}`);
        }
        console.log(`========================================================================================`);
        start();
    });
}

function newDepartment() {
    inquirer
        .prompt([{
            type: "input",
            name: "departmentName",
            message: "Input the department name: "
        }, {
            type: "input",
            name: "overHeadCost",
            message: "Input Over Head Cost: "
        }])
        .then(function (answer) {
            let query = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)";
            connection.query(query, [answer.departmentName, answer.overHeadCost], function (err, res) {
                console.log("Successfully added " + answer.departmentName + " as a new department!!");
            });
            start();
        });
    }