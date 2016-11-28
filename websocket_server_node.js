/****************************************************************************************************************
 *	Сервер для мгновенного обмена текстовыми сообщениями, пример работы на http://blog-vano.freecluster.eu  *
 *	Нужны библиотеки: npm install ws,                                                                       *
 *			  npm install static-node                                                               *
 *	Запуск сервера(в папке с .js исходником): 'node websocket_server_node.js'                               *
 *	Email: rzr707@gmail.com                                                                                 *
 ****************************************************************************************************************/

var WebSocketServer = require('ws').Server;

var clients    = {};
var clientId   = 0;

var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var serverIpAddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var websocketServer = new WebSocketServer( {
	port: serverPort
});

console.log('Websocket server nodeJS started on port ' + serverPort);
console.log('The IP of server is ' + serverIpAddress);

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
