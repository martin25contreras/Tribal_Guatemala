const PrincipalController = require('../controller/PrincipalController')

const CreateRoute = () =>{
    app.post('/api/products/create', PrincipalController.createProduct);
}