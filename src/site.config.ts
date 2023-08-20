interface SiteConfig {
	author: string;
	title: string;
	description: string;
	lang: string;
	ogLocale: string;
	date: {
		locale: string | string[] | undefined;
		options: Intl.DateTimeFormatOptions;
	};
}

export const siteConfig: SiteConfig = {
	author: "ldamore",
	title: "Damo Blog",
	description: "A software developer blog",
	lang: "en-US",
	ogLocale: "en-US",
	date: {
		locale: "en-US",
		options: {
			day: "numeric",
			month: "short",
			year: "numeric",
		},
	},
};
