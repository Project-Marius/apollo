# Marius Apollo Gateway Server

This is a cloudflare worker that serves as a single API that exposes the entire backend. Underneath the hood, it uses schema stitching to link together all backend services, exposing them as GraphQL queries and mutations. Right now that's just FaunaDB's graphql endpoint, but eventually it'll also include AWS Lambda functions (packet parsers, other things written in python), AWS S3 storage buckets, and any other services we end up adding.

## Development
Since I'm not a fan of putting FaunaDB keys in this repo, this is to be done by publishing to workers.dev and connecting to it directly. Here's how you do that:

#### Prerequisites
1. nodejs. Install it [here](https://nodejs.org/en/download/) or using [nvm](https://www.google.com/search?client=firefox-b-1-d&q=nvm). I personally reccomend the latter, since it makes it much easier to switch between different versions of node for different projects, which is useful because many cloud providers and modules only support certain versions.
2. A Cloudflare Workers account / API key. Ask [Sebastien](https://github.com/Sladuca) for one if you need it.
3. (optional) yarn. it's much cleaner and doesn't yell at your nearly as much. Install [here](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

#### Setup

1. [install](https://developers.cloudflare.com/workers/tooling/wrangler) and [configure](https://developers.cloudflare.com/workers/tooling/wrangler/configuration) wrangler. Read about wrangler [here](https://developers.cloudflare.com/workers/tooling/wrangler). For a quick summary, do the following:

    1. `npm install -g @cloudflare/wrangler`
    2. `wrangler config`, and give it your API token for cloudflare workers.
    3. if you're using your own `workers.dev` subdomain, configure `wrangler.toml`. Read more [here](https://developers.cloudflare.com/workers/tooling/wrangler/configuration#per-project)

2. install dependencies with `yarn install` or `npm install`

#### Running

Simply run `wrangler publish` to publish to `workers.dev`. Sometimes it's helpful to only run `wrangler build` to debug build issues or `wrangler preview` for anything that doesn't need workers KV.