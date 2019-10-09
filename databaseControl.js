var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({profile: 'nodejs-dev'});
AWS.config.credentials = credentials;

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

const docClient = new AWS.DynamoDB.DocumentClient();


async function writeToDatabase(params, res){
    console.log("Creating a new database entry.")

    docClient.put(params, function(err,data){
        if(err){
            res.status(409);
            console.log(err.message);
            console.log(err);
            return(res.json({"status":409,"message":"Account with conflicting details already exists."}));
        }
        else{
            return(res.json({"status":200, "message":"Account created"}));
        }
    });
}

async function readFromDatabase(params, res, req, callback){

    
    docClient.get(params, function(err, data) {
        if (err) {
            res.status(401);
            console.log(err.message);
            return(res.json({"status":401}));
        } else {
            console.log(data);
            if(data.Item == undefined){
                res.status(401);
                return(res.json({"status":401}));
            }
            var password = data.Item.password_hash;
            console.log(password);
            callback(data,res,req);
        }
    });
}



async function updateSessionID(sessionId, email){
    var params = {
        TableName:"testUsers",
        Key:{
            "email": email
        },
        UpdateExpression: "set sessions.activeSession = :s, sessions.loginTime = :t",
        ExpressionAttributeValues:{
            ":s":sessionId,
            ":t":Date.now()
        },
        ReturnValues:"UPDATED_NEW"
    };
    docClient.update(params, function(err, data) {
        if (err) {
            console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
    });
}
module.exports = {
    writeToDatabase,
    readFromDatabase,
    updateSessionID
}