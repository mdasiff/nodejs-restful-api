import { program } from 'commander';
import resources from './app/commands/resourceGenerator.js'

program.version('1.0.0')
        .description('My Custom CLI Tool');

//Create resources which includes : migration, model, route, validation, controller.
program.command('make:resources <name>')
        .alias('b')
        .description('Create resources which includes : migration, model, route, validation, controller.')
        .action((name) => {
                resources(name);
        });

//program.parse();
program.parse(process.argv);