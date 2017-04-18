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
		  database: 'Bamazon'
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
			message: "What would you like to do?",
			choices: [
				"1) Choice one",
				"2) Choice two"
			],
			name: "action"
		}]).then(function(user) {

			//
			var choiceIndex = parseInt(user.action.split(')'));

			//
			switch (choiceIndex){

				case 1:
					//					
					break; 

				case 2:
					//					
					break;  
			};

		});		

	}

}


bamMan.init();	