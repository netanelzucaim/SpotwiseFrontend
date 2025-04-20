import { useEffect } from 'react';

const BotpressChat = () => {
  useEffect(() => {
    // First script: Botpress core inject.js
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // Second script: your specific bot script
    const botScript = document.createElement('script');
    botScript.src = 'https://files.bpcontent.cloud/2025/04/15/12/20250415123235-WWNJDCZN.js';
    botScript.async = true;
    document.body.appendChild(botScript);
  }, []);

  return null;
};

export default BotpressChat;