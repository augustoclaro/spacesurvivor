spaceship.service("animationService", [
    "$sprite", "$animation", "$imageLoader", "$pos",
    function ($sprite, $animation, $imageLoader, $pos) {
        this.explosion = function (centerPoint) {
            const size = {
                width: 100,
                height: 100
            };
            pos = $pos.fromCenterPoint(centerPoint, size);
            $imageLoader.loadImages({
                explosion: "/img/sprites/explosion.png"
            }, function (images) {
                var sprites = [];
                var x, y;
                for (y = 0; y <= 4; y++)
                    for (x = 0; x <= 4; x++)
                        sprites.push({ name: x + "x" + y, x: x, y: y });
                var _spriteSheet = $sprite.create(images.explosion, {
                    width: 64,
                    height: 64,
                    sprites: sprites
                });
                var frames = [];
                for (y = 0; y <= 4; y++)
                    for (x = 0; x <= 4; x++)
                        frames.push({ sprite: x + "x" + y, time: 10 });
                $animation.animateOnce($animation.create(frames, _spriteSheet, pos, size));
            });
        };
    }]);