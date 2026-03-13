const THEME_FILES = {
  barbie: '/index-barbie.html',
  mtv: '/index-mtv.html',
};

export default function middleware(request) {
  const url = new URL(request.url);
  const theme = url.searchParams.get('theme');

  if (url.pathname === '/' && theme && THEME_FILES[theme]) {
    const rewriteUrl = new URL(THEME_FILES[theme], request.url);
    return new Response(null, {
      status: 200,
      headers: {
        'x-middleware-rewrite': rewriteUrl.toString(),
      },
    });
  }
}

export const config = {
  matcher: '/',
};
