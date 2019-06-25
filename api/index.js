var express = require("express");
var app = express();
var cors = require("cors");
var faker = require("faker");
var bodyParser = require("body-parser");
var methodOverride = require('method-override');

//FIREBASE
var admin = require('firebase-admin');
var serviceAccount = require("./ebus-tic-firebase-adminsdk-05ov6-2.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ebus-tic.firebaseio.com"
});
var db = admin.database();
var transactions = db.ref("transactions");
var wallets = db.ref("wallets");
var auth = db.ref("auth");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//ROUTES
app.get('/', function(req, res) {
    res.redirect("https://webtech-kashann.c9users.io:8081/");
});

// app.get("/fake/:noEntries", function(req, res) {
//     var noEntries = req.params.noEntries;
//     for(var i = 0; i < noEntries; i++){
//         var randomHash = Math.random().toString(16).slice(2) + 
//             Math.random().toString(16).slice(2) + 
//             Math.random().toString(16).slice(2) + 
//             Math.random().toString(16).slice(2) +
//             Math.random().toString(16).slice(2);
//         var randomPrivateKey = Math.random().toString(16).slice(2) + 
//             Math.random().toString(16).slice(2) + 
//             Math.random().toString(16).slice(2) + 
//             Math.random().toString(16).slice(2) +
//             Math.random().toString(16).slice(2);
//         var d = new Date();
//         var randomDate = 0 - d.getTime();
//         var randomBtc = Math.floor(Math.random()*90000000)/100000000;
//         var randomSender = faker.fake("{{finance.bitcoinAddress}}");
//         var randomReciever = faker.fake("{{finance.bitcoinAddress}}");
//         var randomBytes = faker.fake("{{finance.mask}}").toString().slice(1, 4);
        
//         var newTransactionsEntry = transactions.push({
//           hash: randomHash,
//           timestamp: randomDate,
//           btc: randomBtc,
//           sender: randomSender,
//           reciever: randomReciever,
//           size: randomBytes
//         });
//         console.log(newTransactionsEntry);
        
//         var newWalletsEntry = wallets.push({
//           address: randomSender,
//           btc: randomBtc,
//           privateKey: randomPrivateKey.toUpperCase()
//         });
//         console.log(newWalletsEntry);
//     }
//     res.send("Am populat baza de date cu " + noEntries + " inregistrari!");
// });

app.post('/login', function(req, res){
    var data = req.body;
    console.log(data.address + " -> " + data.privateKey);
    var valid = false;
    wallets.orderByChild("address").equalTo(data.address).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var childData = childSnapshot.val();
            if(childData.privateKey === data.privateKey){
                var expires = new Date();
                expires.setMinutes(expires.getMinutes() + 10);
                expires = expires.getTime();
                var newAuth = auth.push({
                    address: data.address,
                    expires: expires
                });
                console.log(newAuth.key);
                valid = true;
                res.redirect('https://webtech-kashann.c9users.io:8081/wallets/' + data.address + newAuth.key);
            } else {
                res.send("Private Key is not correct!");
            }
        });
        if(!valid){
            res.send("The Address doesn't exist!");
        }
    });
});

app.get('/auth/:token', function(req, res) {
    var key = req.params.token;
    console.log("KEY:   " + key);
    auth.child(key).once('value').then(function(snapshot){
       var childData = snapshot.val();
       if (childData){
           var now = new Date();
           if(now.getTime() < childData.expires){
               res.send(JSON.stringify({ auth: 1, ago: 0 }));
           } else {
               var diff = now.getTime() - childData.expires;
               var ago = Math.ceil(diff/(1000*60));
               res.send(JSON.stringify({ auth: 0, ago: ago }));
           }
       } else {
           res.send(JSON.stringify({ auth: 0, ago: -1 }));
       }
    });
});

app.get("/transactions", function(req, res){
    var tx = [];
    transactions.orderByChild('timestamp').once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            tx.push(childSnapshot.val());
        });
        res.send(tx);
    });
});

app.post('/transactions', function(req, res){
    var randomHash = Math.random().toString(16).slice(2) + 
            Math.random().toString(16).slice(2) + 
            Math.random().toString(16).slice(2) + 
            Math.random().toString(16).slice(2) +
            Math.random().toString(16).slice(2);
    var randomBytes = faker.fake("{{finance.mask}}").toString().slice(1, 4);
    var d = new Date();
    var randomDate = 0 - d.getTime();
    transactions.push().set({
        btc: req.body.btc,
        confirmations: Math.random().toFixed(2)*100,
        hash: randomHash,
        reciever: req.body.reciever,
        sender: req.body.sender,
        size: randomBytes,
        timestamp: randomDate
    });
    wallets.orderByChild("address").equalTo(req.body.sender).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            var value = parseFloat(childData.btc) - parseFloat(req.body.btc);
            db.ref('wallets/' + key).update({
                btc: parseFloat(value).toFixed(8)
            });
        });
    })
    .then(wallets.orderByChild("address").equalTo(req.body.reciever).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            var value = parseFloat(childData.btc) + parseFloat(req.body.btc);
            db.ref('wallets/' + key).update({
                btc: parseFloat(value.toFixed(8))
            });
        });
        res.redirect(req.get('referer'));
    }));
});

app.put("/transactions/:txid", function(req, res) {
    console.log(req.body);
    transactions.orderByChild("hash").equalTo(req.params.txid).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            db.ref('transactions/' + key).update({
                hash: req.body.hash
            });
        });
    });
    res.redirect('https://webtech-kashann.c9users.io:8081/explorer/' + req.body.hash);
});

app.get("/explorer/:txid", function(req, res) {
    var txid = req.params.txid;
    var t = [];
    transactions.orderByChild("hash").equalTo(txid).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            t.push(childData);
        });
        res.send(t);
    });
});

app.get("/wallets", function(req, res) {
    var w = [];
    wallets.orderByChild("address").once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            w.push(childData);
        });
        res.send(w);
    });
});

app.post("/wallets", function(req, res) {
    wallets.push({
        address: req.body.address,
        btc: req.body.btc,
        privateKey : req.body.privateKey
    });
});

app.get("/wallets/:wid", function(req, res) {
    var wid = req.params.wid;
    var w = [];
    wallets.orderByChild("address").equalTo(wid).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            w.push(childData);
        });
        res.send(w);
    });
});

app.delete("/wallets/:wid", function(req, res) {
    var wid = req.params.wid;
    wallets.orderByChild("address").equalTo(wid).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            wallets.child(key).remove();
            res.redirect('https://webtech-kashann.c9users.io:8081/wallets/');
        });
    });
});

app.get("/wallets/:wid/transactions", function(req, res) {
    var wid = req.params.wid;
    var t = [];
    transactions.orderByChild("sender").equalTo(wid).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            t.push(childData);
        });
    })
    .then(transactions.orderByChild("reciever").equalTo(wid).once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            t.push(childData);
        });
        res.send(t);
    }));
});

app.get("/new", function(req, res) {
    var randomAddress = faker.fake("{{finance.bitcoinAddress}}");
    var randomPrivateKey = Math.random().toString(16).slice(2) + 
            Math.random().toString(16).slice(2) + 
            Math.random().toString(16).slice(2) + 
            Math.random().toString(16).slice(2) +
            Math.random().toString(16).slice(2);
    res.send(JSON.stringify({ address: randomAddress, privateKey: randomPrivateKey }));
});

app.listen(8080, function(){
	console.log("server started on 8080");
});