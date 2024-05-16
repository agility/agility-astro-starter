import type { AstroGlobal } from "astro";
import { validatePreview } from "./validate-preview-key";
import { getRestClient } from "./rest-client";
import { getAgilityConfig } from "./config";

export const handlePreview = async (Astro: Readonly<AstroGlobal>) => {

	const config = getAgilityConfig()



	//check for for EXITING preview mode
	const AgilityPreviewZero = Astro.url.searchParams.get('AgilityPreview') || '';
	if (AgilityPreviewZero === '0') {

		//remove the cookie and redirect to the same slug
		Astro.cookies.delete("agilitypreview")
		//return the slug we are going to redirect to
		//HACK - for some reason we need to add the ?AgilityPreview=-1 to the end of the URL to get the redirect to work
		return `${Astro.url.pathname}?AgilityPreview=-1`
	}

	//now check for ENTERING preview mode
	const agilityPreviewKey = (Astro.url.searchParams.get('agilitypreviewkey') || '').trim();
	const contentIDStr = Astro.url.searchParams.get('ContentID') || Astro.url.searchParams.get('contentID');



	if (!agilityPreviewKey) {
		//kickout if we don't have a preview key
		return false;
	}

	//validate the preview key, set the cookie and redirect to the same slug
	const ret = validatePreview({ agilityPreviewKey });
	if (ret.error) {
		console.error(ret.message);
		return false;
	}


	//if we get this far, we are kicking them INTO preview mode!
	Astro.cookies.set("agilitypreview", "true")


	let slug = Astro.url.pathname

	const dynamicPageContentID = parseInt(contentIDStr || "");

	if (!isNaN(dynamicPageContentID) && dynamicPageContentID > 0) {
		//we need to lookup the content item and get the slug from the sitemap

		const channelName = config.channelName

		//TODO: get the locale from the URL
		const locale = config.locales[0]

		const restAPI = getRestClient({ isPreview: true })
		const sitemapFlat = await restAPI.getSitemapFlat({ channelName, locale })

		// get the slug from the sitemap
		const dynamicPath = Object.keys(sitemapFlat).find((s) => {
			if (sitemapFlat[s].contentID === dynamicPageContentID) {
				return s;
			}
		});

		if (dynamicPath) {
			slug = dynamicPath;
		}

	}


	//return the slug we are going to redirect to
	//HACK - for some reason we need to add the ?AgilityPreview=1 to the end of the URL to get the redirect to work
	return `${slug}?AgilityPreview=1`
};