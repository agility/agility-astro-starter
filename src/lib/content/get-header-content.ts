import type { ContentItem } from "@agility/content-fetch"
import type { ImageField } from "../agility-cms/types/agility-fields"
import { getRestClient } from "../agility-cms/rest-client"

interface ILink {
	title: string
	path: string
}

export interface IHeaderData {
	siteName: string
	logo: ImageField
	links: ILink[]
}

interface IHeader {
	siteName: string
	logo: ImageField
}

interface Props {
	locale: string
	sitemap: string
	isPreview: boolean
}

/**
 * Get the site header content from the main `siteheader` content item,
 * as well as the nested sitemap for our navigation links.
 *
 * Most solutions use nested linked content lists for navigation, but for simplicity, we are using the sitemap here.
 *
 *
 * @param {Props} { locale, sitemap }
 * @return {*}
 */
export const getHeaderContent = async ({ locale, sitemap, isPreview }: Props) => {


	// set up content item
	let contentItem: ContentItem<IHeader> | null = null

	// set up links
	let links = []

	const agilityRestClient = getRestClient({ isPreview })

	try {



		// try to fetch our site header
		let header = await agilityRestClient.getContentList({
			referenceName: "siteheader",
			languageCode: locale,
			take: 1,
		})

		// if we have a header, set as content item
		if (header && header.items && header.items.length > 0) {
			contentItem = header.items[0]
		}

		if (!contentItem) {
			return null
		}
	} catch (error) {
		if (console) console.error("Could not load site header item.", error)
		return null
	}

	try {
		// get the nested sitemap
		let nodes = await agilityRestClient.getSitemapNested({
			channelName: sitemap,
			languageCode: locale,
		})

		// grab the top level links that are visible on menu
		links = nodes
			.filter((node: any) => node.visible.menu)
			.map((node: any) => {

				const path = node.path

				return {
					title: node.menuText || node.title,
					path: path === "/home" ? "/" : path,
				}
			})

	} catch (error) {
		if (console) console.error("Could not load nested sitemap.", error)
	}

	// return clean object...
	return {
		siteName: contentItem.fields.siteName,
		logo: contentItem.fields.logo,
		links,
	} as IHeaderData
}



