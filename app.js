const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors'); // helps to allow cross platform http request
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


require('dotenv/config');

const api = process.env.API_Url;


//Middleware section
app.use(bodyparser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname+'/public/uploads'));

//Routers
const productRouter = require('./router/products');
const orderRouter = require('./router/orders');
const userRouter = require('./router/users');
const orderItemRouter = require('./router/orderItems');
const categoryRouter = require('./router/categories');







//Route
app.use(cors());
app.options('*', cors());
app.use(`${api}/products`, productRouter);
app.use(`${api}/orders`, orderRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orderItems`, orderItemRouter);
app.use(`${api}/categories`, categoryRouter);






mongoose.connect(process.env.CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'E-Shop-Database' }  )
.then(()=>{
                            
    console.log('Database is ready!');
})
.catch((err)=>{
    console.log(err)
})


app.listen(3000, ()=>{
    console.log(api);
    console.log('Server is running @ port localhost:300');
});