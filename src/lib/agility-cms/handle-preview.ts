import type { AstroGlobal } from "astro";
import { validatePreview } from "./validate-preview-key";
import { getRestClient } from "./rest-client";
import { getAgilityConfig } from "./config";

export const handlePreview = async (Astro: Readonly<AstroGlobal>) => {

	const config = getAgilityConfig()



	//check for for EXITING preview mode
	const AgilityPreviewZero = Astro.url.searchParams.get('AgilityPreview') || '';
	if (AgilityPreviewZero === '0') {
		console.log("KICKING OUT OF PREVIEW MODE")
		//remove the cookie and redirect to the same slug
		Astro.cookies.delete("agilitypreview")
		return Astro.url.pathname
	}

	//now check for ENTERING preview mode
	const agilityPreviewKey = (Astro.url.searchParams.get('agilitypreviewkey') || '').trim();
	const contentIDStr = Astro.url.searchParams.get('ContentID') || Astro.url.searchParams.get('contentID');



	if (!agilityPreviewKey) {
		console.log("NO PREVIEW KEY")
		//kickout if we don't have a preview key
		return false;
	}

	console.log("HANDLE PREVIEW", Astro.url.pathname)
	console.log("agilityPreviewKey", agilityPreviewKey)
	console.log("contentIDStr", contentIDStr)

	//validate the preview key, set the cookie and redirect to the same slug
	const ret = validatePreview({ agilityPreviewKey });
	if (ret.error) {
		console.error(ret.message);
		return false;
	}

	console.log("setting the preview cookie...")

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

	console.log("REDIRECTING TO", slug)

	//return the slug we are going to redirect to
	return `${slug}?AgilityPreview=1`
};