declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"post": {
"aws-eks-fargate-with-terraform-1/index.mdx": {
	id: "aws-eks-fargate-with-terraform-1/index.mdx";
  slug: "aws-eks-fargate-with-terraform-1";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"aws-eks-fargate-with-terraform-2/index.mdx": {
	id: "aws-eks-fargate-with-terraform-2/index.mdx";
  slug: "aws-eks-fargate-with-terraform-2";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"aws-eks-fargate-with-terraform-3/index.mdx": {
	id: "aws-eks-fargate-with-terraform-3/index.mdx";
  slug: "aws-eks-fargate-with-terraform-3";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"aws-s3-static-hosting/index.mdx": {
	id: "aws-s3-static-hosting/index.mdx";
  slug: "aws-s3-static-hosting";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"ci-with-dagger/index.mdx": {
	id: "ci-with-dagger/index.mdx";
  slug: "ci-with-dagger";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"deploy-docker-compose-traefik-aws-ec2/index.mdx": {
	id: "deploy-docker-compose-traefik-aws-ec2/index.mdx";
  slug: "deploy-docker-compose-traefik-aws-ec2";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"deploy-hashicorp-vault-to-aws-ec2-instance/index.mdx": {
	id: "deploy-hashicorp-vault-to-aws-ec2-instance/index.mdx";
  slug: "deploy-hashicorp-vault-to-aws-ec2-instance";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"deploy-kotlin-api-to-azure-container-apps/index.mdx": {
	id: "deploy-kotlin-api-to-azure-container-apps/index.mdx";
  slug: "deploy-kotlin-api-to-azure-container-apps";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"feature-flags/index.mdx": {
	id: "feature-flags/index.mdx";
  slug: "feature-flags";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"google-sign-in-with-amazon-cognito-and-nextjs/index.mdx": {
	id: "google-sign-in-with-amazon-cognito-and-nextjs/index.mdx";
  slug: "google-sign-in-with-amazon-cognito-and-nextjs";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"kong-api-gateway-for-development-environment/index.mdx": {
	id: "kong-api-gateway-for-development-environment/index.mdx";
  slug: "kong-api-gateway-for-development-environment";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"publish-npm-package/index.mdx": {
	id: "publish-npm-package/index.mdx";
  slug: "publish-npm-package";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"react-native-modules/index.mdx": {
	id: "react-native-modules/index.mdx";
  slug: "react-native-modules";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
"restore-backup-of-postgres-container/index.mdx": {
	id: "restore-backup-of-postgres-container/index.mdx";
  slug: "restore-backup-of-postgres-container";
  body: string;
  collection: "post";
  data: InferEntrySchema<"post">
} & { render(): Render[".mdx"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
