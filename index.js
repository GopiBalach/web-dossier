var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://127.0.0.1:27017/Registration');
var db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/register", async (req, res) => {
    var name = req.body.name;
    var age = req.body.age;
    var email = req.body.email;
    var phno = req.body.phno;
    var gender = req.body.gender;
    var password = req.body.password;

    var data = {
        "name": name,
        "age": age,
        "email": email,
        "phno": phno,
        "gender": gender,
        "password": password
    };

    try {
        await db.collection('users').insertOne(data);
        console.log("Record Inserted Successfully");
        return res.redirect('/login.html');
    } catch (err) {
        console.error("Error inserting record:", err);
        return res.status(500).send("Error inserting record");
    }
});

// Route to get a todo by its uniqueNo
app.get("/getTodoById", async (req, res) => {
    const id = parseInt(req.query.id);

    if (!id) {
        return res.status(400).send("ID parameter is required");
    }

    try {
        const todo = await db.collection('todos').findOne({ uniqueNo: id });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.json({ todo });
    } catch (error) {
        console.error("Error fetching todo:", error);
        res.status(500).send("Error fetching todo");
    }
});

// Route to delete a todo from the database
app.post("/deleteTodo", async (req, res) => {
    const { todoId } = req.body;

    if (!todoId) {
        return res.status(400).send("Todo ID is required");
    }

    try {
        // Delete the todo from the collection
        const result = await db.collection('todos').deleteOne({ uniqueNo: todoId });

        if (result.deletedCount === 0) {
            return res.status(404).send("Todo not found");
        }

        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).send("Error deleting todo");
    }
});

app.get("/", (req, res) => {
    res.set({ "Allow-access-Allow-Origin": '*' });
    return res.redirect('login.html');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
