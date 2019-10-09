var bcrypt=require("bcrypt")

class userObject{
    constructor(email, password){
        this.email = email;
        this.password = password;
        this.created_at = String(Date.now());
        this.userid = this.email+this.created_at;
    }
    generate_params(table){
        var params = {
            TableName:table,
            Item:{
                "userid": this.userid,
                "group": "Unverified",
                "email": this.email,
                "password_hash": this.password,
                "created_at": this.created_at,
                "sessions":{}
            },
            "ConditionExpression": "attribute_not_exists(email)"
        };
        return(params);
    }
}

function checkPassword(password,hashed_password){
    var match = bcrypt.compareSync(password,hashed_password);
    return(match);
}

function createUser(email,password){
    var hashed_password = bcrypt.hashSync(password, 10, function(err,encrypted){
    })

    user = new userObject(email,hashed_password);
    return(user);
}

module.exports = {
    userObject,
    createUser,
    checkPassword
}