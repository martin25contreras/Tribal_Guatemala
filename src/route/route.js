const PrincipalController = require('../controller/PrincipalController')

const CreateRoute = (app) =>{
    app.get('/api/series', PrincipalController.getSeries);
    app.get('/api/series/:idSerie', PrincipalController.getSeriesUnique);
    app.post('/api/series/create', PrincipalController.CreateUser);

    app.get("/api/series/logout", PrincipalController.logout);
}

module.exports = CreateRoute;