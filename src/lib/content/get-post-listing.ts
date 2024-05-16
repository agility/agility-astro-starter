import type { ContentList } from "@agility/content-fetch"
import { DateTime } from "luxon"
import type { ImageField } from "../agility-cms/types/agility-fields"
import { getRestClient } from "../agility-cms/rest-client"


export interface IPostMin {

	contentID: number
	title: string
	date: string
	url: string
	category: string
	image: ImageField
}

interface LoadPostsProp {
	sitemap: string
	locale: string
	isPreview: boolean
	skip: number
	take: number
}

export const getPostListing = async ({ sitemap, locale, isPreview, skip: _skip, take: _take }: LoadPostsProp) => {


	//HACK: we are ignoring skip and take for now just to show how to use the CMS data

	const agilityRestClient = getRestClient({ isPreview })


	try {
		// get sitemap...
		let sitemapNodes = await agilityRestClient.getSitemapFlat({
			channelName: sitemap,
			languageCode: locale,
		})

		// get posts...
		let rawPosts: ContentList = await agilityRestClient.getContentList({
			referenceName: "posts",
			languageCode: locale,
			contentLinkDepth: 2,
			take: 50,
		})

		// resolve dynamic urls
		const dynamicUrls = resolvePostUrls(sitemapNodes, rawPosts.items)

		const posts: IPostMin[] = rawPosts.items.map((post: any) => {
			//category
			const category = post.fields.category?.fields.title || "Uncategorized"

			// date
			const date = DateTime.fromJSDate(new Date(post.fields.date)).toFormat("LLL. dd, yyyy")

			// url
			const url = dynamicUrls[post.contentID] || "#"


			return {
				contentID: post.contentID,
				title: post.fields.title,
				date,
				url,
				category,
				image: post.fields.image
			}
		})

		return {
			posts,
		}
	} catch (error) {
		throw new Error(`Error loading data for PostListing: ${error}`)
	}
}

const resolvePostUrls = function (sitemap: any, posts: any) {
	let dynamicUrls: any = {};
	posts.forEach((post: any) => {
		Object.keys(sitemap).forEach((path) => {
			if (sitemap[path].contentID === post.contentID) {
				dynamicUrls[post.contentID] = path;
			}
		});
	});
	return dynamicUrls;
};