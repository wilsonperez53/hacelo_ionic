angular.module('hacelo', [
    'ionic',
    'hacelo.config',
    'hacelo.models',
    'hacelo.controllers',
    'hacelo.providers',
    'hacelo.services'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the 
        // accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/index.html",
        controller: 'AppCtrl'
    })
    .state('app.landing', {
        url: "/landing",
        views: {
            'haceloContent': {
                templateUrl: "templates/landing.html"
            }
        }
    })
    .state('app.products', {
        url: "/products",
        views: {
            'haceloContent': {
                templateUrl: "templates/product.html"
            }
        }
    })
    .state('app.info', {
        url: "/info",
        views: {
            'haceloContent': {
                templateUrl: "templates/info.html"
            }
        }
    })
    .state('app.photo', {
        url: "/photo",
        views: {
            'haceloContent': {
                templateUrl: "templates/photo.html"
            }
        }
    })
    .state('app.choose', {
        url: "/choose",
        views: {
            'haceloContent': {
                templateUrl: "templates/choose.html",
                controller: 'chooseCtrl'
            }
        }
    })
    .state('app.check', {
        url: "/check",
        views: {
            'haceloContent': {
                templateUrl: "templates/check-photo.html",
                controller: 'checkCrtl'
            }
        }
    })
    .state('app.confirm', {
        url: "/confirm",
        views: {
            'haceloContent': {
                templateUrl: "templates/confirm.html",
                controller: 'confirmCtrl'
            }
        }
    })
    .state('app.added', {
        url: "/added",
        views: {
            'haceloContent': {
                templateUrl: "templates/added-cart.html",
                controller: 'addedCartCtrl'
            }
        }
    })
    .state('app.cart', {
        url: "/cart",
        views: {
            'haceloContent': {
                templateUrl: "templates/cart.html",
                controller: 'cartCtrl'
            }
        }
    })
    .state('app.cart-checkout', {
        url: "/cart-checkout",
        views: {
            'haceloContent': {
                templateUrl: "templates/cart-checkout.html",
                controller: 'cartCheckoutCtrl'
            }
        }
    })
    .state('app.cart-empty', {
        url: "/cart-empty",
        views: {
            'haceloContent': {
                templateUrl: "templates/cart-empty.html",
                controller: 'cartEmptyCtrl'
            }
        }
    })
    .state('app.share', {
        url: "/share",
        views: {
            'haceloContent': {
                templateUrl: "templates/share.html",
                controller: 'ShareCtrl'
            }
        }
    })
    .state('app.instagram', {
        url: "/instagram",
        views: {
            'haceloContent': {
                templateUrl: "templates/instagram.html",
                controller: 'InstagramCrtl'
            }
        }
    })
    .state('app.congrats', {
        url: "/congrats",
        views: {
            'haceloContent': {
                templateUrl: "templates/congrats.html",
                controller: 'congratsCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/landing');
});
    /*
     * Instagram class for getting entire things
     */
    window.messages = {
        "EMPTY": "No hay iamgenes la cuenta!",
        "NO_EXIST": "El usuario no existe!",
        "FILL": "Por favor, llenar los campos!"
    }
    /*
     * Instagram constructor
     */
    var Instagram = function() {

        this.user_url = "https://api.instagram.com/v1/users/";
        this.client_id = "70a2ae9262fc4805a5571e8036695a4d";
        this.redirect_uri = "http://www.wikipedia.org/";
        this.scope = "likes+comments";
        this.url = "https://api.instagram.com/oauth/authorize/?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_uri + "&response_type=code&scope=" + this.scope;
        this.access_token = "";
        this.user_id = "";
        this.img = "";
        this.tab = {};
        this.img_template = {
            "images": []
        };
        this.canvas_width = $(window).width() - 20;
        this.array_angular = [];
        this.current_hosted_service = "http://www.luisrojascr.com/lab/test/nacion_instagram.php";
        this.code = '';

    };

    /*
     *
     * Instagram prototypal inheritance.
     *
     */
    Instagram.prototype = {

        init: function() {
            //this.tab = w.open(encodeURI(this.url), '_blank', 'location=yes,clearcache=no');
            this.tab = window.open(encodeURI(this.url), '_blank', 'location=yes');
            this.bind_events();
        },

        bind_events: function() {
            var self = this;
            this.tab.addEventListener('loadstart', function(e) {
                var el = e.url.split("code=");
                var error = e.url.split('error=');
                console.log(el);
                console.log(error);
                if (typeof error[1] != "undefined") {
                    self.error_callback();
                } else {
                    if (typeof el[1] != "undefined") {
                        self.code = el[1];
                        self.found_access_code(el);
                    }

                }

            });
        },

        fetch: function(url, data, callback) {
            var self = this;
            $.ajax({
                url: url,
                type: 'GET',
                data: data,
                crossDomain: true,
                dataType: 'jsonp',
                jsonpCallback: 'callback',
                success: function(e) {
                    console.log(e);
                    callback(e, self);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.debug(jqXHR);
                    console.debug(errorThrown);
                }
            });
        },

        fetch_new_page: function(url,callback) {
            var self = this;
            $.ajax({
                url: url,
                type: 'GET',
                crossDomain: true,
                dataType: 'jsonp',
                jsonpCallback: 'callback',
                success: function(e) {
                    console.log(e);
                    callback(e, self);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.debug(jqXHR);
                    console.debug(errorThrown);
                }
            });
        },

        insert_images: function(response, self) {
            var pag = null;
            console.debug(response);
            $('.images-hidden *').remove();
            setTimeout(function() {
                if (response.data.length <= 0) {
                    hacelo.alert(messages["EMPTY"]);
                    createEvent('_EMPTY');
                } else {
                    var array = new Array(),
                        obj = new Object(),
                        img = '',
                        counter = 0,
                        count = '',
                        img_encode = null;

                    for (var els = 0; els < response.data.length; els++) {
                        //obj = {
                            //"url": response.data[els].images.standard_resolution
                        //};
                        array.push(response.data[els].images.standard_resolution);
                        //img += "<img class='img_test' src='" + response.data[els].images.standard_resolution.url + "' id='image_id_" + counter + "'/>"
                        counter++;
                    }


                    self.img_template["images"] = array;

                    if(response.pagination){
                       self.createEvent('pagination', response.pagination.next_url)
                    }

                    self.createEvent('finish', array);

                    
                    // setTimeout(function() {
                    //     count = $(".img_test").length;
                    //     img_encode = $(".img_test");
                    //     for (var x = 0; x < count; x++) {
                    //         console.debug(img_encode[x].id);
                    //         console.log(self.convert_img_to_encode(img_encode[x].id));
                    //         self.array_angular.push(self.convert_img_to_encode(img_encode[x].id));
                    //     }
                    //     self.createEvent('finish', self.array_angular);
                    // }, 400);
                }
            }, 100);
        },

        get_user_id: function(data, scope) {
            if (data.data <= 0) {
                hacelo.alert(messages['NO_EXIST']);
            } else {
                var self = scope;
                self.user_id = data.user.id;
                self.access_token = data.access_token;
                self.fetch("https://api.instagram.com/v1/users/" + self.user_id + "/media/recent", 'access_token=' + self.access_token, self.insert_images);
            }

        },

        loadMore: function(url){
            this.fetch_new_page(url, this.insert_images);
        },

        found_access_code: function(data) {
            if (data.length == 2) {
                this.tab.close();
                this.fetch_post(this.current_hosted_service, this.code, this.get_user_id);
                //this.fetch('https://api.instagram.com/v1/users/search',"q="+this.username+"&access_token="+this.access_token,this.get_user_id);
            }
        },

        error_callback: function() {
            this.tab.close();
        },

        fetch_post: function(url, data, callback) {
            var self = this;
            $.post(url, {
                code: data
            })
                .done(function(data) {
                    callback(data, self);
                });
        },


        convert_img_to_encode: function(id) {
            var img = document.getElementById(id);
            var canvas = document.createElement("canvas");
            var height, width, ratio;
            width = img.width;
            height = img.height;
            ratio = width / height;
            ratio = this.canvas_width / ratio;
            canvas.width = this.canvas_width;
            canvas.height = ratio;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, this.canvas_width, ratio);
            $(canvas).appendTo(".images-hidden");
            window.dataURL = canvas.toDataURL("image/png");
            $('<img src="' + window.dataURL + '"/>').appendTo(".images-hidden");
            return window.dataURL;
        },

        createEvent: function(text, data) {
            var event;
            if (data != undefined) {
                event = new CustomEvent(text, {
                    'detail': data
                });
            } else {
                event = new CustomEvent(text);
            }
            document.dispatchEvent(event);
        }

    };
 (function(){

 	window.hacelo = window.hacelo || {};
 	window.hacelo = {
 		alert : function(string){
 			alert(string);
 		},

 		messages :{
 			"Loading":"<span>Cargando...</span><i class='icon ion-looping'></i>"
 		}
 	};

 })();
var controllers = angular.module('hacelo.controllers', []);
var models = angular.module('hacelo.models', []);
var providers = angular.module('hacelo.providers', []);
var services = angular.module('hacelo.services', []);
angular.module('hacelo.config', [])
.constant('DB_CONFIG', {
    name: 'HACELO_DB',
    displayName: 'hacelo',
    tables: [
      {
            name: 'documents',
            columns: [
                {name: 'id', type: 'integer primary key'},
                {name: 'title', type: 'text'},
                {name: 'keywords', type: 'text'},
                {name: 'version', type: 'integer'},
                {name: 'release_date', type: 'text'},
                {name: 'filename', type: 'text'},
                {name: 'context', type: 'text'}
            ]
        }
    ]
});
controllers.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, Nacion_Service) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.user = {
        "instagra_username": "Raiam"
    };
    $scope.validate = false;

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    $scope.insert_url = function() {
        if ($scope.validate == false) {
            $scope.validate = true;
            Nacion_Service.set_username($scope.user.instagra_username);
            $timeout(function() {
                $scope.closeLogin();
                Nacion_Service.createEvent('update-username', $scope.user.instagra_username);
            }, 1000);
        }

    };
    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
});
/* ChooseCrtl para controlar la pantalla de escoger
 * $scope - Scope de la pantalla
 * Nacion_Service - Servicio de datos de nacion, service.js
 */
controllers.controller('chooseCtrl', function($scope, Nacion_Service) {
    //Variables for using on the app
    $scope.username = '';
    $scope.instagram_pics = Nacion_Service.get_entire_ins_pics();
    $scope.all_pics_for_print = Nacion_Service.get_instagram_pics_on_queue();
    console.debug($scope.all_pics_for_print);

    //Function for init the isntagram
    $scope.init_instagram = function(username) {
        var instagram_v = new Instagram(username);
        instagram_v.init();
    };

    //Open the new window with the correct url for using
    $scope.call_popup = function() {
        if (Nacion_Service.get_entire_ins_pics().length <= 0) {
            var instagram_v = new Instagram();
            instagram_v.init();
            //$scope.modal.show();
        } else {
            Nacion_Service.show(hacelo.messages.Loading);
            setTimeout(function() {
                window.location.href = '#/app/instagram';
            }, 500);

        }
    };

    //Document listener for when updating username
    document.addEventListener('update-username', function(e) {
        $scope.username = e.detail;
        $scope.init_instagram($scope.username);
    });
    document.addEventListener('pagination', function(e) {
        Nacion_Service.setNextUrl(e.detail);
        console.log(Nacion_Service.getNextUrl());
    });
    //Listener when the page just got the code and the images as well.
    document.addEventListener('finish', function(e) {
        //Open the loading popup
        Nacion_Service.show(hacelo.messages.Loading);
        //little timeout to ensure the pop up to appear
        setTimeout(function() {
            $scope.instagram_pics = e.detail;
            var array = [];
            for (var el = 0; el < $scope.instagram_pics.length; el++) {
                var obj = {
                    "img": $scope.instagram_pics[el],
                    "picked": false
                };
                array.push(obj);
            }
            $scope.instagram_pics = array;
            console.debug(array);
            Nacion_Service.set_entire_ins_pics($scope.instagram_pics);
            $scope.$apply();
            if ($scope.instagram_pics.length > 0) {
                window.location.hash = "#/app/instagram";
            };
        }, 100);

    });
});
/* Instagram para controlar la pantalla de isntagram
 * $scope - Scope de la pantalla
 * Nacion_Service - Servicio de datos de nacion, service.js
 */
controllers.controller('InstagramCrtl', function($scope, Nacion_Service) {
    $scope.instagram_pics = Nacion_Service.get_entire_ins_pics();
    $scope.picked_pics = Nacion_Service.get_instagram_pics_on_queue();
    $scope.load_more = Nacion_Service.getNextUrl();
    Nacion_Service.hide();
    console.log($scope.load_more);

    $scope.pick_song = function(index, data) {
        if ($scope.instagram_pics[index].picked) {
            $scope.instagram_pics[index].picked = false;
            var index = $scope.picked_pics.indexOf(data);
            $scope.picked_pics.splice(index, 1);
        } else {
            $scope.instagram_pics[index].picked = true;
            $scope.picked_pics.push(data);
        }
    };

    $scope.insert_into_queue = function() {
        Nacion_Service.set_instagram_pics_on_queue($scope.picked_pics);
        window.picked = $scope.picked_pics;
        window.history.back();
    };

    $scope.loadMore = function(){
        var instagram_v = new Instagram();
            instagram_v.loadMore($scope.load_more);
    };

    document.addEventListener('finish', function(e) {
        //Open the loading popup
        Nacion_Service.show(hacelo.messages.Loading);
        //little timeout to ensure the pop up to appear
        setTimeout(function() {
            var nextPage = e.detail;
            var array = [];
            for (var el = 0; el < nextPage.length; el++) {
                var obj = {
                    "img": nextPage[el],
                    "picked": false
                };
                array.push(obj);
            }
            $scope.instagram_pics = $scope.instagram_pics.concat(array);
            console.debug(array);
            Nacion_Service.set_entire_ins_pics($scope.instagram_pics);
            Nacion_Service.hide();

            Nacion_Service.setNextUrl('');
            $scope.load_more = Nacion_Service.getNextUrl();
        }, 100);

    });

    document.addEventListener('pagination', function(e) {
        Nacion_Service.setNextUrl(e.detail);
        $scope.load_more = Nacion_Service.getNextUrl();
    });
});
controllers.controller('ShareCtrl', function($scope, $ionicModal, $timeout, $ionicLoading, Nacion_Service) {
    
    $scope.shareFb = function(){
        window.plugins.socialsharing.shareViaFacebook('http://www.hacelodigital.com/')
    };

    $scope.shareTwitter = function(){
        window.plugins.socialsharing.shareViaTwitter('http://www.hacelodigital.com/')
    };

    $scope.shareEmail = function(){
        window.plugins.socialsharing.shareViaEmail('Hacelo','Hacelo');
    };
});
/*
 * Code pulled from https://gist.github.com/jgoux/10738978
 */
models.factory('Document', ['DB', function (DB) {
    var self = this;
    
    self.all = function() {
        return DB.query('SELECT * FROM documents')
        .then(function(result){
            return DB.fetchAll(result);
        });
    };
    
    self.getById = function(id) {
        return DB.query('SELECT * FROM documents WHERE id = ?', [id])
        .then(function(result){
            return DB.fetch(result);
        });
    };
    
    return self;
}]);
services.service('MessageService', ['$http', function ($http) {
    // Private stuff
    var messages =          null,
        messageDBlocation = "js/common/messagesDB.json",
        self =              this,
        callbackResult =    function(json) {
            self.messages = json ? angular.fromJson(json) : {};
        },
        initMessages =      function() {
            $http.get(messageDBlocation).
              success(callbackResult).
              error(callbackResult);
        },
        keyToValue =   function(searchCriteria, obj) {
            var value;
            for(var key in obj) {
                if (angular.isDefined(obj[searchCriteria])) {
                    value = obj[searchCriteria];
                }
                if( angular.isObject(obj[searchCriteria]) || angular.isArray(obj[searchCriteria])){
                    value = keyToValue(obj[searchCriteria]);
                }
            }
            if (angular.isUndefined(value)) {
                value = "not found";
            }
            return value;
        };
    // Public stuff
    this.search = function(msjKey) {
        return keyToValue(msjKey);
    };
    // Load the messages from JSON file
    initMessages();
}]);
services.service('Nacion_Service',['$ionicLoading',function($ionicLoading){
	this.username = '';
	this.instagram_pics = [];
  this.instagram_pics_on_queue = [];
  this.loadMore = '';

  this.show = function(text) {
    $ionicLoading.show({
      template: text
    });
  };
  this.hide = function(){
    $ionicLoading.hide();
  };


	this.alert = function(){
		alert('test');
	};

	this.set_username = function(data){
		this.username = data;
	};

  this.setNextUrl = function(url){
    this.loadMore = url;
  };

  this.getNextUrl = function(){
    return this.loadMore;
  };

	this.createEvent = function(text,data){
        var event;
          if(data !=undefined){
            event = new CustomEvent(text,{'detail':data});
          }else {
            event = new CustomEvent(text);
          }
          document.dispatchEvent(event);
    };
    this.set_entire_ins_pics = function(data){
    	this.instagram_pics = data;
    };

    this.get_entire_ins_pics = function(){
    	return this.instagram_pics;
    };

    this.set_instagram_pics_on_queue = function(data){
      this.instagram_pics_on_queue = data;
    };

    this.get_instagram_pics_on_queue = function(){
      return this.instagram_pics_on_queue;
    };
}]);
/*
 * Code pulled from https://gist.github.com/jgoux/10738978
 */
services.factory('DB', ['$q', 'DB_CONFIG', '$window', '$log', function ($q, DB_CONFIG, $window, $log) {
    // DB wrapper
    var self = this;
    self.db = null;
 
    self.init = function() {
        // Use self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name}); in production
        self.db = $window.openDatabase(DB_CONFIG.name, '1.0', DB_CONFIG.displayName, -1);
 
        angular.forEach(DB_CONFIG.tables, function(table) {
            var columns = [];
 
            angular.forEach(table.columns, function(column) {
                columns.push(column.name + ' ' + column.type);
            });
 
            var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
            self.query(query);
            $log('Table ' + table.name + ' initialized');
        });
    };
 
    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();
 
        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                deferred.resolve(result);
            }, function(transaction, error) {
                deferred.reject(error);
            });
        });
 
        return deferred.promise;
    };
 
    self.fetchAll = function(result) {
        var output = [];
 
        for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        
        return output;
    };
 
    self.fetch = function(result) {
        return result.rows.item(0);
    };
 
    return self;
}]);