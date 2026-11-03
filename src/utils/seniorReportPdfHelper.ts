import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

/**
 * Dedicated PDF & Image Export Helper for Senior Section Winners Report (ಹಿರಿಯ ವಿಭಾಗ 5-7)
 * Tailored specifically for the 2-page Karnataka Government Pratibha Karanji report layout
 */

export async function exportSeniorReportPdf(
  elementId: string = 'senior-report-paper',
  fileName: string = 'Senior_Winners_Report_2026_27.pdf',
  onProgress?: (msg: string) => void
): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found`);
    return false;
  }

  try {
    if (onProgress) onProgress('ಹಿರಿಯ ವಿಭಾಗದ ವರದಿ ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...');

    const origScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDoc) => {
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          clonedEl.style.backgroundColor = '#ffffff';
          clonedEl.style.color = '#000000';
          clonedEl.querySelectorAll('table, th, td').forEach((cell) => {
            (cell as HTMLElement).style.borderColor = '#000000';
          });
        }
      },
    });

    window.scrollTo(0, origScrollY);

    if (onProgress) onProgress('A4 PDF ರಚಿಸಲಾಗುತ್ತಿದೆ...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Remaining pages
    while (heightLeft > 5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Senior PDF Export Error:', err);
    window.print();
    return true;
  }
}

export async function exportSeniorReportImage(
  elementId: string = 'senior-report-paper',
  fileName: string = 'Senior_Winners_Report_2026_27.png',
  onProgress?: (msg: string) => void
): Promise<Blob | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;

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
        if (clonedEl) clonedEl.style.backgroundColor = '#ffffff';
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
    console.error('Senior Image Export Error:', err);
    return null;
  }
}

export async function shareSeniorReportWhatsApp(
  elementId: string = 'senior-report-paper',
  messageText: string,
  fileName: string = 'Senior_Winners_2026_27.png',
  onNotification?: (msg: string) => void
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
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
    });

    window.scrollTo(0, origScrollY);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
        return;
      }

      const file = new File([blob], fileName, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'ಹಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರ ಪಟ್ಟಿ',
            text: messageText,
            files: [file],
          });
          if (onNotification) onNotification('ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ಹಂಚಿಕೊಳ್ಳಲಾಗಿದೆ!');
          return;
        } catch {
          // Fallback below
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      if (onNotification) {
        onNotification('ವರದಿಯ ಇಮೇಜ್ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ! ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸುಲಭವಾಗಿ ಲಗತ್ತಿಸಬಹುದು.');
      }

      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
      }, 500);
    }, 'image/png');
  } catch {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, '_blank');
  }
}
