spaceship.module("startScreenModule", [
    "$sprite", "$renderer", "$imageLoader",
    function ($sprite, $renderer, $imageLoader) {
        return function () {
            var _wpSprite, _logoSprite;
            const _logoSize = {
                width: 600
            };
            this.load = function (next) {
                $imageLoader.loadImages({
                    wallpaper: "img/sprites/wallpaper.png",
                    logo: "img/sprites/logo.png"
                }, function (images) {
                    _wpSprite = $sprite.create(images.wallpaper, {
                        height: images.wallpaper.height,
                        width: images.wallpaper.width,
                        sprites: [
                            { name: "wallpaper", x: 0, y: 0 }
                        ]
                    });
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
            this.update = function () {
            };
            this.render = function () {
                $renderer.renderSprite(_wpSprite, "wallpaper");
                $renderer.renderSprite(_logoSprite, "logo", {
                    x: 5,
                    y: 20    
                }, _logoSize);
                $renderer.renderText("Use arrows to move", {
                    maxWidth: 300,
                    font: "bold 30px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 250
                    }
                });
                $renderer.renderText("Use space bar to shoot", {
                    maxWidth: 300,
                    font: "bold 30px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 290
                    }
                });
                $renderer.renderText("Press space bar to select and start", {
                    font: "bold 25px Verdana",
                    align: "center",
                    color: "white",
                    pos: {
                        x: 300,
                        y: 550
                    }
                });
            };
        };
    }]);