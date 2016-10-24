const bash = require('child_process').exec;
var exec = (instruct) => {
	bash(instruct, (err, stdout, stderr) => {
			if(err)throw err;
			console.log(stdout);
			console.log(stderr);
	});
}

exec('git add *');
exec('git commit -m "test nodejs_child_proess"')
