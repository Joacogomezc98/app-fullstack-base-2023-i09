// IMPORTS
const express = require('express');
const cors = require("cors");
const db = require('./mysql-connector')
const config = require("./config.js");


// VARIABLES
const app = express();
const corsOptions = { origin: "*", optionSucessStatus: 200 };

//Set CORS config
app.use(cors(corsOptions));
// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

// ======================================== MIDDLEWARES ========================================

//Validate device fields
const validateDeviceFields = (req, res, next) => {
    const device = req.body;

    if (!device || !device.name || !device.description || !device.state || !device.type) {
        res.status(400).send("Incomplete device information. All fields are required.");
    } else {
        next(); // Continue to the next middleware or route handler
    }
};


//=======[ Main module code ]==================================================

//GET ALL DEVICES
app.get('/devices', (req, res) => {
    db.query(`SELECT * from Devices`, (err, rsp) => {
        if (err === null) {
            res.status(200).send(JSON.stringify(rsp));
        } else {
            console.log("err", err);
            res.status(404).send(err);
        }
    });
});

//GET DEVICES BY ID
app.get("/devices/:id/", (req, res) => {
    db.query(`SELECT * from Devices WHERE id=${req.params.id}`, (err, rsp) => {
        if (err === null) {
            res.status(200).send(JSON.stringify(rsp));
        } else {
            console.log("err", err);
            res.status(404).send(err);
        }
    });
});

// POST NEW DEVICE
app.post("/device", validateDeviceFields, (req, res) => {
    const newDevice = req.body;

    const sql = `INSERT INTO Devices (name, description, state, type) VALUES ('${newDevice.name}', '${newDevice.description}', ${newDevice.state}, ${newDevice.type})`;

    db.query(sql, (err, result) => {
        if (err === null && result.affectedRows > 0) {
            res.status(200).send("Device added successfully");
        } else {
            console.log("err", err);
            res.status(409).send("Failed to add device");
        }
    });

});

// EDIT DEVICE
app.put("/device/:id", validateDeviceFields, (req, res) => {
    const deviceId = req.params.id;
    const updatedDevice = req.body;

    if (!deviceId) {
        return res.status(400).send('Missing device ID')
    }

    const sql = `UPDATE Devices SET 
                     name='${updatedDevice.name}', 
                     description='${updatedDevice.description}', 
                     state=${updatedDevice.state}, 
                     type=${updatedDevice.type} 
                     WHERE id=${deviceId}`;

    db.query(sql, (err, result) => {
        if (err === null && result.affectedRows > 0) {
            res.status(200).send("Device updated successfully");
        } else {
            console.log("err", err);
            res.status(409).send("Failed to update device");
        }
    });

});

// DELETE DEVICE
app.delete("/device/:id", (req, res) => {
    const deviceId = req.params.id;

    if (!deviceId) {
        return res.status(400).send('Missing device ID')
    }

    db.query(`DELETE FROM Devices WHERE id=${deviceId}`, (err, result) => {
        if (err === null && result.affectedRows > 0) {
            res.status(200).send("Device deleted successfully");
        } else {
            console.log("err", err);
            res.status(409).send("Failed to delete device");
        }
    });
});

app.listen(config.BACKEND_PORT, () => {
    console.log(`NodeJS API running correctly on port: ${config.BACKEND_PORT}`);
});
