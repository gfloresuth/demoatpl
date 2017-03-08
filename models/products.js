function Product(knex){
    var _scope = {
        _knex: knex,
        getProducts: function(pageConfig){
            return new Promise(function(fulfill, reject){
                var info = pageConfig;
                var current = ((info.currentPage - 1) * info.perPage)
                _scope._knex.select().from('products').limit(info.perPage).offset(current).then(function(data){
                    fulfill(data);
                });
            });
        },
        getPages: function(perPage){
            return new Promise(function(fulfill, reject){
                _scope._knex('products').count('id as total').then(function(result){
                    console.log(result);
                    var pages={
                        perPage: perPage,
                        totalRows: result[0].total,
                        totalPages: Math.ceil(result[0].total/perPage)
                    };
                    fulfill(pages);
                });

            })
        }
    };
    console.log('Creado');
    return _scope;
}


module.exports = Product;
