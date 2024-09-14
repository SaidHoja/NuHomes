import { NCData } from '$lib/db/NCData';
export const load = async function () {
	return {
		NCData: NCData.find({})
			.project({ RegionName: 1, Total: 1, _id: 0, lat: 1, lng: 1, population: 1, SizeRank: 1 })
			.toArray()
	};
};
