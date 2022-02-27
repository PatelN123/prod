import { NextResponse } from "next/server";

export default function middleware(req) {
  const url = req.nextUrl.clone(); // clone the request url
  const { pathname } = req.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = req.headers.get("host"); // get hostname of request (e.g. demo.vercel.pub)

  const currentHost =
    process.env.NODE_ENV === "production" && process.env.VERCEL === "1"
      ? hostname
          .replace(`.vercel.pub`, "") // you have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
          .replace(`*.pages.notes.nayanpatel.net`, "") // you can use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      : // in this case, our team slug is "platformize", thus *.platformize.vercel.app works
        hostname.replace(`.localhost:3000`, "");

  if (pathname.startsWith(`/_sites`)) {
    return new Response(null, { status: 404 });
  }

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (currentHost == "app") {
      if (
        pathname === "/login" &&
        (req.cookies["next-auth.session-token"] ||
          req.cookies["__Secure-next-auth.session-token"])
      ) {
        return NextResponse.redirect("/");
      }
      url.pathname = `/app${pathname}`;
      return NextResponse.rewrite(url);
    } else if (
      hostname === "localhost:3000" ||
      hostname === "pages.notes.nayanpatel.net"
    ) {
      url.pathname = `/home`;
      return NextResponse.rewrite(url);
    } else {
      url.pathname = `/_sites/${currentHost}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }
}
