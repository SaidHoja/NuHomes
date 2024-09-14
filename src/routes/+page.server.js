import { NCData } from '$lib/db/NCData';
export async function load() {
	// const data = await NCData.find({}).project({ RegionName: 1, Total: 1, _id: 0 }).toArray();
	// const data = console.log('data', data);
	const data = NCData.find({}).project({ RegionName: 1, Total: 1, _id: 0 }).toArray();
	// const data = new Promise((res, rej) => {
	// 	rej();
	// }).catch((err) => {});

	// const streamedNCData = async () => {
	// 	await new Promise((r) => setTimeout(r, 5000));
	// 	const data = await NCData.find({}).project({ RegionName: 1, Total: 1, _id: 0 }).toArray();
	// 	return JSON.stringify(data);
	// };

	return {
		NCData: data
	};
}
