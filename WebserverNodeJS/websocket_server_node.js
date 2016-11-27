/*
	Нужны библиотеки: npm install ws
					  npm install static-node
	Запуск сервера(в папке с .js исходником): node websocket_server_node.js PORT
	Например, 
	node websocket_server_node.js 1088
*/

var WebSocketServer = require('ws').Server;

var clients    = {};
var clientId   = 0;
const serverPort = process.argv[2] !== undefined ?			  
((parseInt(process.argv[2], 10) > 0  && parseInt(process.argv[2], 10) < 10000) ? process.argv[2] : 1088)
												 : 1088;

process.argv.forEach(function(val, index, array) {
	console.log(index + ': ' + val);
});

var websocketServer = new WebSocketServer( {
	port: serverPort
});

console.log('Websocket server nodeJS started on port ' + serverPort);

websocketServer.on('connection', function(ws) {
	var id = clientId++;
	clients[id] = ws;
	console.log('New income connection: ' + (id + 1));
	
	ws.on('message', function(msg) {
		console.log('Message recieved: ' + msg);
		
		for(var key in clients) {
			if(msg === 'MESSAGE_SENT') {
				clients[key].send('REFRESH_CHAT');
			} else if(key != id){
				clients[key].send(msg);
			}
		}
	});
	
	ws.on('close', function() {
		console.log('Connection closed ' + id);
		delete clients[id];
	});
});
