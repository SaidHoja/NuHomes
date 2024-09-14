import { start_mongo } from '$lib/db/mongo';

// TODO: See if we can make this non-blocking (first page load on startup takes ~20s)
start_mongo()
	.then(() => {
		console.log('Mongo started');
	})
	.catch((e) => {
		console.error(e);
	});
