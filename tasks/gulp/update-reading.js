var through = require("through2");
var Vinyl = require("vinyl");
var frontMatter = require("front-matter");
var unirest = require("unirest");
var moment = require("moment");

module.exports = function() {
  return through.obj(transform);
};

var transformer;
var pipeline;

/**
 * @param {Vinyl}    file
 * @param {Buffer}   file.contents
 * @param {string}   encoding
 * @param {function} callback
 */
function transform(file, encoding, callback) {
    transformer = this;
    pipeline = callback;

    updateReadingFile(file);
}

/**
 * @param {Vinyl} file
 */
function continuePipe(file) {
    transformer.push(file);
    pipeline();
}

/**
 * @param {Vinyl} file
 * @param {Buffer} file.contents
 *
 * @returns {object}
 */
function updateReadingFile(file) {
    var reading = frontMatter(file.contents.toString());
    var front = reading.attributes;

    if (front["updated_at"]) {
        return continuePipe(file);
    }

    if (front["isbn13"]) {
        console.log(front["title"] + " (" + front["isbn13"] + ")");
        return updateByIsbn(file);
    }

    console.log(front["title"]);
    return updateBySearch(file);
}

/**
 * @param {Vinyl}  file
 * @param {Buffer} file.contents
 */
function updateByIsbn(file) {
    var reading = frontMatter(file.contents.toString());
    var front = reading.attributes;
    unirest.get("http://isbndb.com/api/v2/json/R0H8FPS6/book/" + front["isbn13"])
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send()
        .end(function (res) {
            if (typeof res.body === "undefined") {
                return continuePipe(file);
            }
            var json = JSON.parse(res.body.toString());
            if (typeof json.data === "undefined"
                || typeof json.data[0] === "undefined") {
                return continuePipe(file);
            }
            var isbnDbData = json.data[0];

            front = addIsbnDbData(front, isbnDbData);
            file.contents = new Buffer(
                frontToString(front) + reading.body.toString()
            );

            return continuePipe(file);
        });
}

/**
 * @param {Vinyl}  file
 * @param {Buffer} file.contents
 */
function updateBySearch(file) {
    var reading = frontMatter(file.contents.toString());
    var front = reading.attributes;
    var query = {q: front.title.split(" ").join("+")};
    if (typeof front["author_name"] !== "undefined") {
        query.i = "combined";
        query.q += "+" + front.author_name.split(" ").join("+");
    }
    unirest.get("http://isbndb.com/api/v2/json/R0H8FPS6/books")
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .query(query)
        .send()
        .end(function (res) {
            if (typeof res.body === "undefined") {
                return continuePipe(file);
            }
            var isbnDbData = JSON.parse(res.body.toString()).data[0];

            front = addIsbnDbData(front, isbnDbData);
            file.contents = new Buffer(
                frontToString(front) + reading.body.toString()
            );

            return continuePipe(file);
        });
}

/**
 * @param {object} front
 * @param {object} isbnDbData
 */
function addIsbnDbData(front, isbnDbData) {
    for (var key in isbnDbData) {
        if (!isbnDbData.hasOwnProperty(key)
            || front.hasOwnProperty(key)
            || !isbnDbData[key]
            || typeof isbnDbData[key] === 'object'
        ) {
            continue;
        }

        front[key] = isbnDbData[key];

        if (typeof front["author_name"] === "undefined"
            && typeof isbnDbData["author_data"] !== "undefined"
            && typeof isbnDbData["author_data"][0] !== "undefined"
            && typeof isbnDbData["author_data"][0]["name"] !== "undefined"
        ) {
            front["author_name"] = isbnDbData["author_data"][0]["name"];
        }
    }

    front["date"] = moment(front["date"]).format("YYYY-MM-DD");
    front["updated_at"] = moment().format("YYYY-MM-DD");

    return front;
}

/**
 * @param {object} front
 *
 * @returns {string}
 */
function frontToString(front) {
    var stringFront = "---\n";
    for (var key in front) {
        if (!front.hasOwnProperty(key)) {
            continue;
        }
        if (typeof front[key].replace === "function") {
            front[key] = front[key].replace(/["~]/gi, "");
        }
        stringFront += key + ": \"" + front[key] + "\"\n";
    }
    stringFront += "---\n\n";

    return stringFront;
}
