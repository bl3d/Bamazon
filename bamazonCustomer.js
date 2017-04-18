var inquirer = require('inquirer'),
	mysql = require('mysql');
	require('console.table');

var connection;	



var bamCust = {

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
		  bamCust.displayProducts();		  	 
		});	
	},

	displayProducts: function(){
	  var query = "SELECT * FROM products";
	  connection.query(query, function(err, res) {
	    console.table(res);
	    bamCust.getProduct(); 
	  });		
	},

	getProduct: function(){
		inquirer.prompt([{
			type: "input",
			message: "What product would you like to order (item_id)?",
			name: "id"
		}]).then(function(feedback) {
		    var query = "SELECT * FROM products WHERE ?";
		    connection.query(query, { item_id: feedback.id }, function(err, res) {
		      if (!err) {
		      	if (res.length > 0) {
					bamCust.getQuantity(feedback.id);      		
		      	} else {
		      		console.log('Sorry, that is not an item_id in the system, please try again.');
		      		bamCust.getProduct();
		      	}
		      } else {
		      	console.log('Sorry, there was an error processing your request.');
		      	process.exit();
		      }
		    });
		});		
	},

	getQuantity: function(id){
		inquirer.prompt([{
			type: "input",
			message: "How many units do you want to buy?",
			name: "quantity"
		}]).then(function(feedback) {
		    var query = "SELECT stock_quantity FROM products WHERE ?";
		    connection.query(query, { item_id: id }, function(err, res) {
		    	var availStock = res[0].stock_quantity;
		    	if (availStock <= 0) {
		    		console.log('Sorry, this item is currently on backorder, please select another product.');
		    		bamCust.getProduct();
		    	} else if (availStock > feedback.quantity) {
		      	    bamCust.orderProduct(id, feedback.quantity, availStock);
		        } else {
		      	    console.log('Insufficient quantity!');
		      	    bamCust.getQuantity();
		        }
		    });				
		});		
	},

	orderProduct: function(id, quantity, availStock){
	    connection.query("UPDATE products set ? where ?", [{
          stock_quantity: (availStock - quantity)
        }, {
          item_id: id
        }], function(err) {
          if (err) {
          	  console.log(err);
          } else {
	          console.log("Congrats! You are now the proud owner of " + quantity + " items!");
	          bamCust.displayProducts();          	
          }
        });
	}

}


bamCust.init();	