const WebSocket = require('ws');
var fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
const http = require('http');
var history = require('connect-history-api-fallback');
const router = express.Router({ strict: true })

const staticFileMiddleware = express.static('kisst-app/dist/');
const server = http.createServer(app);

app.use(router)
app.use(staticFileMiddleware);
app.use(history())
app.use(staticFileMiddleware);

server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

const dbFile = 'database.json';

var inventory = {
    database: {
        default: {
            maxId: 0,
            data: []
        }
    }
}

var inventoryChanges = false;

function initFS() {
    try {
        let readDB = fs.readFileSync(dbFile);
        let data = JSON.parse(readDB);

        inventory = Object.assign({}, data);
    }
    catch {
        fs.writeFileSync(dbFile, JSON.stringify(inventory));
        console.log('Writing', JSON.stringify(inventory));
    }
    finally {
        periodicFileSync();
    }
}
initFS();

function periodicFileSync() {
    if (inventoryChanges) {
        console.log('Writing to db...');
        fs.writeFileSync(dbFile, JSON.stringify(inventory));
        inventoryChanges = false;
        console.log('Done');
    }

    setTimeout(periodicFileSync, 1000);
}

const wss = new WebSocket.Server({
    //port: 3001
    server
});

var clients = [];

wss.on('connection', function connection(ws) {
    clients.push(ws);

    ws.on('message', function trigger(message) {
        let data = JSON.parse(message);
        if (data.db == undefined) data.db = 'default';

        console.log('[ws client] new data:', data);

        if (inventory.database[data.db] == undefined) {
            console.log('Creating new database:', data.db)
            inventory.database[data.db] = {
                maxId: 0,
                data: []
            }
        }

        switch (data.action) {
            case 'ADD':
                let d = {
                    id: (inventory.database[data.db].maxId++),
                    location: data.data.location,
                    barcode: data.data.barcode,
                    qty: data.data.qty
                };

                console.log('Adding:', d);
                inventory.database[data.db].data.push(d);
                inventoryChanges = true;
                break;
            case 'REMOVE':
                console.log('Removing id:', data.data.id);
                inventory.database[data.db].data.splice(inventory.database[data.db].data.indexOf(inventory.database[data.db].data.filter(o => o.id === data.data.id)[0]), 1);
                inventoryChanges = true;
                break;
            case 'EDIT':
                console.log('Editing row:', data.data.id, data.data);
                console.log()
                inventory.database[data.db].data[inventory.database[data.db].data.findIndex(o => o.id === data.data.id)] = data.data;
                console.log('now', inventory.database[data.db].data.filter(o => o.id === data.data.id)[0])
                inventoryChanges = true;
                break;
            case 'REFRESH':
                break;
            default:
                console.log('Could not interpret:', data);
                break;
        }

        broadcastInventory();
    });

    ws.on('close', (event) => {
        console.log('goodbye someone');

        clients.splice(clients.indexOf(ws), 1);
        console.log('Clients connected:', clients.length)
    })

    console.log('Clients connected:', clients.length)
    sendInventory(ws);
})

function broadcastInventory() {
    for (client of clients) {
        sendInventory(client);
    }
}

function sendInventory(client) {
    client.send(JSON.stringify({
        type: 'inventory',
        database: inventory.database
    }));
}