const gamify = (function(){
const Utils = (function () {
    const _allValues = function (obj) {
        const vals = [];
        for (var key in obj)
            vals.push(obj[key]);
        return vals;
    };
    const _isFunction = function (obj) {
        return typeof obj === "function";
    };
    const _extend = function (target) {
        const length = arguments.length;
        if (length < 2 || !target) return target;
        const transferProps = function(source, dest, propName) {
            Object.defineProperty(dest, propName,
                Object.getOwnPropertyDescriptor(source, propName));
        };
        for (var i = 1; i < length; i++) {
            var source = arguments[i];
            var props = Object.getOwnPropertyNames(source);
            for (var x = 0; x < props.length; x++)
                transferProps(source, target, props[x]);
        }
        return target;
    };
    const _inherit = function (SubC, SuperC) {
        var subProto = Object.create(SuperC.prototype);
        _extend(subProto || {}, SubC.prototype || {});
        SubC.prototype = subProto;
    };
    const _pushMany = function(destArr, sourceArr){
        sourceArr.forEach(function(item){
            destArr.push(item);
        });
    };
    const _box = function(mod){
      return {
          x: mod.pos.x,
          y: mod.pos.y,
          w: mod.size.width,
          h: mod.size.height
      };
    };
    const _boxCollision = function(box1, box2){
      return box1.x < box2.x + box2.w &&
              box1.x + box1.w > box2.x &&
              box1.y < box2.y + box2.h &&
              box1.y + box1.h > box2.y;
    };
    return {
        extend: _extend,
        isFunction: _isFunction,
        allValues: _allValues,
        inherit: _inherit,
        pushMany: _pushMany,
        box: _box,
        boxCollision: _boxCollision
    };
})();
const EventEmitter = (function(_){
    const events = {};
    const oEventEmitter = function(){};
    
    oEventEmitter.prototype.on = function(event, fn){
        if (!event)
            throw "Event name can't be null";
        if (!_.isFunction(fn))
            throw "Invalid event function";
        if (!events[event])
            events[event] = [];
        events[event].push(fn);
        return this;
    };
    oEventEmitter.prototype.emit = function(event){
        if (!event)
            throw "Event name can't be null";
        var args = Array.prototype.slice.call(arguments, 1);
        var fns = events[event];
        if (fns && fns.length)
            fns.forEach(function(fn){
                fn.apply(null, args);
            });   
    };
    return oEventEmitter;
})(Utils);
const Animation = (function (_, EventEmitter) {
    const oAnimation = function(frames, spriteSheet, pos, size){
        const animObj = this;
        animObj.id = "anim-" + frames.length + "-" + new Date().getTime();
        animObj.animating = true;
        animObj.frameIndex = 0;
        
        const _frames = frames;
        const _sprideSheet = spriteSheet;
        const _pos = pos;
        const _size = size;
        
        var _frameDuration = frames[0].time;
        var _animated;
        
        const _render = function($renderer){
            $renderer.renderSprite(_sprideSheet,
                                   _frames[animObj.frameIndex].sprite,
                                   _pos,
                                   _size);
        };
        
        const _animate = function (renderer, elapsedTime) {
            if (!animObj.animating) return;
            _render(renderer);
            _frameDuration -= elapsedTime;
            if (_frameDuration <= 0) {
                animObj.frameIndex++;
                if (animObj.frameIndex === _frames.length){
                    animObj.frameIndex = 0;
                    animObj.emit("animated", animObj);
                }
                _frameDuration = _frames[animObj.frameIndex].time;
            }
        };
        
        animObj.render = _render;
        animObj.animate = _animate;
    };
    _.inherit(oAnimation, EventEmitter);
    return oAnimation;
})(Utils, EventEmitter);
const AssignmentObject = function (name, type, dependencies, fn) {
    this.name = name;
    this.type = type;
    this.dependencies = dependencies;
    this.fn = fn;
};
const AsyncLoop = (function (_) {
    var _arr, _current, _last, _action, _callback;
    const _execute = function () {
        _action(_arr[_current], function () {
            _current++;
            if (_current < _last)
                _execute();
            else if (_.isFunction(_callback))
                _callback();
        });
    };
    const _asyncLoop = function (array, action, cb) {
        if (!Array.isArray(array) || !array.length) return;
        if (!_.isFunction(action)) return;
        _arr = array;
        _current = 0;
        _last = array.length;
        _action = action;
        _callback = cb;
        _execute();
    };
    return _asyncLoop;
})(Utils);
const Canvas = (function () {
    const _clear = function () {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    };
    const _getElement = function () {
        return this.element;
    };
    const _getContext = function () {
        return this.context;
    };

    const _transferTo = function (canvasTo) {
        var _imgData = this.context.getImageData(0, 0, this.element.width, this.element.height);
        canvasTo.getContext().putImageData(_imgData, 0, 0, 0, 0, this.element.width, this.element.height);
    };

    const _canvas = function (id, size) {
        this.element = document.createElement("canvas");
        if (id)
            this.element.setAttribute("id", id);
        this.element.setAttribute("width", size.width);
        this.element.setAttribute("height", size.height);
        this.context = this.element.getContext("2d");
    };
    _canvas.prototype = {
        clear: _clear,
        getElement: _getElement,
        getContext: _getContext,
        transferTo: _transferTo
    };
    return _canvas;
})();
const Constants = (function () {
    const _keys = {
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40,
        A: 65,
        W: 87,
        D: 68,
        S: 83,
        SPACE: 32
    };
    const _directions = {
        left: "l",
        up: "u",
        right: "r",
        down: "d"
    };
    const _directionKeys = [
        _keys.ARROW_LEFT,
        _keys.ARROW_UP,
        _keys.ARROW_RIGHT,
        _keys.ARROW_DOWN,
        _keys.A,
        _keys.W,
        _keys.D,
        _keys.S
    ];
    return {
        keys: _keys,
        directions: _directions,
        directionKeys: _directionKeys
    };
})();
const FrameTimer = function () {
    this.lastTick = new Date().getTime();
    this.getElapsedTicks = function () {
        return this.frameSpacing || 0;
    };
    this.tick = function (expectedInterval) {
        const _currentTick = new Date().getTime();
        this.frameSpacing = _currentTick - this.lastTick;
        this.lastTick = _currentTick;
        if (expectedInterval)
            this.lastTick -= this.frameSpacing % expectedInterval;
    };
};
const ImageLoader = (function (_) {
    const _images = {};
    const _loadImages = function (images, cb) {
        const _results = {};
        const _checkFinish = function () {
            if (Object.keys(_results).length === Object.keys(images).length && _.isFunction(cb))
                cb(_results);
        };
        const imgLoaded = function () {
            _images[this.alt] = _results[this.alt] = this;
            _checkFinish();
        };
        for (var _key in images) {
            if (!images.hasOwnProperty(_key))
                continue;
            if (_images.hasOwnProperty(_key)) {
                _results[_key] = _images[_key];
                _checkFinish();
            } else {
                const _img = new Image();
                _img.alt = _key;
                _img.onload = imgLoaded;
                _img.src = images[_key];
            }
        }
    };

    return {
        loadImages: _loadImages
    };
})(Utils);
const InputManager = function (canvas) {
    var _canvas = canvas.getElement();
    var _input;
    this.clearInput = function () {
        _input = {
            leftMouseClick: 0,
            rightMouseClick: 0,
            pressedKeys: []
        };
    };
    this.clearInput();
    this.checkForInput = function () {
        _canvas.onmousedown = function (e) {
            if (e.button === 0)
                _input.leftMouseClick = 1;
            else
                _input.rightMouseClick.leftMouseClick = 1;
        };
        _canvas.onmouseup = function () {
            _input.leftMouseClick = _input.rightMouseClick = 0;
        };
        document.onkeydown = function (e) {
            const _key = e.keyCode || e.which;
            if (_input.pressedKeys.indexOf(_key) === -1)
                _input.pressedKeys.push(_key);
        };
        document.onkeyup = function (e) {
            const _key = e.keyCode || e.which;
            const _i = _input.pressedKeys.indexOf(_key);
            if (_i > -1)
                _input.pressedKeys.splice(_i, 1);
        };
    };
    this.getInput = function () {
        return _input;
    };
};
const ModuleBase = (function(_, EventEmitter){
    var oModuleBase = function(){
        this.loaded = false;
    };
    _.inherit(oModuleBase, EventEmitter);
    return oModuleBase;
})(Utils, EventEmitter);
const Renderer = function (canvasGame, canvasBuffer) {
    if (!canvasGame)
        throw "No game canvas found.";
    if (!canvasBuffer)
        throw "No buffer canvas found.";
    const _ctx = canvasBuffer.getContext();
    this.getContext = function () {
        return _ctx;
    };
    this.render = function (action) {
        canvasBuffer.clear();
        action();
        canvasBuffer.transferTo(canvasGame);
    };
};
const SpriteSheet = function (image, data) {
    var _image = image,
        _width = data.width,
        _height = data.height,
        _margin = data.margin || 0,
        _sprites = data.sprites;
    this.getOffset = function (name) {
        for (var _i = 0; _i < _sprites.length; _i++) {
            const _sprite = _sprites[_i];
            if (_sprite.name === name)
                return {
                    x: _sprite.x * _width + _margin,
                    y: _sprite.y * _height + _margin,
                    width: _width - 2 * _margin,
                    height: _height - 2 * _margin,
                    rotate: _sprite.rotate
                };
        }
        return null;
    };
    this.getImage = function () {
        return _image;
    };
    this.size = {
        width: _width,
        height: _height
    };
};
var TimedFunction = (function (FrameTimer) {
    return function () {
        this.create = function (action, interval) {
            const _timer = new FrameTimer();
            var _duration, _interval = interval;
            return {
                run: function () {
                    if (_duration) _duration -= _timer.getElapsedTicks();
                    else _duration = _interval;

                    if (_duration <= 0) {
                        _duration = 0;
                        action.apply(null, arguments);
                    }
                    _timer.tick();
                },
                setInterval: function(interval){
                    _interval = interval;
                }
            };
        };
    };
})(FrameTimer);
const AnimationInjection = (function (Animation) {
    return function (game) {
        const _stop = function (anim) {
            var i = game.animations.map(function(a){
                return a.id;
            }).indexOf(anim.id);
            if (i < 0)
                throw "Could not found animation " + anim;
            game.animations.splice(i, 1);
        };
        this.create = function (frames, spriteSheet, pos, size) {
            return new Animation(frames, spriteSheet, pos, size);
        };
        this.animateOnce = function (anim) {
            game.animations.push(anim.on("animated", function(a){
                a.animating = false;
            }));
        };
        this.animate = function (anim) {
            game.animations.push(anim);
        };
        this.stop = _stop;
    };
})(Animation);
const CollisionInjection = (function (_) {
    return function (game) {
        const _watch = function (name, mods1, mods2, fn) {
            if (!mods1)
                throw "Watch argument mods1 can't be null";
            if (!mods2)
                throw "Watch argument mods2 can't be null";
            if (!_.isFunction(fn))
                throw "Watch argument fn must be a function";
            if (!Array.isArray(mods1))
                mods1 = [mods1];
            if (!Array.isArray(mods2))
                mods2 = [mods2];
            game.collisionWatchs[name] = {
               modules1: mods1, 
               modules2: mods2,
               callback: fn
            };
        };
        this.watch = _watch;
    };
})(Utils);
const GameInjection = (function () {
    return function (game) {
        this.getConfig = function () {
            return game.config;
        };
    };
})();
var ImageLoaderInjection = (function(imageLoader){
    return function(){
        this.loadImages = imageLoader.loadImages;
    };
})(ImageLoader);
const InputInjection = (function (consts) {
    return function (game) {
        this.pressedKeys = function () {
            var input = game.inputManager.getInput();
            var obj = {
                allKeys: input.pressedKeys
            };
            obj.directionKeys = obj.allKeys.filter(function(k){
               return consts.directionKeys.indexOf(k) > -1;
            });
            return obj;
        };
    };
})(Constants);
const KeysInjection = (function(consts){
    return consts.keys;
})(Constants);
const ModuleInjection = (function (_, ModuleBase) {
    const oModuleInjection = function (game) {
        var _getModuleSafe = function (name) {
            var fn = game.getContainerInstance(name);
            if (!fn)
                throw "Could not find module '" & name & "'";
            return fn;
        };
        this.load = function (modules, cb) {
            if (!Array.isArray(modules))
                modules = [modules];
            modules.forEach(function (m) {
                var mod = typeof m === "string" ?
                    new (_getModuleSafe(m))() :
                    m;
                if (typeof m === "string")
                    mod.type = m;
                _.inherit(mod, ModuleBase);
                game.moduleManager.register(mod);
            });
            game.moduleManager.loadAll(function(){
                if (_.isFunction(cb)) cb();
            });
        };  
        this.unload = function (modules) {
            if (!Array.isArray(modules))
                modules = [modules];
            modules.forEach(function (m) {
                game.moduleManager.unregister(m);
            });
        };
        this.create = function (name) {
            var Fn = _getModuleSafe(name);
            //all args but name
            var args = Array.prototype.slice.call(arguments, 1);
            //adds null to arg list to use bind
            args.unshift(null);
            Fn = Function.prototype.bind.apply(Fn, args);
            var obj = new (Fn)();
            obj.type = name;
            return obj;
        };
    };
    return oModuleInjection;
})(Utils, ModuleBase);
const PosInjection = (function () {
    return function () {
        this.getCenterPoint = function(pos, size){
            return {
                x: pos.x + size.width / 2,
                y: pos.y + size.height / 2  
            };  
        };
        this.fromCenterPoint = function(pos, size){
            return {
                x: pos.x - size.width / 2,
                y: pos.y - size.height / 2  
            };  
        };
    };
})();
const RendererInjection = function (game) {
    var rendererObj = this;
    rendererObj.getContext = function () {
        return game.renderer.getContext();
    };
    rendererObj.renderCircle = function (destPos, radius, color) {
        const _ctx = rendererObj.getContext();
        _ctx.beginPath();
        _ctx.fillStyle = color;
        _ctx.arc(destPos.x, destPos.y, radius, 0, 2 * Math.PI, false);
        _ctx.fill();
        _ctx.closePath();
    };
    rendererObj.renderLine = function (from, to, lineWidth, color) {
        const _ctx = rendererObj.getContext();
        _ctx.beginPath();
        if (color)
            _ctx.strokeStyle = color;
        if (lineWidth)
            _ctx.lineWidth = lineWidth;
        _ctx.moveTo(from.x, from.y);
        _ctx.lineTo(to.x, to.y);
        _ctx.stroke();
        _ctx.closePath();
    };

    rendererObj.fillBG = function (color) {
        const _ctx = rendererObj.getContext();
        _ctx.beginPath();
        _ctx.fillStyle = color;
        _ctx.rect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
        _ctx.fill();
        _ctx.closePath();
    };

    const _drawImageFromCenterPoint = function (img, centerPoint, offset, size, deg) {
        const _ctx = rendererObj.getContext();
        deg = deg || 0;
        var rad = deg * Math.PI / 180;
        _ctx.translate(centerPoint.x, centerPoint.y);
        _ctx.rotate(rad);
        _ctx.drawImage(img,
            offset.x,
            offset.y,
            offset.width,
            offset.height,
            size.width / 2 * -1,
            size.height / 2 * -1,
            size.width,
            size.height);
        _ctx.rotate(rad * -1);
        _ctx.translate(centerPoint.x * -1, centerPoint.y * -1);
    };

    const _getCenterPoint = function (pos, size) {
        return {
            x: pos.x + size.width / 2,
            y: pos.y + size.height / 2
        };
    };

    rendererObj.renderSprite = function (spriteSheet, spriteName, destPos, destSize, fromCenter) {
        const $pos = game.getContainerInstance("$pos");
        destPos = destPos || {
            x: 0,
            y: 0
        };
        const _offset = spriteSheet.getOffset(spriteName);
        destSize = destSize || {
            height: _offset.height,
            width: _offset.width
        };
        const centerPoint = fromCenter ?
            destPos : $pos.getCenterPoint(destPos, destSize);
        _drawImageFromCenterPoint(spriteSheet.getImage(), centerPoint,
            _offset, destSize,
            (_offset.rotate || 0) + (destPos.rotate || 0));
    };

    rendererObj.renderText = function (text, opt) {
        const _ctx = rendererObj.getContext();
        if (opt.font)
            _ctx.font = opt.font;
        if (opt.color)
            _ctx.fillStyle = opt.color;
        if (opt.align)
            _ctx.textAlign = opt.align;
        var maxWidth;
        if (opt.maxWidth)
            maxWidth = opt.maxWidth;
        _ctx.fillText(text, opt.pos.x, opt.pos.y, maxWidth);
    };
};
const SpriteInjection = (function (SpriteSheet) {
    return function () {
        this.create = function (image, data) {
            return new SpriteSheet(image, data);
        };
    };
})(SpriteSheet);
const StateInjection = (function () {
    return function (game) {
        this.changeTo = function (state) {
            game.setState(state);
        };
    };
})();
const TimedFunctionInjection = (function (TimedFunction) {
    return function () {
        const timedFunction = new TimedFunction();
        this.create = function (action, interval) {
            return timedFunction.create(action, interval);
        };
    };
})(TimedFunction);
const ModuleManager = (function (asyncLoop) {
    const _modules = [];
    const _register = function (module) {
        _modules.push(module);
    };
    const _unregister = function (module) {
        _modules.splice(_modules.indexOf(module), 1);
        module.loaded = false;
    };
    const _clear = function (module) {
        _modules.length = 0;
    };
    const _loadAll = function (cb) {
        asyncLoop(_modules, function (module, next) {
            if (!module.loaded)
                module.load(function(){
                    module.loaded = true;
                    next();
                });
            else next();
        }, cb);
    };
    const _renderAll = function () {
        // console.log(_modules.filter(function(m){
        //     return m.type === "playerModule";
        // }));
        _modules.forEach(function (m) {
            if (m.loaded){
                m.update();
                m.render();
            }
        });
    };
    const _getByType = function (type) {
        return _modules.filter(function (m) {
            return m.type === type;
        });
    };
    const _moduleManager = function () { };
    _moduleManager.prototype = {
        register: _register,
        unregister: _unregister,
        clear: _clear,
        loadAll: _loadAll,
        renderAll: _renderAll,
        getByType: _getByType
    };
    return _moduleManager;
})(AsyncLoop);
const GameLoop = (function (FrameTimer, _) {
    const _timer = new FrameTimer();
    var _fps, _action, _running;

    const oGameLoop = function (fps, action) {
        _fps = parseFloat(fps);
        if (_.isFunction(action))
            _action = action;
        else throw "GameLoop parameter must be a function.";
    };

    const _mainLoop = function () {
        const interval = 1000 / _fps;
        if (_running)
            window.requestAnimationFrame(_mainLoop);
        const elapsed = _timer.getElapsedTicks();
        if (elapsed > interval)
            _action(elapsed);
        _timer.tick(interval);
    };

    const _start = function () {
        _running = true;
        _timer.tick();
        _mainLoop();
    };

    const _stop = function () {
        _running = false;
    };

    oGameLoop.prototype = {
        start: _start,
        stop: _stop
    };

    return oGameLoop;
}) (FrameTimer, Utils);
const Game = (function (consts,
    ModuleManager,
    InputManager,
    InputInjection,
    AnimationInjection,
    PosInjection,
    CollisionInjection,
    SpriteInjection,
    ImageLoaderInjection,
    Renderer,
    FrameTimer,
    GameLoop,
    Canvas,
    AssignmentObject,
    GameInjection,
    ModuleInjection,
    RendererInjection,
    TimedFunctionInjection,
    _) {
    const oGame = function (name, config, inheritGames) {
        var gameObj = this;
        const _defaultConfigs = {
            size: {
                width: 500,
                height: 500
            },
            fps: 50,
            canvasId: "game-canvas-" + new Date().getTime()
        };
        const _name = name,
            _config = _.extend(_defaultConfigs, config),
            _services = {},
            _states = {},
            _modules = {},
            _consts = {},
            _container = {};
        inheritGames.forEach(function (game) {
            _.extend(_services, game.services);
            _.extend(_states, game.states);
            _.extend(_modules, game.modules);
            _.extend(_consts, game.consts);
        });

        const _getAssignment = function (name, data, obj, context) {
            if (!name) throw context + " must have a name";
            if (!data || (!Array.isArray(data) && !_.isFunction(data)))
                throw context + " '" & name & "' implementation must be a function or array containing a function.";
            const injections = [];
            var fn = data;
            if (Array.isArray(data)) {
                while (data.length && !_.isFunction(data[0]))
                    injections.push(data.shift());
                if (!data.length || !_.isFunction(data[0]))
                    throw "Last parameter must be a function at " + name;
                fn = data[0];
            }
            if (obj[name])
                throw context + " '" & name & "' exists.";
            obj[name] = new AssignmentObject(name, context, injections, fn);
        };

        const _serviceFn = function (name, data) {
            _getAssignment(name, data, _services, "Service");
        };

        const _stateFn = function (name, data) {
            _getAssignment(name, data, _states, "State");
        };

        const _moduleFn = function (name, data) {
            _getAssignment(name, data, _modules, "Module");
        };

        const _constFn = function (name, data) {
            if (!name) throw "Constant must have a name";
            if (_consts[name])
                throw " '" & name & "' exists.";
            _consts[name] = data;
        };

        var _instantiating;
        const _instantiate = function (assObj, subInstance) {
            if (!subInstance)
                _instantiating = assObj;
            const deps = [];
            assObj.dependencies.forEach(function (dep) {
                if (!_container[dep]) {
                    var depObj = _services[dep] || _states[dep] || _modules[dep];
                    if (!depObj)
                        throw "Could not find dependency '" & dep & "' at '" & assObj.name & "'.";
                    if (depObj === _instantiating)
                        throw "Circular dependency found: '" & _instantiating.name & "' -> '" & dep & "'";
                    _instantiate(depObj, true);
                }
                deps.push(_container[dep]);
            });
            switch (assObj.type) {
                case "Service":
                    deps.unshift(null);
                    _container[assObj.name] = new (Function.prototype.bind.apply(assObj.fn, deps))();
                    break;
                case "State":
                case "Module":
                    _container[assObj.name] = assObj.fn.apply(null, deps);
                    break;
            }
        };

        const _fillContainer = function () {
            _.extend(_container, _consts);
            _container.$game = new GameInjection(gameObj);
            _container.$module = new ModuleInjection(gameObj);
            _container.$renderer = new RendererInjection(gameObj);
            _container.$imageLoader = new ImageLoaderInjection();
            _container.$sprite = new SpriteInjection();
            _container.$input = new InputInjection(gameObj);
            _container.$animation = new AnimationInjection(gameObj);
            _container.$collision = new CollisionInjection(gameObj);
            _container.$state = new StateInjection(gameObj);
            _container.$timedFunction = new TimedFunctionInjection();
            _container.$pos = new PosInjection();
            _container.$keys = consts.keys;
            _.allValues(_services).forEach(_instantiate);
            _.allValues(_states).forEach(_instantiate);
            _.allValues(_modules).forEach(_instantiate);
        };

        var _canvasGame, _canvasBuffer;
        const _setupCanvas = function () {
            _canvasGame = new Canvas(_config.canvasId, _config.size);
            _canvasBuffer = new Canvas("buffer-canvas-" + new Date().getTime(), _config.size);
            var gameElement = document.querySelector("[gmf-app='" + _name + "']");
            if (!gameElement)
                throw "Could not find element to bootstrap game.";
            gameElement.parentNode.replaceChild(_canvasGame.getElement(), gameElement);
        };

        const _moduleManager = new ModuleManager();
        var _currentState;
        const _setState = function (data) {
            if (!data)
                throw "Invalid null argument 'data'.";
            var state = data;
            if (typeof data === "string")
                state = _states[data];
            if (!state)
                throw "Could not find state " + data;
            if (gameObj.inputManager)
                gameObj.inputManager.clearInput();
            _moduleManager.clear();
            gameObj.animations = [];
            gameObj.collisionWatchs = {};
            _currentState = new (_container[state.name])();
        };

        var gameLoop;
        gameObj.animations = [];
        const _timer = new FrameTimer();
        const _updateAnimations = function (renderer) {
            gameObj.animations = gameObj.animations.filter(function (anim) {
                return anim.animating;
            });
            gameObj.animations.forEach(function (anim) {
                anim.animate(renderer, _timer.getElapsedTicks());
            });
        };
        const _getContainerInstance = function (k) {
            return _container[k];
        };

        gameObj.collisionWatchs = {};
        const _checkForCollisions = function () {
            _.allValues(gameObj.collisionWatchs)
                .forEach(function (watch) {
                    const arrModules1 = [];
                    const arrModules2 = [];
                    watch.modules1.forEach(function (mod) {
                        if (typeof mod === "string")
                            _.pushMany(arrModules1, _moduleManager.getByType(mod));
                        else arrModules1.push(mod);
                    });
                    watch.modules2.forEach(function (mod) {
                        if (typeof mod === "string")
                            _.pushMany(arrModules2, _moduleManager.getByType(mod));
                        else arrModules2.push(mod);
                    });
                    arrModules1.forEach(function (mod1) {
                        arrModules2.forEach(function (mod2) {
                            if (mod1.loaded &&
                                mod2.loaded &&
                                _.boxCollision(_.box(mod1), _.box(mod2)))
                                watch.callback(mod1, mod2);
                        });
                    });
                });
        };
        var _stateLoading = false;
        const _startLoop = function () {
            gameObj.renderer = new Renderer(_canvasGame, _canvasBuffer);
            gameObj.inputManager = new InputManager(_canvasGame);
            gameObj.inputManager.checkForInput();
            _timer.tick();
            gameLoop = new GameLoop(_config.fps, function (elapsedTime) {
                const _continue = function () {
                    _currentState.update(function () {
                        gameObj.renderer.render(function () {
                            _checkForCollisions();
                            _moduleManager.renderAll();
                            _timer.tick();
                            _updateAnimations(_getContainerInstance("$renderer"));
                        });
                    });
                };
                if (_currentState.loaded) {
                    if (!_stateLoading)
                        _continue();
                } else {
                    _stateLoading = _currentState.loaded = true;
                    _currentState.load(function () {
                        _stateLoading = false;
                    });
                }
            });
            gameLoop.start();
        };

        const _start = function () {
            _fillContainer();
            _setupCanvas();
            _setState(_config.initialState || _.allValues(_states)[0]);
            _startLoop();
        };

        gameObj.name = _name;
        gameObj.config = _config;
        gameObj.services = _services;
        gameObj.states = _states;
        gameObj.modules = _modules;
        gameObj.consts = _consts;
        gameObj.service = _serviceFn;
        gameObj.state = _stateFn;
        gameObj.module = _moduleFn;
        gameObj.const = _constFn;
        gameObj.start = _start;
        gameObj.getContainerInstance = _getContainerInstance;
        gameObj.moduleManager = _moduleManager;
        gameObj.setState = _setState;
    };
    return oGame;
})(Constants,
    ModuleManager,
    InputManager,
    InputInjection,
    AnimationInjection,
    PosInjection,
    CollisionInjection,
    SpriteInjection,
    ImageLoaderInjection,
    Renderer,
    FrameTimer,
    GameLoop,
    Canvas,
    AssignmentObject,
    GameInjection,
    ModuleInjection,
    RendererInjection,
    TimedFunctionInjection,
    Utils);
const Gamify = (function (Game) {
    const games = {};

    const gameFn = function (name, config, modules) {
        if (config === modules === undefined) {
            const game = games[name];
            if (!game)
                throw "Could not find game import '" + name + "'";
            return game;
        }
        return (games[name] = new Game(name, config, modules));
    };

    return {
        game: gameFn
    };
}) (Game);
    return Gamify;
})();