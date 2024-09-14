import { NCData } from '$lib/db/NCData';
export const load = async function () {
	const addDelay = () => {};

	const data = NCData.find({})
		.project({ RegionName: 1, Total: 1, _id: 0, lat: 1, lng: 1 })
		.toArray();
	// console.log('data', data);
	return {
		NCData: data
	};
};
