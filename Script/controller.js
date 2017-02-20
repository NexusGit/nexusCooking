var app = angular.module("myApp", []);
app.controller('MainController',['$scope', function($scope){

		$scope.ingredients = [];

		$scope.addIngredient = function(){
			if ($scope.newIngredient != null){
				/*if(!$scope.newIngredient.value in $scope.ingredients){*/
					$scope.ingredients.push({text: $scope.newIngredient});
			//}
			};
			$scope.newIngredient = null;
		};

		$scope.delIngredient = function (data){
			$scope.ingredients.splice(data, 1);
		};

		$scope.idIngreds = [];
		$scope.idIngreds.push({ ingr: "uno12" });
		$scope.idIngreds.push({ ingr: "dos" });
		$scope.idIngreds.push({ ingr: "tres" });
		$scope.idIngreds.push({ ingr: "cuatro" });
		$scope.idIngreds.push({ ingr: "cinco" });
		$scope.idIngreds.push({ ingr: "seis" });
		$scope.idIngreds.push({ ingr: "siete" });
		$scope.idIngreds.push({ ingr: "el ooooooochooo" });
/*/
		for (var i = 0; i < $scope.idIngreds.length; i++) {
			confirm($scope.idIngreds[i].ingr);
		}
/**/
}]);