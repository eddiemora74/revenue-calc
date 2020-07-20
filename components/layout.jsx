import Head from "next/head";
import NavBar from "./navbar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Subscriber Revenue Calculator</title>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <header>
        <NavBar />
      </header>
      <main>{children}</main>
    </>
  );
}
