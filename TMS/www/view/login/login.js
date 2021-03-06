'use strict';
app.controller('LoginCtrl', ['ENV', '$scope', '$http', '$state', '$stateParams', '$ionicPopup', '$timeout', '$cordovaToast', '$cordovaFile', '$cordovaAppVersion', 'ApiService', 'SqlService', '$ionicPlatform', '$cordovaSQLite', '$rootScope',
    function (ENV, $scope, $http, $state, $stateParams, $ionicPopup, $timeout, $cordovaToast, $cordovaFile, $cordovaAppVersion, ApiService, SqlService, $ionicPlatform, $cordovaSQLite, $rootScope) {
        var alertPopup = null;
        var alertPopupTitle = '';
        $scope.logininfo = {
            strDriverId: ''
        };
        var showPopup = function (title, type, callback) {
            if (alertPopup !== null) {
                alertPopup.close();
                alertPopup = null;
            }
            alertPopup = $ionicPopup.alert({
                title: title,
                okType: 'button-' + type
            });
            alertPopup.then(function (res) {
                if (typeof (callback) == 'function') callback(res);
            });
        };
        $scope.funcLogin = function (blnDemo) {
            if (blnDemo) {
                ENV.mock = true;
            } else {
                ENV.mock = false;
            }
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
            if (ENV.mock) {
                sessionStorage.clear();
                sessionStorage.setItem('strDriverId', $scope.logininfo.strDriverId);
                // sessionStorage.setItem('strDriverName', 'Mr. Driver');
                $state.go('index.main', {}, {
                    reload: true
                });
            } else {
                if ($scope.logininfo.strDriverId === '') {
                    showPopup('Please Enter Driver ID.', 'assertive');
                } else {
                    var objUri = ApiService.Uri(ENV.apiMap.login.check).addSearch('DriverCode', $scope.logininfo.strDriverId);
                    ApiService.Get(objUri, true).then(function success(result) {
                        var results = result.data.results;
                        if (is.not.empty(results)) {
                            sessionStorage.clear();
                            sessionStorage.setItem('strDriverId', $scope.logininfo.strDriverId);
                            sessionStorage.setItem('strDriverCode', $scope.logininfo.strDriverId);
                            sessionStorage.setItem('strDriverName', results[0].DriverName);
                            sessionStorage.setItem('strVehicleNo', results[0].VehicleNo);

                            // if ( !ENV.fromWeb ) {
                            //     $cordovaSQLite.execute( db, 'INSERT INTO Users (uid) VALUES (?)', [ $scope.logininfo.strDriverId ] )
                            //         .then( function ( result ) {}, function ( error ) {} )
                            // }
                            var objUser = {
                                uid: $scope.logininfo.strDriverId
                            };

                            SqlService.Insert('Users', objUser).then(function (res) {});
                            $state.go('index.main', {}, {
                                reload: true
                            });
                            $rootScope.$broadcast('login');
                        } else {
                            showPopup('Invalid Driver ID.', 'assertive', function (res) {});
                        }
                    });
                }
            }
        };

        $scope.goDriverCode = function () {
            $state.go('driverCodeCtrl', {}, {
                reload: true
            });
        }
        $('#iDriverId').on('keydown', function (e) {
            if (e.which === 9 || e.which === 13) {
                if (alertPopup === null) {
                    $scope.funcLogin(false);
                } else {
                    alertPopup.close();
                    alertPopup = null;
                }
            }
        });
        $ionicPlatform.ready(function () {
            var strSql = 'SELECT * FROM Users';
            SqlService.Exec(strSql).then(function (res) {
                    if (res.rows.length > 0 && is.not.undefined(res.rows.item(0).uid)) {
                        var value = res.rows.item(0).uid;
                        $rootScope.$broadcast('login');
                        sessionStorage.clear();
                        sessionStorage.setItem('strDriverId', value);
                        $state.go('index.main', {}, {
                            reload: true
                        });
                    }
                },
                function (error) {}
            );
        });
    }
]);
