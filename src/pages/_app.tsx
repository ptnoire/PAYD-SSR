import { type AppType } from "next/app";
import { ClerkProvider } from "@clerk/nextjs";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Head>
        <title>Payd-2</title>
        <meta name="description" content="Bill Tracking" />
        <meta
          name="keywords"
          content="Payd-2, Payd, Bill Tracking, Bill, Tracker, Simple, Simple Bill Tracking, Bill Tracker, Bills, Finance"
        ></meta>
        <link
          rel="icon"
          media="(prefers-color-scheme: light)"
          href="/ptblack.ico"
        />
        <link
          rel="icon"
          media="(prefers-color-scheme: dark)"
          href="/ptwhite.ico"
        />
      </Head>
      <Toaster position="bottom-center" />
      <Component {...pageProps} />
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
