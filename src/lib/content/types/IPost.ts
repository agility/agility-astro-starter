
import type { ContentItem } from "@agility/content-fetch"
import type { ImageField } from "../../agility-cms/types/agility-fields"
import type { IAuthor } from "./IAuthor"
import type { ICategory } from "./ICategory"
import type { ITag } from "./ITag"


export interface IPost {
	title: string
	slug: string
	date: string
	content: string
	image: ImageField
	category: ContentItem<ICategory>
	author: ContentItem<IAuthor>
	tags: [ContentItem<ITag>]
}