spaceship.module("scoreModule", [
    "gameData", "$renderer", "randomService",
    function (gameData, $renderer, randomService) {
        return function () {
            const _pos = {
              x: 80,
              y: 50
            };
            this.load = function (next) {
                next();
            };
            this.update = function () {
            };
            this.render = function () {
                $renderer.fromLayer(3).renderText("Score: " + gameData.points,{
                    font: "20px Verdana",
                    color: "red",
                    pos: _pos
                });
            };
        };
    }]);