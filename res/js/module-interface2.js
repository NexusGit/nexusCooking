angular
    .module("module-interface2", ['firebase'])
    .controller("controller-interface2", function($firebaseObject, $scope){
        var cInterface2 = this;
        const rootRef = firebase.database().ref().child('db');
        const ref = rootRef.child('recipes');
        cInterface2.object = $firebaseObject(ref);
        cInterface2.allRecipes = new Object();
        cInterface2.allRecipesAux = new Object();
        cInterface2.extraIngredientsAllowed = 0;
        cInterface2.myData = JSON.parse(localStorage.getItem("myData"));
        cInterface2.category = new Object();
        cInterface2.category = {arroces:false, bebidascocteles:false, carnes:false, creamaspuressopas:false, ensaladas:false, legumbres:false, pastas:false, pescadosmariscos:false, postres:false, salsasbases:false, verduras:false, otros:false};
        cInterface2.categoryFilter = new Object();
        cInterface2.difficulty = new Object();
        cInterface2.difficulty = {facil:false, intermedio:false, dificil:false};
        cInterface2.difficultyFilter = new Object();
        cInterface2.time = new Object();
        cInterface2.time = {express:false, normal:false, long:false};
        cInterface2.timeFilter = new Object();
        cInterface2.nameFilter = "";

        // Trae todas las recetas y las filtra
        cInterface2.bringEveryRecipe = function(){
            db.ref('db/recipes').once('value').then(function(snapshot){
                cInterface2.allRecipes = snapshot.val();
                $scope.$apply();
                if ((cInterface2.getCategoriesChecked().length != 0) || (cInterface2.getDifficultiesChecked().length != 0) || (cInterface2.getTimesChecked().length != 0) || (cInterface2.nameFilter != "")){
                    for (recipe in cInterface2.allRecipes){
                        var isContained1 = true;
                        for (var i = 0; i < cInterface2.getCategoriesChecked().length; i++){
                            isContained1 = false;
                            if (cInterface2.getCategoriesChecked()[i] == Object.keys(cInterface2.allRecipes[recipe].category)[0]){
                                isContained1 = true;
                                break;
                            }
                        }
                        var isContained2 = true;
                        for (var i = 0; i < cInterface2.getDifficultiesChecked().length; i++){
                            isContained2 = false;
                            if (cInterface2.getDifficultiesChecked()[i] == Object.keys(cInterface2.allRecipes[recipe].difficulty)[0]){
                                isContained2 = true;
                                break;
                            }
                        }
                        var isContained3 = true;
                        for (var i = 0; i < cInterface2.getTimesChecked().length; i++){
                            isContained3 = false;
                            if (cInterface2.getTimesChecked()[i] == Object.keys(cInterface2.allRecipes[recipe].timeType)[0]){
                                isContained3 = true;
                                break;
                            }
                        }
                        var isName = false;
                        if (cInterface2.allRecipes[recipe].name.toLowerCase().includes(cInterface2.nameFilter.toLowerCase())){
                            isName = true;
                        }
                        if (!(isContained1 && isContained2 && isContained3 && isName)){
                            delete cInterface2.allRecipes[recipe];
                        }
                    }
                }
                $scope.$apply();
            })
        }
        
        // Trae solo las recetas que esten coincidentes con la lista de ingredientes teniendo en cuenta los extras y las filtra
        cInterface2.bringSomeRecipe = function(){
            for (ingredient in cInterface2.myData){
                db.ref('db/ingredients/' + ingredient + '/recipes').once('value').then(function(snapshot){
                    for (key in snapshot.val()){
                        db.ref('db/recipes/').child(key).once('value', function(snap){
                            cInterface2.allRecipesAux[key] = snap.val().ingredients;
                        })
                    }
                    for (recipe in cInterface2.allRecipesAux){
                        var extraIngredients = 0;
                        for (ingredients in cInterface2.allRecipesAux[recipe]){
                            if (!(localStorage.getItem("myData")).includes(ingredients)){
                                extraIngredients++;
                            }
                        }
                        if (extraIngredients <= cInterface2.extraIngredientsAllowed){
                            cInterface2.allRecipes[recipe] = true;
                            db.ref('db/recipes/').child(recipe).once('value', function(snapshot){
                                if ((cInterface2.getCategoriesChecked().length == 0) && (cInterface2.getDifficultiesChecked().length == 0) && (cInterface2.getTimesChecked().length == 0) && cInterface2.nameFilter == ""){
                                    cInterface2.allRecipes[recipe] = snapshot.val();
                                    $scope.$apply();
                                }else{
                                    var isIncludedInFilter1 = true;
                                    for (var i = 0; i < cInterface2.getCategoriesChecked().length; i++){
                                        isIncludedInFilter1 = false;
                                        if (JSON.stringify(snapshot.val().category).includes(cInterface2.getCategoriesChecked()[i])){
                                            isIncludedInFilter1 = true;
                                            break;
                                        }
                                    }
                                    var isIncludedInFilter2 = true;
                                    for (var i = 0; i < cInterface2.getDifficultiesChecked().length; i++){
                                        isIncludedInFilter2 = false;
                                        if (JSON.stringify(snapshot.val().difficulty).includes(cInterface2.getDifficultiesChecked()[i])){
                                            isIncludedInFilter2 = true;
                                            break;
                                        }
                                    }
                                    var isIncludedInFilter3 = true;
                                    for (var i = 0; i < cInterface2.getTimesChecked().length; i++){
                                        isIncludedInFilter3 = false;
                                        if (JSON.stringify(snapshot.val().timeType).includes(cInterface2.getTimesChecked()[i])){
                                            isIncludedInFilter3 = true;
                                            break;
                                        }
                                    }
                                    var isName = false;
                                    if (snapshot.val().name.toLowerCase().includes(cInterface2.nameFilter.toLowerCase())){
                                        isName = true;
                                    }
                                    if (isIncludedInFilter1 && isIncludedInFilter2 && isIncludedInFilter3 && isName){
                                        cInterface2.allRecipes[recipe] = snapshot.val();
                                        $scope.$apply();
                                    }else{
                                        delete cInterface2.allRecipes[recipe];
                                        $scope.$apply();
                                    }
                                }
                            })
                        }else{
                            delete cInterface2.allRecipes[recipe];
                            $scope.$apply();
                        }
                    }
                })
            }
        }

        // Devuelve la ruta de la interfaz 3 con el hashtag de la receta correspondiente
        cInterface2.selectRecipe = function(index){
            return 'recipe.html' + '#' + Object.keys(cInterface2.allRecipes)[index];
        }

        // Decide traer todas las recetas o un grupo
        cInterface2.chooseInitializer = function(){
            if (_.isEmpty(cInterface2.myData)){
                cInterface2.bringEveryRecipe();
            }else{
                cInterface2.bringSomeRecipe();
            }
        }

        // Aumenta la cantidad de ingredientes extras permitidos
        cInterface2.addExtraIngredientsAllowed = function(){
            ++cInterface2.extraIngredientsAllowed;
            cInterface2.chooseInitializer();
            $scope.$apply();
        }

        // Disminuye la cantidad de ingredientes extras permitidos
        cInterface2.substractExtraIngredientsAllowed = function(){
            if (cInterface2.extraIngredientsAllowed > 0){
                --cInterface2.extraIngredientsAllowed;
                cInterface2.chooseInitializer();
                $scope.$apply();
            }
        }

        // Devuelve un arreglo de strings de las categorias seleccionadas
        cInterface2.getCategoriesChecked = function(){
            cInterface2.categoryFilter = new Object();
            for (myCategory in cInterface2.category){
                if (cInterface2.category[myCategory]){
                    cInterface2.categoryFilter[myCategory] = myCategory;
                }
            }
            return Object.values(cInterface2.categoryFilter);
        }

        // Filtra por categoria la lista de recetas a mostrar
        cInterface2.filterCategoryData = function(){
            cInterface2.getCategoriesChecked();
            cInterface2.chooseInitializer();
        }

        // Devuelve un arreglo de strings de las dificultades seleccionadas
        cInterface2.getDifficultiesChecked = function(){
            cInterface2.difficultyFilter = new Object();
            for (myDifficulty in cInterface2.difficulty){
                if (cInterface2.difficulty[myDifficulty]){
                    cInterface2.difficultyFilter[myDifficulty] = myDifficulty;
                }
            }
            return Object.values(cInterface2.difficultyFilter);
        }

        // Filtra por dificultad la lista de recetas a mostrar
        cInterface2.filterDifficultyData = function(){
            cInterface2.getDifficultiesChecked();
            cInterface2.chooseInitializer();
        }

        // Devuelve un arreglo de strings de los tiempos seleccionadas
        cInterface2.getTimesChecked = function(){
            cInterface2.timeFilter = new Object();
            for (myTime in cInterface2.time){
                if (cInterface2.time[myTime]){
                    cInterface2.timeFilter[myTime] = myTime;
                }
            }
            return Object.values(cInterface2.timeFilter);
        }

        // Filtra por tiempo de realizacion la lista de recetas a mostrar
        cInterface2.filterTimeData = function(){
            cInterface2.getTimesChecked();
            cInterface2.chooseInitializer();
        }

        cInterface2.chooseInitializer();
    })