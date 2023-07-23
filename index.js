var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

//mongoose.connect('mongodb://0.0.0.0:27017/mydb', {
    mongoose.connect("mongodb+srv://sharuknabi6:h@istcluster.po8xcgu.mongodb.net/?retryWrites=true&w=majority") ;
    

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

// Email validation function using Regular Expression
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var comment = req.body.comments;

    // Check if email is valid
    if (!isValidEmail(email)) {
        return res.status(400).send("Invalid email format.");
    }

    db.collection('users').findOne({ email: email }, (err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            // If the email already exists, return an error response
            return res.status(409).send("Email already exists.");
        } else {
            const data = {
                "email": email,
                "name": name,
                "phno": phno,
                "comments": comment
            };

            db.collection('users').insertOne(data, (err, collection) => {
                if (err) {
                    throw err;
                }
                console.log("Record Inserted Successfully");
            });

            return res.redirect('signup_success.html');
        }
    });
});

app.get("/check_email", (req, res) => {
    const email = req.query.email;

    // Check if email is valid
    if (!isValidEmail(email)) {
        return res.status(400).json({ available: false, message: "Invalid email format." });
    }

    db.collection('users').findOne({ email: email }, (err, user) => {
        if (err) {
            throw err;
        }
        if (user) {
            // If the email already exists, return an error response
            return res.status(200).json({ available: false });
        } else {
            return res.status(200).json({ available: true });
        }
    });
}).listen(3000);

console.log("Listening on PORT 3000");
