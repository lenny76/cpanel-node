let request = require('request');

let tif = function(a, b){
    return (typeof a === b);
};

class CPanel {
    constructor(options){
        if(options === undefined || !tif(options, "object") || !tif(options.url, "string") || !tif(options.user, "string") || !tif(options.pass, "string") || !tif(options.https, "boolean") || !tif(options.port, "string")){
            throw "The params option<Object> must be completed with url<String>, user<String>, pass<String>, https<Boolean>, port<String>";
        }
        if(options.url.indexOf('http') !== -1){
            throw "The param .url contain http(s)://, please remove it like http://example.net -> example.net";
        }

        this.options = options;
    }

    login(module, func, values = [], callback) {
        let value = '';
        values.forEach((v) => {
            value += encodeURI('&'+Object.keys(v))+'='+encodeURI(v[Object.keys(v)])
        });

        let call = '/json-api/cpanel?cpanel_jsonapi_user='+this.options.user;
        call += '&cpanel_jsonapi_apiversion=2&cpanel_jsonapi_module='+module;
        call += '&cpanel_jsonapi_func='+func;
        call += value;

        let query = encodeURI((this.options.https ? "https://" : "http://")+this.options.url+':'+this.options.port+call);
        request({
            url: query,
            headers: {
                "Authorization": "Basic "+Buffer.from(`${this.options.user}:${this.options.pass}`).toString('base64')
            }
        }, function (err, head, body) {
            if(err)
                throw err;
            callback(body, head);
        })
    };

    emailAddpop(options, callback){
        if(!tif(options, "object") || !tif(options.domain, "string") || !tif(options.email, "string") || !tif(options.password, "string") || !tif(options.quota, "number")){
            throw "The params options<Object> must be completed with domain<String>, email<String>, password<String>, quota<Number>"
        }

        this.login('Email', 'addpop', [{domain: options.domain},{email: options.email},{password: options.password}, {quota: options.quota}], callback);
    };

    emailDelpop(options, callback){
        if(!tif(options, "object") || !tif(options.email, "string") || !tif(options.domain, "string")){
            throw "The params options<Object> must be completed with email<String>, domain<String>"
        }
        this.login('Email', 'delpop', [{email: options.email}, {domain: options.domain}], callback);
    }
}

module.exports = CPanel;