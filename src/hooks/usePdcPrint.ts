import { Platform } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { generatePdcHtml } from '../utils/printPdc';
import { Producteur } from '../core/types/producteur';

export const usePdcPrint = () => {
  const handlePrint = async (producteur: Producteur) => {
    try {
      const html = generatePdcHtml(producteur);
      
      if (Platform.OS === 'web') {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        if (iframe.contentWindow) {
          iframe.onload = () => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
            }, 5000);
          };
          
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(html);
          iframe.contentWindow.document.close();
        } else {
          await Print.printAsync({ html });
        }
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      throw error;
    }
  };

  return { handlePrint };
};
