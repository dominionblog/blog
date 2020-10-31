var mv = require('mv');
mv(__dirname + '/client/build', __dirname + '/server/build', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('done');
  if (err) throw err;
});