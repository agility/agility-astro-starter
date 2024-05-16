import { getAgilityConfig } from "./config";
import { generatePreviewKey } from "./generate-preview-key";

export const validatePreview = ({ agilityPreviewKey }: any) => {
	//Validate the preview key
	if (!agilityPreviewKey) {
		return {
			error: true,
			message: `Missing agilitypreviewkey.`,
		};
	}

	//sanitize incoming key (replace spaces with '+')
	if (agilityPreviewKey.indexOf(` `) > -1) {
		agilityPreviewKey = agilityPreviewKey.split(` `).join(`+`);
	}

	const securityKey = getAgilityConfig().securityKey;

	//compare the preview key being used
	const correctPreviewKey = generatePreviewKey(securityKey);

	if (agilityPreviewKey !== correctPreviewKey) {
		return {
			error: true,
			message: `Invalid agilitypreviewkey.`,
			//message: `Invalid agilitypreviewkey. Incoming key is=${agilityPreviewKey} compared to=${correctPreviewKey}...`
		};
	}

	//return success
	return {
		error: false,
		message: null,
	};
};