import { program } from 'commander';
import migrateRoute from './app/helpers/routeMigrator.js'


program.version('1.0.0')
        .description('My Custom CLI Tool');

//Migrate the newly generated Permission Groups and Permissions
program.command('migrate-route')
        .alias('a')
        .description('Migrate the newly generated Permission Groups and Permissions')
        .action(async () => {
            await migrateRoute();
        });

//program.parse();
program.parse(process.argv);