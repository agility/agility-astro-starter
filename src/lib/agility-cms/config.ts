
export const getAgilityConfig = () => ({
	guid: import.meta.env.AGILITY_GUID, //Set your guid here
	fetchAPIKey: import.meta.env.AGILITY_API_FETCH_KEY, //Set your fetch apikey here
	previewAPIKey: import.meta.env.AGILITY_API_PREVIEW_KEY, //set your preview apikey
	locales: (import.meta.env.AGILITY_LOCALES || "en-us").split(","), //the language for your website in Agility CMS
	channelName: import.meta.env.AGILITY_SITEMAP || "website", //the name of your channel in Agility CMS
	securityKey: import.meta.env.AGILITY_SECURITY_KEY, //the website security key used to validate and generate preview keys
	debug: import.meta.env.AGILITY_DEBUG === "true" ? true : false,
	defaultCacheDuration: import.meta.env.AGILITY_FETCH_CACHE_DURATION ? parseInt(import.meta.env.AGILITY_FETCH_CACHE_DURATION) : 60, //the default cache duration in seconds for agility content
})
