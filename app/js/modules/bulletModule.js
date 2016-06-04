spaceship.module("bulletModule", [
    "$module", "gameData", "$renderer", "$imageLoader", "$sprite", "$input", "$keys",
    function ($module, gameData, $renderer, $imageLoader, $sprite, $input, $keys) {
        return function (pos) {
            var _spriteSheet;
            const _pos = pos,
                _size = {
                    width: 11,
                    height: 19.2
                };
            this.load = function (next) {
                $imageLoader.loadImages({
                    bullet: "/img/sprites/bullet.png"
                }, function (images) {
                    _spriteSheet = $sprite.create(images.bullet, {
                        height: images.bullet.height,
                        width: images.bullet.width,
                        sprites: [
                            { name: "bullet", x: 0, y: 0 }
                        ]
                    });
                    next();
                });
            };
            this.update = function () {
                const _speed = 15 * gameData.level;
                _pos.y -= _speed;
                if (_pos.y < -(_size.height))
                    $module.unload(this);
                    
            };
            this.render = function () {
                $renderer.renderSprite(_spriteSheet, "bullet", _pos, _size);
            };
            this.pos = _pos;
            this.size = _size;
        };
    }]);