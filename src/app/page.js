"use client";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import { useNotifications } from "./useNotifications";
import { getItems } from "./getData";
import { Button } from "@mui/material";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [assets, setAssets] = useState([]);
	const [previousAssetNames, setPreviousAssetNames] = useState([]);
	const [policyId, setPolicyId] = useState(
		"f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a"
	);
	const [projectName, setProjectName] = useState("$adahandle");
	const { showNotification } = useNotifications();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const currentDate = new Date();

				// Format the time as per your requirement (time will be formatted based on user's locale settings)
				const formattedTime = currentDate.toLocaleTimeString();

				// Log the formatted time to the console
				console.log(
					"checking for new assets....\nCurrent time in your timezone:",
					formattedTime
				);

				const data = await getItems(policyId);
				const newAssets = data.tokens;
				const newAssetNames = newAssets.map((asset) => asset.display_name);
				const newHandles = newAssets.filter(
					(asset) => !previousAssetNames.includes(asset.display_name)
				);

				if (newHandles.length > 0) {
					let message =
						newHandles.length > 1
							? "New handles listed! " + newHandles.length + " handles"
							: newHandles.length === 0 ||
							  newHandles.length === undefined
							? "No new handles listed"
							: "New handle listed! " + newHandles[0].display_name;
					console.log(message, newHandles);
					handleNotificationClick(message, newHandles);
				}
				setProjectName(decodeURI(newAssets[0].collections.display_name));
				setAssets(newAssets);
				setPreviousAssetNames(newAssetNames);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching data:", error);
				setIsLoading(false);
			}
		};

		const intervalId = setInterval(fetchData, 8000);
		return () => clearInterval(intervalId);
	}, [previousAssetNames]);

	const handleFormSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const policyId = formData.get("policyId");
		setPolicyId(policyId);
		setAssets([]); // so that the FetchData useEffect hook will run again
		setPreviousAssetNames([]);
		setIsLoading(true);
	};

	const handleNotificationClick = (title, newAssets) => {
		const adaHandles = newAssets.map((asset) => asset.display_name);
		const urls = newAssets.map(
			(asset) => `https://www.jpg.store/asset/${asset.asset_id}`
		);
		showNotification(title, {
			body: adaHandles.join(", "),
			onClick: () => {
				window.open(saleUrl, "_blank");
			},
		});
	};

	const skeletonLoaders = Array.from({ length: 10 }, (_, index) => (
		<div
			key={index}
			className="w-96 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-lg shadow-md animate-pulse"
		/>
	));

	return (
		<div className="flex flex-col items-center space-y-2 mt-2">
			<form
				onSubmit={handleFormSubmit}
				className="flex flex-col items-center space-y-2 border-2 border-slate-50 border-opacity-50 rounded-lg shadow-md p-4 hover:border-opacity-100"
			>
				<h1>
					<span className="font-bold  text-4xl text-purple-900">
						JPG.STORE NOTIFICATIONS
					</span>
				</h1>
				<label
					htmlFor="policyId"
					className="text-slate-50 font-bold border-b-2 border-slate-50 border-opacity-50"
				>
					Project:{" "}
					<Link
						className="text-slate-50 font-bold"
						href={`https://www.jpg.store/collection/${projectName}`}
						target="_blank"
					>
						{projectName}
					</Link>
				</label>
				<input
					id="policyId"
					name="policyId"
					type="text"
					className="w-96 h-10 px-4 py-2 rounded-lg shadow-md text-slate-300"
					defaultValue={policyId}
				/>
				<Button variant="outlined" type="submit" color="secondary">
					{isLoading ? (
						<CircularProgress
							size={20}
							sx={{
								color: "#f3f3f3",
							}}
							draggable={false}
						/>
					) : (
						<div className=" hover:text-green-500 text-purple-500">
							<span>Set Policy ID</span> <span>&#x2713;</span>
						</div>
					)}
				</Button>
			</form>
			{isLoading ? skeletonLoaders : ""}

			{assets && (
				<div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-2">
					{assets.map((asset) => (
						<div
							key={asset.asset_id}
							className="flex bg-gradient-to-r from-purple-500 to-orange-500 pl-2 rounded-lg shadow-md h-30 w-screen sm:w-96 md:w-96 lg:w-96 xl:w-96"
						>
							<div className="flex items-center justify-start w-full">
								{/* Use justify-start here */}
								<span className="text-xl text-slate-900 font-bold">
									{asset.display_name}
								</span>
								{/* <span className="uppercase text-xs text-slate-900">
            {asset.traits.length ? asset.traits.length + " CHARS" : ""}
          </span> */}
								<span className="flex justify-end uppercase text-xs bg-slate-900 px-1 py-1 ml-1 text-slate-100 font-bold rounded-md">
									₳
									{(
										asset.listing_lovelace / 1000000
									).toLocaleString()}
								</span>
							</div>
							<Link
								className="uppercase text-md text-slate-100 font-bold hover:text-green-500 transition-colors duration-220"
								href={`https://www.jpg.store/asset/${asset.asset_id}`}
								target="_blank"
							>
								<div className="flex justify-end bg-slate-950 items-center px-2 py-2 shadow-md whitespace-nowrap rounded-r-md ">
									{/* Use justify-end here */}
									View Listing
								</div>
							</Link>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
