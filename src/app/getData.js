import axios from "axios";

async function getAsset(asset) {
    const response = await axios.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`, {
        headers: {
            'project_id': process.env.BLOCKFROST_API_KEY,
        }
    });

    return response.data;
}

async function getAssets(assets) {
    const promises = assets.map(asset => {
        return axios.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`, {
            headers: {
                'project_id': process.env.BLOCKFROST_API_KEY,
            }
        });
    });

    const responses = await Promise.all(promises);

    return responses.map(response => response.data);
}


export async function getItems(policyId) {
    const response = await axios.get(
        "https://server.jpgstoreapis.com/search/tokens",
        {
            params: {
                policyIds: policyId,
                saleType: "buy-now",
                sortBy: "recently-listed",
                traits: "e30=",
                listingTypes: "ALL_LISTINGS",
                nameQuery: "",
                verified: "default",
                onlyMainBundleAsset: "false",
                size: "10",
            },
        }
    );
    return response.data;
}