import { getAgilityConfig } from "./config";
import * as agilityRestAPI from "@agility/content-fetch";

interface Props {
	isPreview: boolean
}

export const getRestClient = ({ isPreview }: Props) => {

	const agilityConfig = getAgilityConfig()

	return agilityRestAPI.getApi({
		guid: agilityConfig.guid,
		apiKey: isPreview
			? agilityConfig.previewAPIKey
			: agilityConfig.fetchAPIKey,
		isPreview,
		debug: agilityConfig.debug,
	})
}