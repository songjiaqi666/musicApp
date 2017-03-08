/**
 * Created by hxsd on 2017/2/27.
 */

(function () {
	const viewW = document.documentElement.clientWidth,
		viewH = document.documentElement.clientHeight,
		oHtml = document.documentElement;
	oHtml.style.fontSize = viewW / 7.2 + 'px';
})();

const app = angular.module('myApp', ['ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state("index", {
			url: "/index",
			abstract: true,
			views: {
				"home": {
					templateUrl: "templates/index.html",
				}
			}
		})
		.state("play", {
			url: "/play",
			views: {
				"play": {
					templateUrl: "templates/play.html",
					controller: "playCtrl"
				}
			}
		})
		.state("index.home", {
			url: "/home",
			views: {
				"findMusic": {
					templateUrl: "templates/home.html",
					controller: "homeCtrl"
				}
			}
		})
		.state("listDetail", {
			url: "/listDetail",
			params: {
				"id": null,
				"cover": null
			},
			views: {
				"listDetail": {
					templateUrl: "templates/listDetail.html",
					controller: "listDetailCtrl"
				}
			}
		})
		.state("index.list", {
			url: "/list",
			views: {
				"list": {
					templateUrl: "templates/list.html",
					controller: "homeCtrl"
				}
			}
		});
	$urlRouterProvider.otherwise("/index/home");
});

app.controller('indexCtrl', function ($scope, $rootScope) {
	$rootScope.musicJson = '';
	const player = document.getElementById('player');
	$scope.playBtn = 'image/playbar_btn_play.png';
	$rootScope.isPlaying = false;
	$scope.switchIcon = function (newPlay) {
		if (newPlay) {
			$rootScope.isPlaying = false;
		}
		$rootScope.isPlaying ? player.pause() : player.play();
		$rootScope.isPlaying = !$rootScope.isPlaying;
		$scope.playBtn = $rootScope.isPlaying ? 'image/playbar_btn_pause.png' : 'image/playbar_btn_play.png';
		$rootScope.playPagePlayBtn = $rootScope.isPlaying ? 'image/pause_hover.png' : 'image/play.png';
	};
	
	$rootScope.goBack = function () {
		history.back();
	};
	
	$scope.nowIsPlay = function () {
		$rootScope.isPlayPage = !$rootScope.isPlayPage;
		$rootScope.goBack();
	};
	
	$scope.tabsView = [{
		isActive: true,
		title: '发现',
		sref: 'index.home'
	}, {
		isActive: false,
		title: '歌单',
		sref: 'index.list'
	}, {
		isActive: false,
		title: '排行榜',
		sref: 'index.rank'
	}, {
		isActive: false,
		title: '电台',
		sref: 'index.radio'
	}];
	$scope.changeTab = function (index) {
		angular.forEach($scope.tabsView, function (item) {
			item.isActive = false;
		});
		$scope.tabsView[index].isActive = true;
	}
});

app.controller('homeCtrl', function ($scope, $http, $sce) {
	const url = 'http://musicapi.duapp.com/api.php?type=topPlayList&offset=0&limit=6';
	$sce.trustAsResourceUrl(url);
	$http.get(url).success(function (data) {
		$scope.songlist = data.playlists;
	}).error(function (e) {
		console.log(e)
	})
});

app.controller('listCtrl', function ($scope, $http, $sce) {
	const url = 'http://musicapi.duapp.com/api.php?type=topPlayList&cat=%E5%85%A8%E9%83%A8&offset=0&limit=6';
	$sce.trustAsResourceUrl(url);
	$http.get(url).success(function (data) {
		$scope.songlist = data.playlists;
	});
});

app.controller('playCtrl', function ($scope, $rootScope) {

});

app.controller('listDetailCtrl', function ($scope, $stateParams, $http, $sce, $rootScope) {
	let url = 'https://api.imjad.cn/cloudmusic/?type=playlist&id=' + $stateParams.id;
	$sce.trustAsResourceUrl(url);
	$scope.cover = $stateParams.cover;
	$http.get(url).success(function (data) {
		$scope.data = data.playlist;
	});
	
	$scope.getMusic = function (id, item) {
		$rootScope.musicJson = item;
		let getMusic = 'http://musicapi.duapp.com/api.php?type=url&id=' + id;
		$sce.trustAsResourceUrl(getMusic);
		$http.get(getMusic).success(function (json) {
			player.src = json.data[0]['url'];
			player.load();
			player.play();
			$scope.switchIcon(true);
		})
	}
});