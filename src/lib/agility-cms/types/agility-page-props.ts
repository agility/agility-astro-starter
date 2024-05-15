import type { ContentItem, Page } from "@agility/content-fetch";
import type { AgilitySitemapNode } from "./agility-sitemap-node";

export interface AgilityPageProps {
	sitemapNode: AgilitySitemapNode;
	page: Page;
	dynamicPageItem: ContentItem | null;
	pageTemplateName: string | null;
	languageCode: string | null;
	channelName: string | null;
	isPreview: boolean;
	isDevelopmentMode: boolean;

}