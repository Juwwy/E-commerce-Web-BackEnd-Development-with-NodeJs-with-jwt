const expressjwt =  require('express-jwt');

function authJwt(){
    const secret = process.env.secret;
    const api = process.env.API_Url;

    return expressjwt({ secret, algorithms: ['HS256'], isRevoked: isRevoked})
    .unless({path: [`${api}/users/login`, 
    `${api}/users/register`, 
    {url: /\/products\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
    {url: /\/api\/v1\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
    {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS']}]})
}

async function isRevoked(req, payload, done)
{
    if(!payload.isAdmin)
    {
        done(null, true);
    }

    done();
}


module.exports = authJwt;