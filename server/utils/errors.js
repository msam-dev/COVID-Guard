class ServerError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    getCode() {
        return 500;
    }
}

class BadRequest extends ServerError {
    getCode(){
        return 400;
    }
}
class NotFound extends ServerError {
    getCode(){
        return 404;
    }
}
class Unauthorized extends ServerError {
    getCode(){
        return 401;
    }
}

class Forbidden extends ServerError {
    getCode(){
        return 403;
    }
}

module.exports = {
    ServerError,
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound
};