var multer = require("multer");
var upload = multer({dest: "./uploads"});
var fs = require("fs");


module.exports.registerService = function (app, db, gfs) {
    console.log('register Imageservice');

    app.post("/photos/track/:trackId", upload.single("recfile"), function (req, res, next) {
        var trackId = parseInt(req.params.trackId);
        //var trackId = parseInt(req.params.trackId, 10);
        //var trackId = parseInt(req.body.trackId, 10);
        var writestream = gfs.createWriteStream({
            filename: req.file.originalname,
            trackId: trackId
        });

        writestream.on('close', function (file) {
            gfs.files.update({
                '_id': file._id
            }, {
                '$set': {metadata: {trackId: trackId}}
            });
        });

        fs.createReadStream("./uploads/" + req.file.filename)
                .on("end", function () {
                    fs.unlink("./uploads/" + req.file.filename, function (err) {
                        res.send("success");
                    });
                })
                .on("err", function () {
                    res.send("Error uploading image");
                }).pipe(writestream);
    });


    app.get("/photos/:photoId", function (req, res) {
        var photoId = req.params.photoId;
        if (photoId === undefined) {
            res.status(404).send('Photo not found !');
            return;
        }
        var readstream = gfs.createReadStream({
            _id: photoId
        });
        readstream.on("error", function (err) {
            res.send("No image found with that title");
        });
        readstream.pipe(res);
    });


    app.delete("/photos/:photoId", function (req, res) {
        var photoId = req.params.photoId;
        if (photoId === undefined) {
            res.status(404).send('Photo not found !');
            return;
        }

        gfs.remove({_id: photoId}, function (err) {
            if (err) {
                res.status(404).send('Photo could not be deleted !');
                console.log(err);
                return false;
            }
            //console.log('file deleted', photoId);
            return true;
        });
        res.send('Photo deleted');
    });


    app.get("/photos/track/:trackId", function (req, res) {
        var trackId = parseInt(req.params.trackId, 10);
        gfs.files.find({metadata: {trackId: trackId}}).toArray(function (err, files) {
            if (err) {
                res.status(500).send('Problem searching photo !');
                return;
            }
            res.json(files);
        });
    });
};