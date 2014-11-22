var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    through = require('through'),
    filesize = require('file-size');

function browserify(file, options) {
  var source = [];

  function write(data) {
    source.push(data);
  };

  function end(file, options) {
    var renderTemplate = function(options, stats) {
      var si = options.size.representation === 'si',
          computedSize = filesize(stats.size, {
            fixed: options.size.decimals,
            spacer: options.size.spacer
          }),
          jsonOptions = JSON.stringify(options),
          jsonStats = JSON.stringify(stats),
          prettySize = (options.size.unit === 'human') ?
            computedSize.human({ si: si }) :
            computedSize.to(options.size.unit, si),
          template = options.output.file.template;

      return template.replace('%file%', path.basename(file))
                    .replace('%fullname%', file)
                    .replace('%size%', prettySize)
                    .replace('%stats%', jsonStats)
                    .replace('%atime%', stats.atime)
                    .replace('%mtime%', stats.mtime)
                    .replace('%unit%', options.size.unit)
                    .replace('%decimals%', options.size.decimals)
                    .replace('%options%', jsonOptions);
    };

    var fileStat = function(err, stats) {
      if (err) {
        console.error('Failure to extract file stats', file, err);
        return;
      }

      if (options.output.file) {
        var result = '',
            prependHeader = renderTemplate(options, stats);
        try {
          result = [prependHeader, source.join('')].join('');
        } catch (error) {
          error.message += ' in "' + file + '"';
          this.emit('error', error);
        }

        this.queue(result);
        this.queue(null);
      }
    }.bind(this);

    fs.stat(file, fileStat);
  }

  return (function transform(file, options) {
    var options = _.extend({
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

    return through(_.partial(write), _.partial(end, file, options));
  })(file, options);
};

module.exports = {
  browserify: browserify 
};
