spaceship.module("meteorModule", [
    "$game","$state","gameData", "$collision", "$pos", "$renderer", "animationService", "randomService", "$imageLoader", "$sprite", "$module",
    function ($game, $state,gameData, $collision, $pos, $renderer, animationService, randomService, $imageLoader, $sprite, $module) {
        return function () {
            var _spriteSheet;
            const _config = $game.getConfig();
            const meteorObj = this;
            meteorObj.destroyed = false;
            meteorObj.pos = {
                rotate: 0
            };
            meteorObj.size = {
                width: 70,
                height: 70
            };
            meteorObj.load = function (next) {
                $collision.watch("destroyMeteor","meteorModule", "bulletModule", function(meteor, bullet){
                    animationService.explosion($pos.getCenterPoint(meteor.pos, meteor.size));
                    $module.unload([meteor, bullet]);
                    gameData.points+=3 * parseInt(gameData.level, 10);
                });
                $collision.watch("destroyPlayer","meteorModule", "playerModule", function(meteor, player){
                    animationService.explosion($pos.getCenterPoint(player.pos, player.size));
                    $module.unload([meteor, player]);
                    setTimeout(function(){
                        $state.changeTo("gameOverState");
                    }, 500);
                });
                $imageLoader.loadImages({
                    meteor: "img/sprites/meteor.png"
                }, function (images) {
                    _spriteSheet = $sprite.create(images.meteor, {
                        height: images.meteor.height,
                        width: images.meteor.width,
                        sprites: [
                            { name: "meteor", x: 0, y: 0 }
                        ]
                    });
                    meteorObj.pos.x = randomService.randomRange(0, _config.size.width - meteorObj.size.width);
                    meteorObj.pos.y = -(meteorObj.size.height);
                    next();
                });
            };
            meteorObj.update = function () {
                const _speed = 10 * gameData.level;
                if (meteorObj.pos.y > _config.size.height)
                    $module.unload(meteorObj);
                meteorObj.pos.y += _speed;
                meteorObj.pos.rotate += _speed;
            };
            meteorObj.render = function () {
                $renderer.renderSprite(_spriteSheet, "meteor", meteorObj.pos, meteorObj.size);
            };
        };
    }
]);