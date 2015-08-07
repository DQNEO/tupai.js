Package('')
.define('Config', function(cp) {
    return {
    "api_manager": {
        "client": {
            "type": "default"
        },
        "responseDelegate": {
            "classzz": "minimal.ResponseDelegate"
        },
        "apiParameterMap": {}
    },
    "cache_manager": {},
    "routes": {
        "/root": "minimal.RootViewController"
    }
};});