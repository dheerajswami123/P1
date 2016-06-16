var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.set('port', process.env.PORT || 8080);

app.use(express.static('public'));
app.use(bodyParser.json());
var conString = "postgres://updtqhqhdhovgz:IAR7ogoUs2UE91esdbzE3oKCud@ec2-54-225-215-233.compute-1.amazonaws.com:5432/da892qgbtnktaa";

app.post('/update', function(req, res) {
   
    pg.connect(conString, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'UPDATE Salesforce.Contact SET Phone = $1 WHERE LOWER(FirstName) = LOWER($2) AND LOWER(LastName) = LOWER($3) AND LOWER(Email) = LOWER($4)',
            [req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
            function(err, result) {
                if (err != null || result.rowCount == 0) {
                  conn.query('INSERT INTO salesforce.Contact (Phone, FirstName, LastName, Email) VALUES ($1, $3, $4, $5)',
                  [req.body.phone.trim(), req.body.firstName.trim(), req.body.lastName.trim(), req.body.email.trim()],
                  function(err, result) {
                    done();
                    if (err) {
                        res.status(400).json({error: err.message});
                    }
                    else {
                        // this will still cause jquery to display 'Record updated!'
                        // eventhough it was inserted
                        res.json(result);
                    }
                  });
                }
                else {
                    done();
                    res.json(result);
                }
            }
        );
    });
});
app.get('/contacts', function(req,res) {
   
    pg.connect(conString, function (err, conn, done) {
        // watch for any connect issues
        if (err) console.log(err);
        conn.query(
            'SELECT FirstName,LastName FROM Salesforce.Contact LIMIT 10',
            function(err, result) {
               
                    done();
                    res.json(result);
               
            }
        );
    });
});
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
