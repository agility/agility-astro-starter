
import { type Page, type ContentItem } from "@agility/content-fetch";

import { getRestClient } from "./rest-client";
import { getAgilityConfig } from "./config";
import type { AgilitySitemapNode } from "./types/agility-sitemap-node";
import type { AgilityPageProps } from "./types/agility-page-props";


interface Props {
	slug: string | undefined
	isPreviewCookieSet: boolean
}


/**
 * Gets a page from Agility CMS by slug
 * @param param0
 * @returns
 */
export const getPage = async ({ slug, isPreviewCookieSet }: Props): Promise<AgilityPageProps | null> => {

	const agilityConfig = getAgilityConfig()

	const channelName = agilityConfig.channelName
	const isDevelopmentMode = false //process.env.NODE_ENV === "development";

	//TODO: handle preview mode with a cookie
	const isPreview = isPreviewCookieSet //HACK isDevelopmentMode || isPreviewCookieSet

	//TODO: derive the language code from the request slug
	const languageCode = agilityConfig.locales[0]

	//get the rest client
	const agilityRestClient = getRestClient({ isPreview })

	//get the flat sitemap
	const sitemap = await agilityRestClient.getSitemapFlat({ channelName, languageCode })

	const path = slug ? `/${slug.toLowerCase()}` : "/"

	let sitemapNode: AgilitySitemapNode | null = null

	//get the page from the sitemap by slug
	if (path === "/") {
		//home page
		let firstPagePathInSitemap = Object.keys(sitemap)[0];
		sitemapNode = sitemap[firstPagePathInSitemap];
	} else {
		//all other pages
		sitemapNode = sitemap[path];
	}


	if (!sitemapNode) {
		//not found
		return null
	}

	//get the full page object
	const page = await agilityRestClient.getPage({
		pageID: sitemapNode.pageID,
		languageCode,
		contentLinkDepth: 1
	})

	let dynamicPageItem: ContentItem | null = null

	//get the dynamic page item
	if (sitemapNode.contentID && sitemapNode.contentID > 0) {
		dynamicPageItem = await agilityRestClient.getContentItem({
			contentID: sitemapNode.contentID,
			languageCode
		})

	}


	return {
		sitemapNode,
		page,
		dynamicPageItem,
		pageTemplateName: page.templateName as string || null,
		languageCode,
		channelName,
		isPreview,
		isDevelopmentMode
	}



}