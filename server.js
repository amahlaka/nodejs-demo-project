var express = require('express');
var session = require('express-session')
var DynamoDBStore = require('connect-dynamodb')({session: session});;
var app = express();
var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
  });
var credentials = new AWS.SharedIniFileCredentials({profile: 'nodejs-dev'});
AWS.config.credentials = credentials;

var options = {

    table: 'test-sessions',
    region: 'us-east-1',
    client: new AWS.DynamoDB({ endpoint: new AWS.Endpoint('https://dynamodb.us-east-1.amazonaws.com')}),
    readCapacityUnits: 5,
    writeCapacityUnits: 5
};
app.use(express.json());
app.set('trust proxy', 1)
app.use(session({
  store: new DynamoDBStore(options),
  secret: 'KonoSubarashiiSekaiNiShukufukuo!', // This is here just for a example.
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

var Celebrate = require('celebrate');
var { Joi, joi } = Celebrate;


var database_control = require("./databaseControl.js");
var register_validator = require("./validation/register.js");
var login_validator = require("./validation/login.js");
var secret_validator = require("./validation/secret.js");
var userHandler = require("./userHandler.js");


app.post('/register',Celebrate.celebrate(register_validator), async function(req, res){
  handleRegistration(req,res).then(console.log("done"));
});

async function handleRegistration(req,res){
    var data = req.body;
    var user = userHandler.createUser(data.email,data.password)
    var params=user.generate_params("testUsers");
    await database_control.writeToDatabase(params,res);

}

app.post('/login',Celebrate.celebrate(login_validator), async function(req, res){
    await handleLogin(req,res);
});

async function handleLogin(req, res){
    var params = {
        TableName: "testUsers",
        Key:{
            "email": req.body.email
        }
    };
    await database_control.readFromDatabase(params,res,req,loginCallback);
}

async function loginCallback(data,res,req){
    password_match = userHandler.checkPassword(req.body.password,data.Item.password_hash);
    console.log(password_match);
    if(password_match){
        req.session.status = "SignedIn"
        req.session.email = data.Item.email
        res.json({"status":200,"email":data.Item.email,"created_at":data.Item.created_at})
        sessionid = req.session.id;
        database_control.updateSessionID(sessionid,data.Item.email);
    }
    else{
        res.json({"status":401});
    }
}

app.get('/logout',function(req,res){
    req.session.destroy()
    res.json({"status":200,"message":"Logged out!"})
})

app.post('/secret',Celebrate.celebrate(secret_validator),function(req,res){
session_id = req.session.id
email = req.session.email
console.log(session_id);
console.log(email);
})

app.get('/public',function(req,res){
    session_id = req.session.id
    email = req.session.email
    console.log(session_id);
    console.log(email);
    res.json({"data":email})
    })
    

app.get('/whoami',function(req, res){
    if (req.session.email != undefined){
        resp = "You are: " + req.session.email;
        res.json({"message":resp});
    }
    else{
        res.json({"message":"You are not logged it, i dont know who you are!"})
    }
})


app.use(Celebrate.errors());

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
})
