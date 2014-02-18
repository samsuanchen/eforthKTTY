module.exports = function(grunt) {
  // Project configuration.
  var nw=require('./node_script/grunt-nw');
  var colors = require('colors');
  var tasks = require('./Gruntfile-shared')(grunt);
  var newapp=require('./node_script/newapp');
  var newcomponent=require('./node_script/newcomponent');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    'curl': {
      'node-webkit':{
        src:nw.precompile,
        dest:nw.zip
      },
    },
    'unzip':{
      'node-webkit': {
        src : nw.zip,
        dest: nw.path
      }
    },

    'clean' : {
      'yase':{
        src:['node_modules/yase']
      },
      'yadb':{
        src:['node_modules/yadb']
      },
      'kpc-app-sample':{
        src:['kpc-app-sample']
      },
      'kse-ui':{
        src:['kse-ui']
      }      
    },
    'gitclone' : {
      'yase': {
        options:{
          repository: 'https://github.com/yapcheahshen/yase.git',
          branch: 'master',
          directory: 'node_modules/yase',
          force:true   
        }
      },
      'yadb': {
        options:{
          repository: 'https://github.com/yapcheahshen/yadb.git',
          branch: 'master',
          directory: 'node_modules/yadb',
          force:true   
        }
      },
      'kse-ui': {
        options:{
          repository: 'https://github.com/ksanaforge/kse-ui.git',
          branch: 'master',
          directory: 'kse-ui',
          force:true   
        }
      },
      'kpc-app-sample': {
        options:{
          repository: 'https://github.com/ksanaforge/kpc-app-sample.git',
          branch: 'master',
          directory: 'kpc-app-sample',
          force:true   
        }
      }
    },
    'shell':{
        'component-install': {
            command: "component install",
            options: {
                stdout: true
            }           
        }
    },
    'copy':{
      'socketio-cli':{
          expand: true, 
          cwd: 'node_modules/socket.io/node_modules/socket.io-client/dist/', 
          src: ['socket.io.js'],
          dest: 'components/socketio-socketio/'
      }
    }
  });


  // Default task(s).
  grunt.registerTask('info', 'install information',function(){
    console.log('nw',nw);
  } );

  grunt.registerTask('default', ['info']);
  

  //grunt-unzip is too slow !!!
  grunt.registerTask('unzip-nw','Unziping ',function(g){
    require('./node_script/grunt-unpack')(nw);
  });
  
  grunt.registerTask('welcome','welcome message',function() {
    console.log("install successful".green);
    console.log("to install demo app, type");
    console.log(">grunt sample");
    console.log(">cd kpc-app-sample");
    console.log(">grunt run");

  });  
  grunt.registerTask('testsample','test sample',function(){
    console.log(">cd kpc-app-sample".yellow);
    console.log(">grunt run".yellow);    
  })
  grunt.registerTask('installnw', ['curl:node-webkit','unzip-nw']);
  grunt.registerTask('clone', ['clean:yadb','gitclone:yadb','clean:yase','gitclone:yase']);
  grunt.registerTask('setup',['installnw','clone','shell:component-install','copy:socketio-cli','welcome'])

  grunt.registerTask('sample',['clean:kse-ui','clean:kpc-app-sample','gitclone:kse-ui','gitclone:kpc-app-sample','testsample'])
  

  grunt.registerTask('newapp','Create new kpc app',function(){
    var name = grunt.option('name');
    newapp(name);
    grunt.file.setBase(name);
    newcomponent(name+'/main');
    grunt.file.setBase('..');
    console.log('success, switch to app folder and type')
    console.log('grunt run')
  });
};