const packager = require('electron-packager')
const {rebuild} = require('electron-rebuild')
console.log(packager, rebuild)

packager({
	// … other options
	dir: '.',
	platform: 'darwin',
	afterCopy: [
		(buildPath, electronVersion, platform, arch, callback) => {
			rebuild({ buildPath, electronVersion, arch })
				.then(() => callback())
				.catch(error => callback(error))
		},
	],
	// … other options
})
