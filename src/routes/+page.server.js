import { NCData} from '$lib/db/NCData'
import db from '$lib/db/mongo'
export const load = async function(){
    const data = await NCData.find({}).project({RegionName:1, Total:1}).toArray();
    console.log('data', data);
    return {
        props: {
            NCData: JSON.stringify(data)
    }
    }
}