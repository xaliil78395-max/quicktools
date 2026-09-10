"use client";

import Script from "next/script";

export default function AdsterraAd() {
  return (
    <div className="w-full flex justify-center px-4 mt-10 mb-8">
      <div className="w-full max-w-4xl text-center">
        <Script
          async
          data-cfasync="false"
          src="https://pl31269005.profitableratecpmnetwork.com/46650acd4757fe794584a216e057f23b/invoke.js"
          strategy="afterInteractive"
        />
        <div id="container-46650acd4757fe794584a216e057f23b" />
      </div>
    </div>
  );
}
