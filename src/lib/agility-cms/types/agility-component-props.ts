import type { ContentItem, ContentReference } from "@agility/content-fetch"
import type { AgilityPageProps } from "./agility-page-props"

export interface AgilityComponentProps {
	item:
	| ContentItem<{
		[key: string]: any
	}>
	| ContentReference
	name: string
	pageResponse: AgilityPageProps
}