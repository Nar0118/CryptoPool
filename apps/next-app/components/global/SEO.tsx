import Head from 'next/head';

export default function SEO(): JSX.Element {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>CryptoPool</title>
      <meta
        name="description"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      />
      <meta name="image" content="image/logo.png" key="ogtitle" />

      <meta property="og:type" content="website" key="ogtype" />
      <meta property="og:title" content="CryptoPool" key="ogtitle" />
      <meta
        property="og:description"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        key="ogdesc"
      />
      <meta
        property="twitter:card"
        content="summary_large_image"
        key="twcard"
      />
      <meta name="twitter:creator" content="CryptoPool" key="twhandle" />
      <meta name="twitter:title" content="CryptoPool" key="twtitle" />
      <meta
        name="twitter:description"
        content="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        key="twdescription"
      />
      <meta name="twitter:image" content="image/logo.png" key="twimage" />
      <meta property="og:image" content="image/logo.png" key="ogimage" />
      <meta property="og:site_name" content="CryptoPool" key="ogsitename" />
    </Head>
  );
}
