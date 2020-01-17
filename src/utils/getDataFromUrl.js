const getDataFromUrl = (href) => {
    href = decodeURIComponent(href)
    let authData = ((href) => {
        var hash;
        var myJson = {};
        var hashes = href.slice(href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            myJson[hash[0]] = hash[1];
        }
        return myJson;
    })(href)

    return authData
}

export default getDataFromUrl;
