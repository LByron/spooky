

isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
isDataImageURL.regex= /data:image\/([a-zA-Z]*);base64,([^\"]*)/i;
function isDataURL(s) {
    return !!s.match(isDataURL.regex);
}

function isDataImageURL(s) {
    return !!s.match(isDataImageURL.regex);
}




module.exports = {isDataURL: isDataURL, isDataImageURL: isDataImageURL};