import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Downloads a DOM element as a high-resolution A4 PDF document
 */
export async function downloadElementAsPdf(
  elementId: string, 
  fileName: string = 'Prathibha_Karanji_Report.pdf',
  onProgress?: (status: string) => void
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  try {
    if (onProgress) onProgress('ವರದಿ ಇಮೇಜ್ ರೂಪಾಂತರಗೊಳ್ಳುತ್ತಿದೆ...');

    // Save previous scroll position
    const origScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure cloned element has solid white background for high clarity
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#ffffff';
        }
      },
    });

    window.scrollTo(0, origScrollY);

    if (onProgress) onProgress('PDF ರಚಿಸಲಾಗುತ್ತಿದೆ...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Remaining pages if the report spans multiple pages
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('PDF export error:', err);
    return false;
  }
}

/**
 * Downloads a DOM element as a PNG image file
 */
export async function downloadElementAsImage(
  elementId: string,
  fileName: string = 'Prathibha_Karanji_Report.png',
  onProgress?: (status: string) => void
): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return null;
  }

  try {
    if (onProgress) onProgress('ಇಮೇಜ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...');

    const origScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#ffffff';
        }
      },
    });

    window.scrollTo(0, origScrollY);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        resolve(blob);
      }, 'image/png');
    });
  } catch (err) {
    console.error('Image export error:', err);
    return null;
  }
}

/**
 * Shares report via WhatsApp:
 * 1. If mobile Web Share API with files is available, shares the ACTUAL IMAGE directly to WhatsApp!
 * 2. If desktop or fallback, downloads the image and opens WhatsApp with formatted summary.
 */
export async function shareReportWithImage(
  elementId: string,
  textMessage: string,
  fileName: string = 'Prathibha_Karanji_Winners.png',
  onNotification?: (msg: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    // Direct text fallback
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`, '_blank');
    return;
  }

  try {
    if (onNotification) onNotification('ವಾಟ್ಸಾಪ್‌ಗಾಗಿ ಇಮೇಜ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...');

    const origScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#ffffff';
        }
      },
    });

    window.scrollTo(0, origScrollY);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`, '_blank');
        return;
      }

      const file = new File([blob], fileName, { type: 'image/png' });

      // Check if browser supports sharing files (Mobile Android/iOS Chrome/Safari)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026-27 ವಿಜೇತರ ಪಟ್ಟಿ',
            text: textMessage,
            files: [file],
          });
          if (onNotification) onNotification('ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ');
          return;
        } catch (shareErr) {
          console.log('User cancelled or native share fallback:', shareErr);
        }
      }

      // Fallback for Desktop/unsupported:
      // Download the image automatically so the user can easily paste/attach it, and open WhatsApp with pre-filled text
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      if (onNotification) {
        onNotification('ಇಮೇಜ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ! ವಾಟ್ಸಾಪ್ ತೆರೆಯಲಾಗುತ್ತಿದೆ, ಅಲ್ಲಿ ಈ ಇಮೇಜ್ ಲಗತ್ತಿಸಿ.');
      }

      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`, '_blank');
      }, 600);
    }, 'image/png');
  } catch (err) {
    console.error('WhatsApp share error:', err);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textMessage)}`, '_blank');
  }
}
