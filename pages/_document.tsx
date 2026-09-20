import Document, { Head, Html, Main, NextScript } from "next/document"

const bootCss = `
html,body,#__next{background-color:#0f172a;color-scheme:dark}
.boot-loader{position:fixed;top:0;right:0;bottom:0;left:0;z-index:10000;background-color:#0f172a;overflow:hidden}
`

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style dangerouslySetInnerHTML={{ __html: bootCss }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
