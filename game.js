let game_data;
	
let current_room = 0;
	
let items_picked = [];
	
			let command = [];
			
			
			function terminalOut (info) {
				let terminal = document.getElementById("terminal");
				
				terminal.innerHTML += info;
				terminal.scrollTop = terminal.scrollHeight;
			}
			
			function findDoorNumber (door) {
				let doors_num = game_data.doors.length;
				
				for (let i = 0; i < doors_num; i++) {
					if (game_data.doors[i].id == door) {
						return i;
					}
				}
				return -1;
			}
			
			function findRoomNumber (room) {
				let rooms_num = game_data.rooms.length;
				
				for (let i = 0; i < rooms_num; i++) {
					if (game_data.rooms[i].id == room) {
						return i;
					}
				}
				
				return -1;
			}
			
			function findItemNumber (item) {
				let items_num = game_data.items.length;
				
				for (let i = 0; i < items_num; i++) {
					if (game_data.items[i].id == item) {
						return i;
					}
				}
				
				return -1;
			}
			
			function executeCommand () {
				command = document.getElementById("commands").value.trim().split(" ");
				document.getElementById("commands").value = "";
				console.log(command);
				
				if (command.length == 0 || command == "") {
					terminalOut("<p><strong>ERROR:</strong> Escribe una instrucción</p>");
					return;
				}
				
				if (command.length == 1) {
					parseCommand(command[0]);
				}
				else {
					parseInstruction(command);
				}
			}
			
			function parseCommand (command) {
				switch (command) {
					
					case 'ver':
						terminalOut("<p>" + game_data.rooms[current_room].description + "</p>");
						break;
						
					case 'ir':
						
						let doors = "";
						let doors_num = game_data.rooms[current_room].doors.length;
						
						for (let i = 0; i < doors_num; i++) {
							doors += game_data.rooms[current_room].doors[i] + " ";
						}
						
						terminalOut("<p>Puedes ir a: " + doors + "</p>");
						
						break;
						
					case 'coger':
						
						let items = "";
						let items_num = game_data.rooms[current_room].items.length;
						
						for (let i = 0; i < items_num; i++) {
							items += game_data.rooms[current_room].items[i] + " ";
						}
					
						terminalOut("<p>Los items en la sala son: " + items + "</p>");
						break;
						
					default:
						terminalOut("<p><strong>ERROR:</strong> Comando <strong>" + command + "</strong> no encontrado</p>");
				}
			}
			
			function parseInstruction (instruction ) {
				switch (instruction[0]) {
					
					case 'ver':
					
						let item_number = findItemNumber(instruction[1]);
						
						if (item_number < 0) {
							console.log("Item errónea");
							return;
						}
						
						let item_description = game_data.items[item_number].description;
						
						terminalOut("<p><strong>" + instruction[1] + ":</strong> " + item_description + "</p>");
						
						break;
						
					case 'ir':
						
						let door_number = findDoorNumber(instruction[1]);
						
						if (door_number < 0) {
							console.log("Puerta errónea");
							return;
						}
						
						let room_number = findRoomNumber(game_data.doors[door_number].rooms[0]);
						let next_room_name = "";
						
						if (room_number == current_room) {
							current_room = findRoomNumber(game_data.doors[door_number].rooms[1]);
						}
						else {
							current_room = room_number;
						}
						
						next_room_name = game_data.rooms[current_room].name
						
						terminalOut("<p>Cambiando de habitación a " + next_room_name + "</p>");
						
						break;
						
					case 'coger':
					
						let item_pick = instruction[1];
						let item_num = findItemNumber(instruction[1]);
						
						if (item_num < 0) {
							console.log("Item erróneo");
							return;
						}
						
						if (game_data.items[item_num].pickable == false) {
							terminalOut("<p>El objeto<strong> " + item_pick + "</strong> no puede ser cogido</p>");
							return;
						}
						
						items_picked.push(game_data.items[item_num].id);
						
						
						let room_items = game_data.rooms[current_room].items.length;
						let item_remove = 0;
						
						for (let i = 0; i < rooms_items; i++) {
							if (game_data.rooms[current_room].items[i].id == item_pick) {
								item_remove = i;
								break;
							}
						}
						game_data.rooms[current_room].items.splice(item_remove, 1);
						
						terminalOut("<p>El objeto<strong> " + instruction[1] + "</strong> ha sido añadido a tu inventario</p>");
					
						break;
						
					default:
						terminalOut("<p><strong>ERROR:</strong> Comando <strong>" + instruction[0] + "</strong> no encontrado</p>");
				}
			}
		
			function game (data) {
				game_data = data;
				
				terminalOut("<p><strong>¡Benvenido a ENTIerrame!</strong> El juego de terror definitivo.</p>");
				terminalOut("<p>Te encuentras en " + data.rooms[current_room].name + ". ¿Qué quieres hacer?</p>");
			}
			
			fetch("https://denn853.github.io/game.json")
					.then(response => response.json())
					.then(data => game(data));
					