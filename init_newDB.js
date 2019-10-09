
var AWS = require("aws-sdk");

var credentials = new AWS.SharedIniFileCredentials({profile: 'nodejs-dev'});
AWS.config.credentials = credentials;

AWS.config.update({
  region: "us-east-1",
  endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "testUsers",
    KeySchema: [       
        { AttributeName: "email", KeyType: "HASH"}
    ],
    AttributeDefinitions: [       
        { AttributeName: "email", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 5, 
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error(" Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table.");
    }
});




