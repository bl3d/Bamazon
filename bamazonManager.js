var inquirer = require('inquirer'),
	mysql = require('mysql');
	require('console.table');

var connection;	



var bamMan = {

	connection: null,

	init: function(){
		this.connectToDB();		
	},

	connectToDB: function(){
		connection = mysql.createConnection({
		  host: "127.0.0.1",
		  port: 3306, 
		  user: "gt", 
		  password: "123",
		  database: "Bamazon"
		});

		connection.connect(function(err) {
		  if (err) throw err;
		  console.log("connected as id " + connection.threadId);
		  bamMan.promptUser(); 	  
		});							
	},

	promptUser: function(){
		inquirer.prompt([{
			type: "list",
			message: "Hello Manager, what would you like to do?",
			choices: [
				"1) View Products for Sale",
				"2) View Low Inventory",
				"3) Add to Inventory",
				"4) Add New Product"
			],
			name: "action"
		}]).then(function(user) {

			//
			var choiceIndex = parseInt(user.action.split(')'));

			//
			switch (choiceIndex){

				case 1:
					bamMan.view_products();					
					break; 

				case 2:
					bamMan.view_lowInventory();				
					break; 

				case 3:
					bamMan.add_toInventory();				
					break; 

				case 4:
					bamMan.add_newProduct();				
					break;  
			};
		});		
	},

	view_products: function(){
	  var query = "SELECT * FROM products";
	  connection.query(query, function(err, res) {
	    console.table(res);
	    bamMan.promptUser(); 
	  });		
	},

	view_lowInventory: function(){
	  var query = "SELECT * from products where stock_quantity <= 5";
	  connection.query(query, function(err, res) {
	    console.table(res);
	    bamMan.promptUser(); 
	  });		
	},

	add_toInventory: function(){
		// bamMan.view_products();
		inquirer.prompt([{
			type: "input",
			message: "What product would you like to add inventory to (item_id)?",
			name: "id"
		}]).then(function(feedback) {
		    var query = "SELECT * FROM products WHERE ?";
		    connection.query(query, { item_id: feedback.id }, function(err, res) {
		      var thisId = feedback.id;
		      var curQuantity = res[0].stock_quantity; 
		      if (!err) {
		      	if (res.length > 0) {
					inquirer.prompt([{
						type: "input",
						message: "Enter a number for how many units you wish to add:",
						name: "quantity"
					}]).then(function(feedback) { 
						var newQuantity = (parseInt(curQuantity) + parseInt(feedback.quantity));
				        connection.query("UPDATE products SET ? WHERE ?", [{
				          stock_quantity: newQuantity
				        }, {
				          item_id: thisId
				        }], function(error) {
				          if (error) throw err;
				          console.log("Product Updated to " + newQuantity + " units!");
				          bamMan.promptUser();
				        });						
					});	    		
		      	} else {
		      		console.log('Sorry, that is not an item_id in the system, please try again.');
		      		bamMan.getProduct();
		      	}
		      } else {
		      	console.log('Sorry, there was an error processing your request.');
		      	process.exit();
		      }
		    });
		});			
	},

	add_newProduct: function(){
	  inquirer.prompt([{	    
	    type: "input",
	    message: "What is the product you wish to add?",
	    name: "name"
	  }, {
	    type: "input",
	    message: "What department is this product associated with?",
	    name: "dept"
	  }, {
	    type: "input",
	    message: "What is the retail cost of this item (per unit)?",
	    name: "price",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      console.log("\nThis needs to be a number...");
	      return false;
	    }
	  }, {
	    type: "input",
	    message: "How many of these items are being added into stock?",
	    name: "quantity",
	    validate: function(value) {
	      if (isNaN(value) === false) {
	        return true;
	      }
	      console.log("\nThis needs to be a number...");
	      return false;
	    }
	  }]).then(function(product) {
	    // when finished prompting, insert a new item into the db with that info
	    connection.query("INSERT INTO products SET ?", {
	      product_name: product.name,
	      department_name: product.dept,
	      price: product.price,
	      stock_quantity: product.quantity
	    }, function(err) {
	      if (err) throw err;
	      console.log("Your product '" + product.name + "' was added successfully!");
	      bamMan.promptUser();
	    });
	  });		
	}

}


bamMan.init();	