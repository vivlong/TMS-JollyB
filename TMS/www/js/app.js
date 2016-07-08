'use strict';
var app = angular.module( 'TMS', [
  'ionic',
  'ngCordova',
  'ionicLazyLoad',
  'ionic-datepicker',
  'angularFileUpload',
  'jett.ionic.filter.bar',
  'ionic.ion.headerShrink',
  'ionMdInput',
  'ngMessages',
  'TMS.config',
  'TMS.directives',
  'TMS.services',
  'TMS.factories',

  'ui.select'
] );
app.run( [ 'ENV', '$ionicPlatform', '$rootScope', '$state', '$location', '$timeout', '$ionicHistory', '$ionicLoading', '$cordovaToast', '$cordovaKeyboard', '$cordovaFile', '$cordovaSQLite',
  function ( ENV, $ionicPlatform, $rootScope, $state, $location, $timeout, $ionicHistory, $ionicLoading, $cordovaToast, $cordovaKeyboard, $cordovaFile, $cordovaSQLite ) {
        if ( window.cordova ) {
            ENV.fromWeb = false;
        } else {
            ENV.fromWeb = true;
        }
        $ionicPlatform.ready( function () {
            if ( !ENV.fromWeb ) {
                $cordovaKeyboard.hideAccessoryBar( true );
                $cordovaKeyboard.disableScroll( true );
                try {
                    db = $cordovaSQLite.openDB( {
                        name: 'AppTms.db',
                        location: 'default'
                    } );
                } catch ( error ) {
                    console.error( error );
                }
                $cordovaSQLite.execute( db, 'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, uid TEXT)' );
                $cordovaSQLite.execute( db, 'CREATE TABLE IF NOT EXISTS Csbk1(TrxNo INTEGER,BookingNo TEXT, JobNo TEXT, StatusCode TEXT,BookingCustomerCode TEXT,Pcs INTEGER,CollectionTimeStart TEXT,CollectionTimeEnd TEXT,PostalCode TEXT,BusinessPartyCode TEXT,BusinessPartyName TEXT,Address1 TEXT,Address2 TEXT,Address3 TEXT,Address4 TEXT,CompletedFlag TEXT,TimeFrom TEXT,TimeTo TEXT,ColTimeFrom TEXT,ColTimeTo TEXT,CompletedDate TEXT,DriverId TEXT,CollectedAmt INTEGER,ScanDate TEXT,DriverCode TEXT)' );
                $cordovaSQLite.execute( db, 'CREATE TABLE IF NOT EXISTS Csbk2 (TrxNo INTEGER,LineItemNo INTEGER, BoxCode TEXT,Pcs INTEGER,UnitRate TEXT,CollectedPcs INTEGER,AddQty INTEGER)' );
                $cordovaSQLite.execute( db, 'CREATE TABLE IF NOT EXISTS CsbkDetail (BookingNo TEXT, JobNo TEXT,TrxNo INTEGER,StatusCode TEXT,ItemNo INTEGER,DepositAmt INTEGER,DiscountAmt  INTEGER,CollectedAmt  INTEGER,CompletedFlag TEXT,PaidAmt INTEGER)' );
                // sqlLite for mobile APP
                $rootScope.sqlLite_add_Csbk1 = function ( Csbk1 ) {
                    if ( db ) {
                        var sql = 'INSERT INTO Csbk1(TrxNo,BookingNo,JobNo,StatusCode,BookingCustomerCode,Pcs,CollectionTimeStart,CollectionTimeEnd,PostalCode,BusinessPartyCode,BusinessPartyName,Address1,Address2,Address3,Address4,CompletedFlag,TimeFrom,TimeTo,ColTimeFrom,ColTimeTo,ScanDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
                        $cordovaSQLite.execute( db, sql, [
          Csbk1.TrxNo, Csbk1.BookingNo, Csbk1.JobNo, Csbk1.StatusCode, Csbk1.BookingCustomerCode, Csbk1.Pcs, Csbk1.CollectionTimeStart, Csbk1.CollectionTimeEnd, Csbk1.PostalCode, Csbk1.BusinessPartyCode, Csbk1.BusinessPartyName, Csbk1.Address1, Csbk1.Address2, Csbk1.Address3, Csbk1.Address4, Csbk1.CompletedFlag, Csbk1.TimeFrom, Csbk1.TimeTo, Csbk1.ColTimeFrom, Csbk1.ColTimeTo, Csbk1.ScanDate
        ] )
                            .then( function ( result ) {}, function ( error ) {} );
                    }
                };

                $rootScope.sqlLite_update_Csbk1_DriverCode = function ( Csbk1 ) {
                    if ( db ) {
                      var sql = 'Update Csbk1 set DriverCode=? where BookingNo=?';
                                $cordovaSQLite.execute(db, sql, [Csbk1.DriverCode, Csbk1.BookingNo])
                                  .then(function(result) {}, function(error) {});

                                        }
                };
                // sqlLite for mobile APP
            }
            if ( window.StatusBar ) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        } );
        $ionicPlatform.registerBackButtonAction( function ( e ) {
            e.preventDefault();
            // Is there a page to go back to?  $state.include ??
            if ( $state.includes( 'index.main' ) || $state.includes( 'index.login' ) || $state.includes( 'splash' ) ) {
                if ( $rootScope.backButtonPressedOnceToExit ) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortBottom( 'Press again to exit.' );
                    setTimeout( function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000 );
                }
            } else if ( $state.includes( 'acceptJob' ) || $state.includes( 'jobListingList' ) ) {
                $state.go( 'index.main', {}, {
                    reload: true
                } );
            } else if ( $state.includes( 'jobListingDetail' ) ) {
                $state.go( 'jobListingList', {}, {} );
            } else if ( $ionicHistory.backView() ) {
                $ionicHistory.goBack();
            } else {
                // This is the last page: Show confirmation popup
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortBottom( 'Press again to exit.' );
                setTimeout( function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000 );
            }
            return false;
        }, 101 );
  }
] );
app.config( [ 'ENV', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$ionicFilterBarConfigProvider', '$httpProvider',
  function ( ENV, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider, $httpProvider ) {
        $ionicConfigProvider.platform.ios.tabs.style( 'standard' );
        $ionicConfigProvider.platform.ios.tabs.position( 'top' );
        $ionicConfigProvider.platform.android.tabs.style( 'standard' );
        $ionicConfigProvider.platform.android.tabs.position( 'top' )
            /*
            $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
            $ionicConfigProvider.platform.android.navBar.alignTitle('center');
            $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
            $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
            $ionicConfigProvider.platform.ios.views.transition('ios');
            $ionicConfigProvider.platform.android.views.transition('android');
            */
            //$ionicConfigProvider.views.forwardCache(true);//开启全局缓存
        $ionicConfigProvider.views.maxCache( 3 ); //关闭缓存
        $httpProvider.defaults.headers.put[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.post[ 'Content-Type' ] = 'application/x-www-form-urlencoded;charset=utf-8';
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [ function ( data ) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function ( obj ) {
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for ( name in obj ) {
                    value = obj[ name ];

                    if ( value instanceof Array ) {
                        for ( i = 0; i < value.length; ++i ) {
                            subValue = value[ i ];
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[ fullSubName ] = subValue;
                            query += param( innerObj ) + '&';
                        }
                    } else if ( value instanceof Object ) {
                        for ( subName in value ) {
                            subValue = value[ subName ];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[ fullSubName ] = subValue;
                            query += param( innerObj ) + '&';
                        }
                    } else if ( value !== undefined && value !== null ) {
                        query += encodeURIComponent( name ) + '=' +
                            encodeURIComponent( value ) + '&';
                    }
                }

                return query.length ? query.substr( 0, query.length - 1 ) : query;
            };

            return angular.isObject( data ) && String( data ) !== '[object File]' ?
                param( data ) :
                data;
          } ];
        $ionicConfigProvider.backButton.previousTitleText( false );
        //
        $stateProvider
            .state( 'index', {
                url: '',
                abstract: true,
                templateUrl: 'view//menu/menu.html',
                controller: 'IndexCtrl'
            } )
            .state( 'splash', {
                url: '/splash',
                cache: 'false',
                templateUrl: 'view/splash/splash.html',
                controller: 'SplashCtrl'
            } )
            .state( 'index.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'view/login/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            } )
            .state( 'index.main', {
                url: '/main',
                views: {
                    'menuContent': {
                        templateUrl: "view/main/main.html",
                        controller: 'MainCtrl'
                    }
                }
            } )
            .state( 'index.setting', {
                url: '/setting/setting',
                views: {
                    'menuContent': {
                        templateUrl: 'view/setting/setting.html',
                        controller: 'SettingCtrl'
                    }
                }
            } )
            .state( 'acceptJob', {
                url: '/acceptjob/search',
                cache: 'false',
                templateUrl: 'view/acceptjob/search.html',
                controller: 'AcceptJobCtrl'
            } )
            .state( 'dailycompleted', {
                url: '/dailycompleted/dailylist',
                cache: 'false',
                templateUrl: 'view/dailycompleted/dailylist.html',
                controller: 'dailycompletedCtrl'
            } )
            .state( 'jobListing', {
                url: '/joblisting/search',
                cache: 'false',
                templateUrl: 'view/joblisting/search.html',
                controller: 'JoblistingCtrl'
            } )
            .state( 'index.update', {
                url: 'updateApp/update/:Version',
                views: {
                    'menuContent': {
                        templateUrl: 'view/updateApp/update.html',
                        controller: 'UpdateCtrl'
                    }
                }
            } )
            .state( 'jobListingList', {
                url: '/joblisting/list',
                cache: 'false',
                templateUrl: 'view/joblisting/list.html',
                controller: 'JoblistingListCtrl'
            } )
            .state( 'jobListingDetail', {
                url: '/joblisting/detail/:BookingNo/:JobNo/:CollectedAmt/:Collected',
                cache: 'false',
                templateUrl: 'view/joblisting/detail.html',
                controller: 'JoblistingDetailCtrl'
            } )

        .state( 'upload', {
            url: '/Upload/:BookingNo/:JobNo',
            templateUrl: 'view/joblisting/Upload.html',
            controller: 'UploadCtrl'
        } )

        .state( 'goDriverCodeCtrl', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'view/login/login.html',
                        controller: 'goDriverCodeCtrl'
                    }
                }
            } )
            .state( 'driverCodeCtrl', {
                url: '/driverCode/driverCode',
                cache: 'false',
                templateUrl: 'view/driverCode/driverCode.html',
                controller: 'driverCodeCtrl'
            } )
            .state( 'jobListingConfirm', {
                url: '/joblisting/confirm/:BookingNo/:JobNo/:CollectedAmt/:Collected',
                cache: 'false',
                templateUrl: 'view/joblisting/confirm.html',
                controller: 'JoblistingConfirmCtrl'
            } )
            .state( 'reports', {
                url: '/reports',
                cache: 'false',
                templateUrl: 'view/reports/list.html',
                controller: 'reportsListCtrl'
            } );
        $urlRouterProvider.otherwise( '/splash' );
        /*
        $ionicFilterBarConfigProvider.theme('calm');
        $ionicFilterBarConfigProvider.clear('ion-close');
        $ionicFilterBarConfigProvider.search('ion-search');
        $ionicFilterBarConfigProvider.backdrop(false);
        $ionicFilterBarConfigProvider.transition('vertical');
        $ionicFilterBarConfigProvider.placeholder('Filter');
        */
  }
] );
app.constant( '$ionicLoadingConfig', {
    template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
} );
