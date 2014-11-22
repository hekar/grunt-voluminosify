# Grunt-Voluminosify

> Transformer for embedding file stats and metrics into Javascript compiled by Browserify 

Designed to work with `grunt-browserify`. Voluminosify simply writes a header to each file required by Browserify. Headers are based on a template specified in the Grunt specification.

## Installation

```
npm install grunt-voluminosify --save-dev
```

### Recommended Configuration

Gruntfile.js (or tasks/config/*.js)
```
  browserify: {
    options: {
      transform: [
        [
          require('grunt-voluminosify').browserify, {
            // Any configuration options you would like to override
          }
        ]
      ]
    },
    app: {
      // Browserify configuration...
      src:  'path/to/source/main.js',
      dest: 'path/to/target/output.js'
    }
  }
```

## Options

#### options.size

##### unit
Type: `String`
Default: 'human'
Choices: 'human', 'TB', 'GB', 'MB', 'KB' or 'B'

##### decimals
Type: `Integer`
Default: 2

##### spacer
Type: `String`
Default: ' '

##### representation
Type: `String`
Default: 'default'
Choices: 'default' or 'si'

#### options.output

##### file.template
See `Templates` below

## Template

The file header can be configuration through a simple template mechanism.

Variables are denoted as %variable% and are simply replaced.
There is current no way to escape the '%' character.

### Example
#### Default
```
/* ===========================
 * > File: %file%
 * > Size: %size%
 * > Modified: %mtime%
 * =========================== */
```

#### Output
```
/* =========================== 
 * > File: SidebarActions.js
 * > Size: 1.58 kB
 * > Modified: Wed Nov 19 2014 03:01:36 GMT+0000 (UTC)
 * =========================== */
```

Use `Ctrl+F -> '> File:<your-file>` to find files in a text editor.


### Configuration

```
  browserify: {
    options: {
      transform: [
        [
          require('grunt-voluminosify').browserify, {
            output: {
              file: {
                template: [
                  '',
                  '/* =========================== ',
                  ' * > This is my template for display file statistics',
                  ' * > File: %file%',
                  ' * > Size: %size%',
                  ' * > Modified: %mtime%',
                  ' * =========================== */',
                  ''
                ].join('\n')
              }
            }
          }
        ]
      ]
    },
    app: {
      // Browserify configuration...
      src:  'path/to/source/main.js',
      dest: 'path/to/target/output.js'
    }
  }
```

### Variables

| Value                                               |  Variable     |
|:----------------------------------------------------|:--------------|
| Filename                                            |  %file%       |
| Full path of the file                               |  %fullname%   |
| Human readable size of file                         |  %size%       |
| Access time of file                                 |  %atime%      |
| Modified time of file                               |  %mtime%      |
| Unit used for human readable size                   |  %unit%       |
| Number of decimals to show in human readable size   |  %decimals%   |
| Options used to generate header (JSON)              |  %options%    |
| Stats of file (JSON)                                |  %stats%      |

## Contributions
Feel free to log issues and/or send a pull request

## TODO
* Create a Grunt task
* Support more than Browserify
* Log to console and/or build logs 

## License
[LICENSE-MIT](./LICENSE-MIT)
