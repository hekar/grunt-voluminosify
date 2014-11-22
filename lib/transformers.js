var path = require('path'),
    _ = require('lodash'),
    filesize = require('file-size'),
    through = require('through'),
    fs = require('fs');

var Transformers = {
  browserify: function(file, options) {
    var source = '',
        options = _.extend({
          size: {
            unit: 'human',
            decimals: '2',
            spacer: ' ',
            representation: 'si' 
          },
          output: {
            file: {
              template: [
                '',
                '/* =========================== ',
                ' * > File: %file%',
                ' * > Size: %size%',
                ' * > Modified: %mtime%',
                ' * =========================== */',
                ''
              ].join('\n')
            }
          }
        }, options);

    function write(data) {
      source += data;
    };

    function end() {
      var self = this;

      fs.stat(file, function(err, stats) {
        var si = options.size.representation === 'si',
            computedSize = filesize(stats.size, {
              fixed: options.size.decimals,
              spacer: options.size.spacer
            }),
            jsonOptions = JSON.stringify(options),
            jsonStats = JSON.stringify(stats),
            prettySize = (options.size.unit === 'human') ?
              computedSize.human({ si: si }) :
              computedSize.to(options.size.unit, si);

        if (options.output.file) {
          var result = '',
              prependHeader = options.output.file.template
                .replace('%file%', path.basename(file))
                .replace('%fullname%', file)
                .replace('%size%', prettySize)
                .replace('%stats%', jsonStats)
                .replace('%atime%', stats.atime)
                .replace('%mtime%', stats.mtime)
                .replace('%unit%', options.size.unit)
                .replace('%decimals%', options.size.decimals)
                .replace('%options%', jsonOptions);

          try {
            result = [prependHeader, source].join('');
          } catch (error) {
            error.message += ' in "' + file + '"';
            self.emit('error', error);
          }

          self.queue(result);
          self.queue(null);
        }
      });
    }

    return through(write, end);
  }
};


module.exports = Transformers;
