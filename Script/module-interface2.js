angular
    .module("module-interface2", [])
    .controller("controller-interface2", function(){
        var cInterface2 = this
        cInterface2.allRecipes = new Object();

        // Traer todas las recetas (luego se cambiara la funcion por filtro)
        db.ref('db/recipes').once('value', function(snapshot){
            cInterface2.allRecipes = snapshot.val();
        })
    })