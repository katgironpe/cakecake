// Generated by CoffeeScript 1.3.3
(function() {
  var $, AppData, Art, Ball, Builder, Collision, Editor, Entity, Game, Grid, ImageLoader, Keyboard, Level, Level2, Level3, Pad, Sprite, Text, World,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Art = (function() {

    function Art() {}

    Art.offset_x = 0;

    Art.offset_y = 0;

    Art._scale = 1;

    Art.get_alpha = function() {
      return Game.context.globalAlpha;
    };

    Art.alpha = function(alpha) {
      return Game.context.globalAlpha = alpha;
    };

    Art.color = function(color) {
      Game.context.fillStyle = color;
      return Game.context.strokeStyle = color;
    };

    Art.fill_color = function(color) {
      return Game.context.fillStyle = color;
    };

    Art.stroke_color = function(color) {
      return Game.context.strokeStyle = color;
    };

    Art.lineC = function(x, y, x2, y2) {
      Game.context.beginPath();
      Game.context.moveTo(x + 0.5, y + 0.5);
      Game.context.lineTo(x2 + 0.5, y2 + 0.5);
      return Game.context.stroke();
    };

    Art.line = function(x, y, x2, y2) {
      return Art.lineC(x + Art.offset_x, y + Art.offset_y, x2 + Art.offset_x, y2 + Art.offset_y);
    };

    Art.rectangleC = function(x, y, w, h, filled) {
      if (filled == null) {
        filled = false;
      }
      if (filled === true) {
        return Game.context.fillRect(x, y, w, h);
      } else {
        return Game.context.strokeRect(x, y, w, h);
      }
    };

    Art.rectangle = function(x, y, w, h, filled) {
      if (filled == null) {
        filled = false;
      }
      return Art.rectangleC(x + Art.offset_x, y + Art.offset_y, w, h, filled);
    };

    return Art;

  })();

  Collision = (function() {

    function Collision() {}

    Collision.prototype.world = null;

    Collision.check = function(type1, type2, x, y) {
      var e, o1, o2, objects1, objects2, _i, _j, _k, _len, _len1, _len2, _ref;
      if (!this.world) {
        this.world = Game.worlds[0];
      }
      objects1 = [];
      objects2 = [];
      if (typeof type1 === 'object') {
        objects1.push(type1);
      }
      if (typeof type2 === 'object') {
        objects2.push(type2);
      }
      _ref = this.world.all_entities();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.name === type1 || e.types.indexOf(type1) !== -1) {
          objects1.push(e);
        }
        if (e.name === type2 || e.types.indexOf(type2) !== -1) {
          objects2.push(e);
        }
      }
      for (_j = 0, _len1 = objects1.length; _j < _len1; _j++) {
        o1 = objects1[_j];
        for (_k = 0, _len2 = objects2.length; _k < _len2; _k++) {
          o2 = objects2[_k];
          if (((o1.x + x <= o2.x && o1.x + x + o1.w > o2.x) || (o1.x + x >= o2.x && o1.x + x < o2.x + o2.w)) && ((o1.y + y <= o2.y && o1.y + y + o1.h > o2.y) || (o1.y + y >= o2.y && o1.y + y < o2.y + o2.h))) {
            return [o1, o2];
          }
        }
      }
      return false;
    };

    return Collision;

  })();

  Entity = (function() {

    function Entity() {}

    Entity.prototype.x = 0;

    Entity.prototype.y = 0;

    Entity.prototype.sx = 0;

    Entity.prototype.sy = 0;

    Entity.prototype.w = void 0;

    Entity.prototype.h = void 0;

    Entity.prototype.r = 0;

    Entity.prototype.visible = true;

    Entity.prototype.name = null;

    Entity.prototype.scale_x = 1;

    Entity.prototype.scale_y = 1;

    Entity.prototype.offset_x = 0;

    Entity.prototype.offset_y = 0;

    Entity.prototype.alpha = 1;

    Entity.prototype.rotation = 0;

    Entity.prototype.index = 1;

    Entity.prototype.sprite = null;

    Entity.prototype.world = null;

    Entity.prototype.z = 0;

    Entity.prototype.draw = function() {
      if (this.sprite) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        return this.sprite.draw();
      }
    };

    Entity.prototype.init = function() {
      return null;
    };

    Entity.prototype.step = function() {
      return null;
    };

    Entity.prototype.move_towards = function(x, y, speed) {
      var dir;
      dir = this.direction_to(x, y);
      this.x += Math.cos(dir / 180 * Math.PI) * speed;
      return this.y -= Math.sin(dir / 180 * Math.PI) * speed;
    };

    Entity.prototype.direction_to = function(x, y) {
      var dx, dy;
      dx = x - this.x;
      dy = y - this.y;
      return -Math.atan2(dy, dx) * 180 / Math.PI;
    };

    Entity.prototype.nearest = function(c) {
      var distance, e, nearest, shortest, _i, _len, _ref;
      shortest = 9999;
      nearest = null;
      _ref = this.world.all_entities();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.name === c && e !== this) {
          distance = this.objects_distance(this, e);
          if (distance < shortest) {
            nearest = e;
            shortest = distance;
          }
        }
      }
      return nearest;
    };

    Entity.prototype.hit = function(c) {
      var e, _i, _len, _ref;
      _ref = this.world.all_entities();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.name === c) {
          if (this.objects_touch(this, e)) {
            return e;
          }
        }
      }
      return null;
    };

    Entity.prototype.hits = function(c) {
      var e, res, _i, _len, _ref;
      res = [];
      _ref = this.world.all_entities();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        if (e.name === c) {
          if (this.objects_touch(this, e)) {
            res.push(e);
          }
        }
      }
      return res;
    };

    Entity.prototype.objects_touch = function(obj1, obj2) {
      return this.objects_distance(obj1, obj2) <= obj1.r + obj2.r;
    };

    Entity.prototype.objects_distance = function(obj1, obj2) {
      return this.points_distance(obj1.x, obj1.y, obj2.x, obj2.y);
    };

    Entity.prototype.points_distance = function(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    Entity.prototype.destroy = function() {
      return this.world.destroy(this);
    };

    Entity.prototype.reset = function() {
      this.x = this.sx;
      return this.y = this.sy;
    };

    Entity.prototype.mouse_hits = function() {
      return Keyboard.MOUSE_X > this.x - this.w / 2 && Keyboard.MOUSE_X < this.x + this.w / 2 && Keyboard.MOUSE_Y > this.y - this.h / 2 && Keyboard.MOUSE_Y < this.y + this.h / 2;
    };

    return Entity;

  })();

  Game = (function() {

    function Game() {}

    Game.context = null;

    Game.worlds = [];

    Game.images = {};

    Game.zoom_level = 1;

    Game.pause = false;

    Game.editor = null;

    Game.mode = "";

    Game.add_world = function() {
      return Game.worlds.push(new World);
    };

    Game.init = function(mode) {
      var i;
      this.mode = mode;
      Game.context = Game.create_canvas();
      Game.set_zoom(AppData.scale);
      Game.setup_keyboard();
      i = new ImageLoader();
      i.onload = Game.start;
      return i.load_images();
    };

    Game.start = function() {
      Game.add_world();
      if (Game.mode === "build") {
        Game.editor = new Editor(Game.worlds[0]);
      }
      return setInterval(Game.run, 16);
    };

    Game.set_zoom = function(rate) {
      Game.context.scale(rate / Game.zoom_level, rate / Game.zoom_level);
      return Game.zoom_level = rate;
    };

    Game.create_canvas = function() {
      var canvas, context;
      canvas = document.createElement("canvas");
      canvas.width = AppData.width * AppData.scale;
      canvas.height = AppData.height * AppData.scale;
      $("#game").append(canvas);
      context = canvas.getContext("2d");
      context.textBaseline = 'top';
      context.imageSmoothingEnabled = false;
      context.mozImageSmoothingEnabled = false;
      context.webkitImageSmoothingEnabled = false;
      return context;
    };

    Game.setup_keyboard = function() {
      var _this = this;
      $("body").keydown(function(e) {
        return Keyboard.key_pressed(e.keyCode);
      });
      $("body").keyup(function(e) {
        return Keyboard.key_released(e.keyCode);
      });
      $("#game").mousemove(Keyboard.mouse_move);
      $("#game").mousedown(Keyboard.mouse_down);
      $("#game").mouseup(Keyboard.mouse_up);
      return $("#game").bind("contextmenu", function(e) {
        return false;
      });
    };

    Game.run = function() {
      var world, _i, _len, _ref;
      _ref = Game.worlds;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        world = _ref[_i];
        world.step();
        world.draw();
      }
      if (Game.editor) {
        Game.editor.step();
        return Game.editor.draw();
      }
    };

    return Game;

  }).call(this);

  ImageLoader = (function() {
    var i, images_loaded, images_n;

    images_loaded = 0;

    images_n = 0;

    i = null;

    function ImageLoader() {
      this.image_loaded = __bind(this.image_loaded, this);
      images_n = Object.keys(AppData.sprites).length;
    }

    ImageLoader.prototype.load_images = function() {
      var file, name, _ref, _results;
      _ref = AppData.sprites;
      _results = [];
      for (name in _ref) {
        file = _ref[name];
        _results.push(this.load_image("sprites/" + file, name));
      }
      return _results;
    };

    ImageLoader.prototype.load_image = function(url, name, im) {
      var image,
        _this = this;
      image = new Image;
      image.src = url;
      image.onload = function() {
        return _this.image_loaded(name, image);
      };
      return image;
    };

    ImageLoader.prototype.image_loaded = function(name, image) {
      Game.images[name] = image;
      images_loaded += 1;
      if (images_loaded === images_n) {
        return this.onload();
      }
    };

    return ImageLoader;

  })();

  Keyboard = (function() {

    function Keyboard() {}

    Keyboard._keyCodes = {
      'BACKSPACE': 8,
      'TAB': 9,
      'ENTER': 13,
      'SHIFT': 16,
      'CTRL': 17,
      'ALT': 18,
      'CAPSLOCK': 20,
      'ESCAPE': 27,
      'SPACE': 32,
      'END': 35,
      'HOME': 36,
      'LEFT': 37,
      'UP': 38,
      'RIGHT': 39,
      'DOWN': 40,
      'INSERT': 45,
      'DELETE': 46,
      '0': 48,
      '1': 49,
      '2': 50,
      '3': 51,
      '4': 52,
      '5': 53,
      '6': 54,
      '7': 55,
      '8': 56,
      '9': 57,
      'A': 65,
      'B': 66,
      'C': 67,
      'D': 68,
      'E': 69,
      'F': 70,
      'G': 71,
      'H': 72,
      'I': 73,
      'J': 74,
      'K': 75,
      'L': 76,
      'M': 77,
      'N': 78,
      'O': 79,
      'P': 80,
      'Q': 81,
      'R': 82,
      'S': 83,
      'T': 84,
      'U': 85,
      'V': 86,
      'W': 87,
      'X': 88,
      'Y': 89,
      'Z': 90,
      'MULTIPLY': 106,
      'ADD': 107,
      'SUBTRACT': 109,
      'MOUSE_LEFT': 'MOUSE_LEFT',
      'MOUSE_MIDDLE': 'MOUSE_MIDDLE',
      'MOUSE_RIGHT': 'MOUSE_RIGHT'
    };

    Keyboard._pre_pressed = [];

    Keyboard._pre_released = [];

    Keyboard._pressed = [];

    Keyboard._released = [];

    Keyboard._hold = [];

    Keyboard.key_released = function(c) {
      return Keyboard._pre_released.push(c);
    };

    Keyboard.key_pressed = function(c) {
      return Keyboard._pre_pressed.push(c);
    };

    Keyboard.mouse_down = function(e) {
      switch (e.button) {
        case 0:
          Keyboard._pre_pressed.push('MOUSE_LEFT');
          break;
        case 1:
          Keyboard._pre_pressed.push('MOUSE_MIDDLE');
          break;
        case 2:
          Keyboard._pre_pressed.push('MOUSE_RIGHT');
      }
      return false;
    };

    Keyboard.mouse_up = function(e) {
      switch (e.button) {
        case 0:
          Keyboard._pre_released.push('MOUSE_LEFT');
          break;
        case 1:
          Keyboard._pre_released.push('MOUSE_MIDDLE');
          break;
        case 2:
          Keyboard._pre_released.push('MOUSE_RIGHT');
      }
      return false;
    };

    Keyboard.mouse_move = function(e) {
      Keyboard.MOUSE_XC = e.offsetX / Game.zoom_level;
      Keyboard.MOUSE_YC = e.offsetY / Game.zoom_level;
      Keyboard.MOUSE_X = Keyboard.MOUSE_XC - Art.offset_x;
      return Keyboard.MOUSE_Y = Keyboard.MOUSE_YC - Art.offset_y;
    };

    Keyboard.hold = function(keyName) {
      return Keyboard._hold.indexOf(Keyboard._keyCodes[keyName]) !== -1;
    };

    Keyboard.press = function(keyName) {
      return Keyboard._pressed.indexOf(Keyboard._keyCodes[keyName]) !== -1;
    };

    Keyboard.release = function(keyName) {
      return Keyboard._released.indexOf(Keyboard._keyCodes[keyName]) !== -1;
    };

    Keyboard.step = function() {
      Keyboard._pressed = Keyboard._pre_pressed.splice(0);
      Keyboard._released = Keyboard._pre_released.splice(0);
      Keyboard._hold = Keyboard._hold.concat(Keyboard._pressed);
      Keyboard._hold = Keyboard._hold.diff(Keyboard._released);
      Keyboard._pre_pressed = [];
      return Keyboard._pre_released = [];
    };

    return Keyboard;

  })();

  Sprite = (function() {

    Sprite.prototype.x = 0;

    Sprite.prototype.y = 0;

    Sprite.prototype.visible = true;

    Sprite.prototype.scale_x = 1;

    Sprite.prototype.scale_y = 1;

    Sprite.prototype.alpha = 1;

    Sprite.prototype.rotation = 0;

    Sprite.prototype.index = 1;

    Sprite.prototype.z = 0;

    Sprite.prototype.name = null;

    function Sprite(name, x, y) {
      if (name == null) {
        name = 'PlaceHolder';
      }
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.name = name;
      this.x = x;
      this.y = y;
    }

    Sprite.prototype.draw = function() {
      var image, x, y;
      image = this._get_image();
      x = this.x - image.width / 2 + Art.offset_x;
      y = this.y - image.height / 2 + Art.offset_y;
      if (this.rotation === 0 && this.scale_x === 1 && this.scale_y === 1) {
        return Game.context.drawImage(image, 0, 0, image.width, image.height, x, y, image.width, image.height);
      } else {
        Game.context.save();
        Game.context.translate(x + image.width / 2, y + image.height / 2);
        Game.context.scale(this.scale_x, this.scale_y);
        Game.context.rotate(Math.PI / 180 * (0 - this.rotation));
        Game.context.drawImage(image, 0, 0, image.width, image.height, -image.width / 2, -image.height / 2, image.width, image.height);
        return Game.context.restore();
      }
    };

    Sprite.prototype._get_image = function() {
      var result;
      if (this.index !== 1) {
        result = Game.images[this.name + this.index];
      } else {
        result = Game.images[this.name];
      }
      if (!result) {
        console.log("" + name + " not found.");
        result = Game.images['PlaceHolder'];
      }
      return result;
    };

    return Sprite;

  })();

  Text = (function() {

    Text.prototype.x = 0;

    Text.prototype.y = 0;

    Text.prototype.visible = true;

    Text.prototype.scale_x = 1;

    Text.prototype.scale_y = 1;

    Text.prototype.alpha = 1;

    Text.prototype.rotation = 0;

    Text.prototype.index = 1;

    Text.prototype.z = 0;

    Text.prototype.name = null;

    Text.prototype.font = 'Dosis';

    Text.prototype.font_size = 16;

    Text.prototype.font_style = "";

    Text.prototype.string = '';

    function Text(string, x, y) {
      if (string == null) {
        string = '';
      }
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      this.string = string;
      this.x = x;
      this.y = y;
    }

    Text.prototype.draw = function() {
      this._update();
      if (this.rotation !== 0) {
        Game.context.save();
        Game.context.translate(this.x + this.get_width() / 2, this.y + this.get_height() / 2);
        Game.context.rotate(Math.PI / 180 * this.rotation);
        Game.context.fillText(this.string, -this.get_width() / 2, -this.get_height() / 2);
        return Game.context.restore();
      } else {
        return Game.context.fillText(this.string, this.x, this.y);
      }
    };

    Text.prototype.get_width = function() {
      this._update();
      return Game.context.measureText(this.string).width;
    };

    Text.prototype.get_height = function() {
      return this.font_size;
    };

    Text.prototype._update = function() {
      return Game.context.font = this.font_style + " " + this.font_size + " " + this.font;
    };

    return Text;

  })();

  Array.prototype.remove = function(e) {
    var t, _ref;
    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(_ref = [])), _ref);
    }
  };

  Array.prototype.diff = function(a) {
    return this.filter(function(i) {
      return !(a.indexOf(i) > -1);
    });
  };

  Array.prototype.copy = function() {
    return this.slice(0);
  };

  Math.sign = function(n) {
    return (n > 0 ? 1 : (n < 0 ? -1 : 0));
  };

  Array.prototype.unique = function() {
    return this.sort().filter(function(v, i, o) {
      if (i && v !== o[i - 1]) {
        return v;
      } else {
        return 0;
      }
    });
  };

  Array.prototype.deepToString = function() {
    var i, result, _i, _ref;
    result = "[";
    for (i = _i = 0, _ref = this.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      if (Object.prototype.toString.call(this[i]) === "[object Array]") {
        result += this[i].deepToString();
      } else if (this[i]) {
        result += this[i];
      }
      if (i !== this.length - 1) {
        result += ",";
      }
    }
    return result + "]";
  };

  World = (function() {

    World.prototype._entities = [];

    World.prototype._entities_to_destroy = [];

    World.prototype.x = 0;

    World.prototype.y = 0;

    World.prototype.pause = false;

    function World() {
      this.reset();
    }

    World.prototype.load_level = function(name) {
      var key, level, value, _ref, _results;
      level = AppData.levels[name];
      _ref = level.data;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this.spawn(value.name, value.x, value.y));
      }
      return _results;
    };

    World.prototype.destroy_all = function() {
      var e, temp, _i, _len, _results;
      temp = this._entities.slice(0);
      _results = [];
      for (_i = 0, _len = temp.length; _i < _len; _i++) {
        e = temp[_i];
        _results.push(this._entities.remove(e));
      }
      return _results;
    };

    World.prototype.reset = function() {
      this.destroy_all();
      return this.load_level('Level');
    };

    World.prototype.all_entities = function() {
      return this._entities;
    };

    World.prototype.destroy = function(entity) {
      return this._entities_to_destroy.push(entity);
    };

    World.prototype._remove_destroyed = function() {
      var e, _i, _len, _ref;
      _ref = this._entities_to_destroy;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        this._entities.remove(e);
      }
      return this._entities_to_destroy = [];
    };

    World.prototype.spawn = function(name, x, y) {
      var entity;
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      entity = new AppData.entities[name];
      entity.world = this;
      entity.sx = x;
      entity.sy = y;
      if (entity.name === null) {
        entity.name = name;
      }
      if (entity.sprite === null) {
        entity.sprite = new Sprite;
        if (!Game.images[name]) {
          name = 'PlaceHolder';
        }
        entity.sprite.name = name;
        entity.w = Game.images[name].width;
        entity.h = Game.images[name].height;
        entity.r = (entity.w + entity.h) / 4;
      }
      this._entities.push(entity);
      entity.reset();
      entity.init();
      return entity;
    };

    World.prototype.number_of = function(c) {
      return this.objectsOfClass(c).length;
    };

    World.prototype.exists = function(c) {
      return this.number_of(c > 0);
    };

    World.prototype.draw = function() {
      var entity, _i, _len, _ref, _results;
      Art.color('#EFF8FB');
      Art.rectangleC(0, 0, AppData.width * AppData.scale / Game.zoom_level, AppData.height * AppData.scale / Game.zoom_level, true);
      Art.color('#000000');
      this._entities.sort(function(a, b) {
        if (Math.sign(a.z - b.z) === 0) {
          return Math.sign(a.y - b.y);
        } else {
          return Math.sign(a.z - b.z);
        }
      });
      _ref = this._entities;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        entity = _ref[_i];
        if (!(entity.visible === true)) {
          continue;
        }
        if (Art.get_alpha() !== 1) {
          Art.alpha(1);
        }
        _results.push(entity.draw());
      }
      return _results;
    };

    World.prototype.step = function() {
      var entity, _i, _len, _ref;
      Keyboard.step();
      if (this.pause === false) {
        _ref = this._entities;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          entity = _ref[_i];
          if (typeof entity.step === "function") {
            entity.step();
          }
        }
      }
      return this._remove_destroyed();
    };

    return World;

  })();

  Ball = (function(_super) {

    __extends(Ball, _super);

    function Ball() {
      return Ball.__super__.constructor.apply(this, arguments);
    }

    Ball.prototype.speed = 4;

    Ball.prototype.hdir = 0;

    Ball.prototype.vdir = 0;

    Ball.prototype.init = function() {
      this.hdir = Math.random() * 360;
      return this.vdir = Math.random() * 360;
    };

    Ball.prototype.step = function() {
      this.move_in_direction(this.hdir, this.vdir, this.speed);
      this.outside();
      return this.hit_pad();
    };

    Ball.prototype.hit_pad = function() {
      var hit;
      hit = this.hit('Pad');
      if (hit) {
        return this.vdir = -Math.abs(this.vdir);
      }
    };

    Ball.prototype.move_in_direction = function(hdir, vdir, speed) {
      this.x += Math.cos(hdir / 180 * Math.PI);
      return this.y -= Math.sin(vdir / 180 * Math.PI);
    };

    Ball.prototype.outside = function() {
      if (this.x < this.r) {
        this.hdir = 180 - this.hdir;
      }
      if (this.x > 320 - this.r) {
        this.hdir = 180 - this.hdir;
      }
      if (this.y < this.r) {
        this.vdir = -this.vdir;
      }
      if (this.y > 240) {
        return this.destroy();
      }
    };

    return Ball;

  })(Entity);

  Pad = (function(_super) {

    __extends(Pad, _super);

    function Pad() {
      return Pad.__super__.constructor.apply(this, arguments);
    }

    Pad.prototype.speed = 4;

    Pad.prototype.step = function() {
      if (Keyboard.hold('LEFT')) {
        if (this.x > this.w / 2) {
          this.x -= this.speed;
        }
      }
      if (Keyboard.hold('RIGHT')) {
        if (this.x < 320 - this.w / 2) {
          return this.x += this.speed;
        }
      }
    };

    return Pad;

  })(Entity);

  Level = (function() {

    function Level() {}

    Level.data = {
      1: {
        name: 'Ball',
        x: 251.5,
        y: 104.5
      },
      2: {
        name: 'Ball',
        x: 121,
        y: 112.5
      },
      3: {
        name: 'Ball',
        x: 187,
        y: 115.5
      },
      4: {
        name: 'Ball',
        x: 263,
        y: 141
      },
      5: {
        name: 'Ball',
        x: 74.5,
        y: 144
      },
      6: {
        name: 'Ball',
        x: 188.5,
        y: 148
      },
      7: {
        name: 'Ball',
        x: 121,
        y: 148
      },
      8: {
        name: 'Ball',
        x: 210.5,
        y: 183.5
      },
      9: {
        name: 'Pad',
        x: 140,
        y: 217
      }
    };

    return Level;

  })();

  Level2 = (function() {

    function Level2() {}

    Level2.data = {
      1: {
        name: 'Skull',
        x: 200,
        y: 53
      }
    };

    return Level2;

  })();

  Level3 = (function() {

    function Level3() {}

    Level3.data = {
      1: {
        name: 'Hero',
        x: '238',
        y: '103'
      },
      2: {
        name: 'Hero',
        x: '233.5',
        y: '151.5'
      },
      3: {
        name: 'Hero',
        x: '163',
        y: '124.5'
      },
      4: {
        name: 'Hero',
        x: '96',
        y: '94.5'
      },
      5: {
        name: 'Hero',
        x: '146.5',
        y: '36.5'
      },
      6: {
        name: 'Skull',
        x: '101',
        y: '163'
      }
    };

    return Level3;

  })();

  Builder = (function() {

    Builder.prototype.active = true;

    Builder.prototype.hold = false;

    Builder.prototype.entity = null;

    Builder.prototype.world = null;

    Builder.prototype.grid = null;

    Builder.prototype.editor = null;

    function Builder(editor) {
      this.editor = editor;
      this.world = Game.worlds[0];
    }

    Builder.prototype.output_level = function(name) {
      var e, i, level, n, txt, _i;
      txt = "class " + name + "\n  @data:\n";
      level = AppData.levels[name];
      n = Object.keys(level.data).length;
      for (i = _i = 1; 1 <= n ? _i <= n : _i >= n; i = 1 <= n ? ++_i : --_i) {
        e = level.data[i];
        txt += "    " + i + ":\n";
        txt += "      name: '" + e.name + "'\n";
        txt += "      x: " + e.x + "\n";
        txt += "      y: " + e.y + "\n";
      }
      return txt;
    };

    Builder.prototype.save_level = function(name) {
      var e, i, level, o, _i, _len, _ref, _results;
      i = 1;
      level = AppData.levels[name];
      level.data = new Object();
      _ref = this.world.all_entities();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        e = _ref[_i];
        o = new Object();
        o.name = e.name;
        o.x = e.sx;
        o.y = e.sy;
        level.data[i] = o;
        _results.push(i += 1);
      }
      return _results;
    };

    Builder.prototype.step = function() {
      var e, temp_all_entities, _i, _len;
      if (!this.grid) {
        this.grid = Game.editor.grid;
      }
      if (!this.active) {
        return;
      }
      if (Keyboard.press('MOUSE_LEFT')) {
        this.hold = this.world.spawn(this.entity, Keyboard.MOUSE_X, Keyboard.MOUSE_Y);
      }
      if (this.hold) {
        if (!Game.pause) {
          this.editor.set_pause(true);
        }
        this.hold.x = Keyboard.MOUSE_X;
        this.hold.y = Keyboard.MOUSE_Y;
        if (Keyboard.hold('SHIFT') && this.grid) {
          this.hold.x = this.hold.x - this.hold.x % this.grid.width + this.grid.width / 2;
          this.hold.y = this.hold.y - this.hold.y % this.grid.height + this.grid.height / 2;
        }
        this.hold.sx = this.hold.x;
        this.hold.sy = this.hold.y;
      }
      if (Keyboard.release('MOUSE_LEFT')) {
        this.save_level(this.editor.level);
        this.hold = null;
      }
      if (Keyboard.hold('MOUSE_RIGHT')) {
        this.editor.set_pause(true);
        temp_all_entities = this.world.all_entities().slice(0);
        for (_i = 0, _len = temp_all_entities.length; _i < _len; _i++) {
          e = temp_all_entities[_i];
          if (e.mouse_hits()) {
            e.destroy();
          }
        }
        return this.save_level(this.editor.level);
      }
    };

    return Builder;

  })();

  Editor = (function() {

    Editor.prototype.grid = null;

    Editor.prototype.builder = null;

    Editor.prototype.world = null;

    Editor.prototype.level = '';

    Editor.prototype.entity_selector = null;

    Editor.prototype.pause_button = null;

    Editor.prototype.grid_x_button = null;

    Editor.prototype.grid_y_button = null;

    Editor.prototype.grid_width_button = null;

    Editor.prototype.grid_height_button = null;

    Editor.prototype.grid_toggle_button = null;

    function Editor(world) {
      this.set_pause = __bind(this.set_pause, this);

      this.toggle_pause = __bind(this.toggle_pause, this);

      this.toggle_grid = __bind(this.toggle_grid, this);

      this.grid_move = __bind(this.grid_move, this);

      this.entity_change = __bind(this.entity_change, this);

      this.save = __bind(this.save, this);

      this.save_type_change = __bind(this.save_type_change, this);

      this.level_change = __bind(this.level_change, this);
      this.world = world;
      this.builder = new Builder(this);
      this.grid = new Grid;
      this.level_selector = $("#level_selector");
      this.level_selector.change(this.level_change);
      this.level_change();
      this.save_type_selector = $("#save_type_selector");
      this.save_type_selector.change(this.save_type_selector);
      this.save_button = $("#save_button");
      this.save_button.click(this.save);
      this.entity_selector = $("#entity_selector");
      this.entity_selector.change(this.entity_change);
      this.entity_change();
      this.pause_button = $("#pause_toggle");
      this.pause_button.click(this.toggle_pause);
      this.pause_button.click(this.entity_change);
      this.grid_x_button = $("#grid_x");
      this.grid_y_button = $("#grid_y");
      this.grid_width_button = $("#grid_width");
      this.grid_height_button = $("#grid_height");
      this.grid_toggle_button = $("#grid_toggle");
      this.grid_x_button.change(this.grid_move);
      this.grid_y_button.change(this.grid_move);
      this.grid_width_button.change(this.grid_move);
      this.grid_height_button.change(this.grid_move);
      this.grid_toggle_button.click(this.toggle_grid);
    }

    Editor.prototype.step = function() {
      return this.builder.step();
    };

    Editor.prototype.level_change = function() {
      this.level = this.level_selector.val();
      this.world.destroy_all();
      return this.world.load_level(this.level);
    };

    Editor.prototype.save_type_change = function() {
      return this.builder.save_type = this.save_type_selector.val();
    };

    Editor.prototype.save = function() {
      var blob, level, txt;
      level = this.level_selector.val();
      txt = this.builder.output_level(level);
      blob = new Blob([txt], {
        type: 'text/html'
      });
      return saveAs(blob, "" + level + ".coffee");
    };

    Editor.prototype.entity_change = function() {
      return this.builder.entity = this.entity_selector.val();
    };

    Editor.prototype.grid_move = function() {
      this.grid.x = parseInt($("#grid_x").val());
      this.grid.y = parseInt($("#grid_y").val());
      this.grid.width = parseInt($("#grid_width").val());
      return this.grid.height = parseInt($("#grid_height").val());
    };

    Editor.prototype.toggle_grid = function() {
      if (this.grid.visible) {
        return this.grid.visible = false;
      } else {
        return this.grid.visible = true;
      }
    };

    Editor.prototype.toggle_pause = function() {
      return this.set_pause(!Game.pause);
    };

    Editor.prototype.set_pause = function(pause) {
      var world, _i, _len, _ref, _results;
      Game.pause = pause;
      if (pause) {
        this.pause_button.html('Play');
      } else {
        this.pause_button.html('Pause');
      }
      _ref = Game.worlds;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        world = _ref[_i];
        _results.push(world.pause = Game.pause);
      }
      return _results;
    };

    Editor.prototype.draw = function() {
      return this.grid.draw();
    };

    return Editor;

  })();

  Grid = (function() {

    Grid.prototype.sx = 0;

    Grid.prototype.sy = 0;

    Grid.prototype.visible = false;

    Grid.prototype.x = 0;

    Grid.prototype.y = 0;

    Grid.prototype.width = 16;

    Grid.prototype.height = 16;

    Grid.prototype.world_x = 0;

    Grid.prototype.world_y = 0;

    function Grid() {
      this.visible = AppData.grid_on;
    }

    Grid.prototype.draw = function() {
      var i, line_x_n, line_y_n, x, y, _i, _j;
      if (this.visible && this.height > 1 && this.width > 1) {
        Art.stroke_color('Gray');
        Art.alpha(0.5);
        line_x_n = AppData.width / this.width;
        line_y_n = AppData.height / this.height;
        for (i = _i = 0; 0 <= line_x_n ? _i < line_x_n : _i > line_x_n; i = 0 <= line_x_n ? ++_i : --_i) {
          x = this.x + i * this.width;
          Art.lineC(x, this.y, x, this.y + line_y_n * this.height);
        }
        for (i = _j = 0; 0 <= line_y_n ? _j < line_y_n : _j > line_y_n; i = 0 <= line_y_n ? ++_j : --_j) {
          y = this.y + i * this.height;
          Art.lineC(this.x, y, this.x + line_x_n * this.width, y);
        }
        return Art.alpha(1);
      }
    };

    return Grid;

  })();

  $ = Zepto;

  $(function() {
    return Game.init('build');
  });

  AppData = (function() {

    function AppData() {}

    AppData.game_name = "breakout";

    AppData.width = 320;

    AppData.height = 240;

    AppData.scale = 2;

    AppData.grid_on = false;

    AppData.entities = {
      'Ball': Ball,
      'Pad': Pad
    };

    AppData.sprites = {
      'Ball': 'Ball.png',
      'Brick': 'Brick.png',
      'Pad': 'Pad.png',
      'PlaceHolder': 'PlaceHolder.png'
    };

    AppData.levels = {
      'Level': Level,
      'Level2': Level2,
      'Level3': Level3
    };

    return AppData;

  })();

}).call(this);