spaceship.module("gameOverScreenModule", [
    "$sprite", "$renderer", "$imageLoader", "gameData",
    function ($sprite, $renderer, $imageLoader, gameData) {
        return function () {
            var _logoSprite;
            const _logoSize = {
                width: 600
            };
            this.load = function (next) {
                $imageLoader.loadImages({
                    logo: "img/sprites/logo.png"
                }, function (images) {
                    _logoSprite = $sprite.create(images.logo, {
                        height: images.logo.height,
                        width: images.logo.width,
                        sprites: [
                            { name: "logo", x: 0, y: 0 }
                        ]
                    });
                    _logoSize.height = images.logo.height / images.logo.width * _logoSize.width;
                    next();
                });
            };
            this.update = function () { };
            this.render = function () {
                var render = $renderer.fromLayer(0);
                render.renderSprite(_logoSprite, "logo", {
                    x: 5,
                    y: 20
                }, _logoSize);
                render.renderText("GAME OVER", {
                    font: "bold 70px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 250
                    }
                });
                render.renderText("SCORE:", {
                    font: "bold 50px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 350
                    }
                });
                render.renderText(gameData.points, {
                    font: "bold 50px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 410
                    }
                });
            };
        };
    }]);