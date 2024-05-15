export interface AgilitySitemapNode {
	title: string
	name: string
	pageID: number
	menuText: number
	visible: { menu?: boolean, sitemap?: boolean },
	path: string
	redirect: string | null
	isFolder: false,
	contentID?: number
}