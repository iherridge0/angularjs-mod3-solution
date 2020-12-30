(function (){
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems);

// FoundItems.$inject = [];
function FoundItems (){
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: NarrowItDownDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;

};

function NarrowItDownDirectiveController() {
  var list = this;


}

NarrowItDownController.$inject = ['MenuSearchService']
function NarrowItDownController(MenuSearchService){
  var controller = this;

  controller.searchTerm ='Chicken';
  controller.errorMessage = '';

  controller.found  = [];

  controller.narrowItDown = function (){
    var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);

    promise.then(function (response){
      controller.found  = response;
      if(controller.found.length > 0){
        controller.errorMessage = '';
      } else {
        controller.errorMessage = 'Nothing found';
      }
    })
    .catch(function (error) {
      console.log("Something went terribly wrong." + error.message);
    });
  };

  controller.onRemove = function (item) {
  //  controller.found.splice(index);
    controller.found.splice(item, 1);
    console.log("NO WAY {}", item);
  }

};

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http){
  var service = this;

  service.getMatchedMenuItems = function(searchTerm){
    var response = $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"
    }).then(
      function success(response){
        // process result and only keep items that match
        var foundItems = [];
        var menuItems = response.data['menu_items']

        for(var i = 0; i < menuItems.length; i++){
          if(menuItems[i]["description"].toLowerCase().includes(searchTerm.toLowerCase())){
            foundItems.push(menuItems[i]);
          }
        }
        // return processed items
        return foundItems;
      }
    );
    return response;
  };
};





})();
