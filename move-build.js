/**
 * Move prduction build to
 * server directory.
 */
let mv = require('mv');
let empty = require('empty-folder')
const fs = require('fs');
let directory = fs.readdirSync(__dirname + "/server/build")
console.log(directory)

let moveFiles = () => {
  // Move the build file
  mv(__dirname + '/client/build', __dirname + '/server/build', function(err) {
    // done. it tried fs.rename first, and then falls back to
    // piping the source file to the dest file and then unlinking
    // the source file.
    console.log('done');
    if (err) throw err;
  });
}

if (directory.length > 0) {
  // Directory is not empty
  empty(__dirname + "/server/build", false, moveFiles);
} else {
  moveFiles();
}
