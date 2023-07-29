import axios from "axios";

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
