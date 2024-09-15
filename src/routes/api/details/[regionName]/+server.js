import db from '$lib/db/mongo';

const AdditionalData = db.collection('AdditionalData');

export const GET = async ({ params, request }) => {
	console.log(params);
	const res = await AdditionalData.findOne({
		RegionName: params.regionName
	});
	console.log(res);
	return new Response(JSON.stringify({ details: res, status: 200 }));
};
