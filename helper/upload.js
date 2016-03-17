var thunkify = require ("thunkify");

var write = function(gfs, gfsOpt, part, cb) {
  var writeStream = gfs.createWriteStream(gfsOpt);
  writeStream.on ("error", cb);
  writeStream.on ("close", function (file){
    cb (null, file);
  });
  part.pipe (writeStream);
}

function upload (gfs, gfsOpt, part, cb) {
  if (!gfsOpt.replace) {
    return write(gfs, gfsOpt, part, function(){
      cb();
    })
  }
  delete(gfsOpt.replace);
  gfs.remove({filename:part.filename}, function(err) {
    if (err) {
      return cb(err);
    } 
    write(gfs, gfsOpt, part, function(){
      cb();
    })
  })
}

module.exports = thunkify(upload);
