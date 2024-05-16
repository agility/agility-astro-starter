import type { APIContext } from 'astro';
import { getPostListing } from '../../lib/content/get-post-listing';


export async function GET({ url, request }: APIContext) {

	const params = url.searchParams

	const locale = params.get("locale")
	const sitemap = params.get("sitemap")
	const isPreview = params.get("preview") === 'true'


	const skip = Number(params.get("skip"))
	const take = Number(params.get("take"))


	if (!locale || !sitemap
		|| isNaN(skip) || skip < 1
		|| isNaN(take) || take < 1) {
		return new Response('Invalid request: skip, take, locale and sitemap are all required', {
			status: 400
		});
	}

	//HACK: we are just outputting a lot of posts here for now, so we are IGNORING the skip and take vals...
	//normally you would use skip and take to do paging on a large list.
	const postsRes = await getPostListing({ sitemap: sitemap, isPreview, locale, skip: 0, take: 50 })


	//HACK adjust the ids so our keys don't overlap
	postsRes.posts = postsRes.posts.map((post, index) => {
		post.contentID = index + Number(skip)
		return post
	})

	return new Response(JSON.stringify(postsRes.posts))

}