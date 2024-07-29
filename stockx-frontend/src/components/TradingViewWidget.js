import React, { useEffect } from 'react';

const TradingViewWidget = ({ width, height }) => {
  useEffect(() => {
    const widgetContainer = document.getElementById('tradingview-widget');
    widgetContainer.innerHTML = ''; // Clear the container before appending the script

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      feedMode: 'all_symbols',
      isTransparent: false,
      displayMode: 'regular',
      width: width,
      height: height,
      colorTheme: 'dark',
      locale: 'en'
    });
    widgetContainer.appendChild(script);
  }, [width, height]); // Add width and height as dependencies to re-render when they change

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview-widget" className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TradingViewWidget;
