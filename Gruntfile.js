//require('dotenv').load();
var grunt = require('grunt');
grunt.loadNpmTasks('grunt-aws-lambda');

grunt.initConfig({
   lambda_invoke: {
      default: {
         options: {
            file_name: 'index.js'
         }
      }
   },
   lambda_deploy: {
      default: {
         package: 'YodaSkill',
         arn: ''
      }
   },
   lambda_package: {
      default: {
         options: {
            include_files: ['.env']
         },
         package: 'YodaSkill'
      }
   }
});

grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy'])