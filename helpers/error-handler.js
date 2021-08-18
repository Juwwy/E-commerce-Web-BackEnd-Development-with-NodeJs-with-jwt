function errorHandler(err, req, res, next){
    if(err.name === "UnauthorizedError")
    {
        res.status(401).json({message: 'The user is Unauthorized!'});
    }

    if(err.name === "ValidationError")
    {
        res.status(401).json({message: err}); //checking the error status
    }

    return res.status(500).json({message: err});
}

module.exports = errorHandler;