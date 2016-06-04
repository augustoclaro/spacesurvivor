spaceship.module("bulletModule", [
    "$module", "gameData", "$renderer", "$input", "$keys",
    function ($module, gameData, $renderer, $input, $keys) {
        return function (pos) {
            var _spriteSheet;
            const _pos = pos,
                _size = {
                    width: 11,
                    height: 19.2
                };
            this.load = function (next) {
                _spriteSheet = gameData.ship.bulletSprite;
                next();
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