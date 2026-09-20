import "../styles/globals.css"
import "lenis/dist/lenis.css"
import type { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import client from "../apollo-client"
import Script from "next/script"
import { SmoothCursor } from "../components/SmoothCursor"
import { featureFlags } from "../lib/featureFlags"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-8W63DYFBC0"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8W63DYFBC0');
        `}
      </Script>

      {featureFlags.smoothCursor && <SmoothCursor />}
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default MyApp
