export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (
      response.status !== 404 ||
      (request.method !== "GET" && request.method !== "HEAD")
    ) {
      return response;
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/") {
      const indexResponse = await env.ASSETS.fetch(
        new Request(new URL("/index.html", url), request)
      );
      if (indexResponse.status !== 404) {
        return indexResponse;
      }
      return response;
    }

    const lastSegment = pathname.split("/").pop() || "";
    if (lastSegment.includes(".")) {
      return response;
    }

    const htmlResponse = await env.ASSETS.fetch(
      new Request(new URL(`${pathname}.html`, url), request)
    );
    if (htmlResponse.status !== 404) {
      return htmlResponse;
    }

    const indexPath = pathname.endsWith("/")
      ? `${pathname}index.html`
      : `${pathname}/index.html`;
    const indexResponse = await env.ASSETS.fetch(
      new Request(new URL(indexPath, url), request)
    );
    if (indexResponse.status !== 404) {
      return indexResponse;
    }

    const notFoundResponse = await env.ASSETS.fetch(
      new Request(new URL("/404.html", url), request)
    );
    if (notFoundResponse.status === 404) {
      return response;
    }

    return new Response(notFoundResponse.body, {
      status: 404,
      headers: notFoundResponse.headers,
    });
  },
};
