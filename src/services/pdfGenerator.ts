import jsPDF from 'jspdf';
import { Product, PRODUCT_CATEGORIES, Category } from '../types';

/**
 * Formats current date in Spanish, e.g. "24 de septiembre de 2026"
 */
function getFormattedCurrentDate(): string {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  return `${day} de ${month} de ${year}`;
}

/**
 * Generates and downloads a luxury branded PDF of Alzza's full menu.
 */
export async function generateMenuPDF(
  products: Product[],
  customCategories?: Category[]
): Promise<void> {
  // Filter active products
  const activeProducts = products.filter(
    (p) => p.status === 'activo' || p.activo === true
  );

  // Categorization order based on dynamic categories or defaults
  let categoriesInOrder: string[] = [];
  if (customCategories && customCategories.length > 0) {
    const sorted = [...customCategories]
      .filter((c) => c.status === 'activo')
      .sort((a, b) => a.order - b.order);
    categoriesInOrder = sorted.map((c) => c.name);
  } else {
    categoriesInOrder = [...PRODUCT_CATEGORIES];
  }

  // Add any extra categories found in active products
  activeProducts.forEach((p) => {
    const cat = p.category || p.categoria || 'Otras Creaciones';
    if (!categoriesInOrder.includes(cat as any)) {
      categoriesInOrder.push(cat);
    }
  });

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2;
  const bottomMargin = 22;

  // Alzza Luxury Palette
  const COLOR_WINE = [43, 11, 23] as const; // #2B0B17
  const COLOR_COPPER = [200, 155, 123] as const; // #C89B7B
  const COLOR_GOLD = [184, 134, 76] as const; // #B8864C
  const COLOR_DARK = [32, 26, 24] as const; // #201A18
  const COLOR_MUTED = [105, 90, 85] as const; // #695A55
  const COLOR_BG_LIGHT = [252, 250, 248] as const; // subtle cream

  let currentY = 0;

  // Top running header
  const drawPageHeader = (page: number) => {
    // Fill subtle top bar in Deep Wine (#2B0B17)
    doc.setFillColor(...COLOR_WINE);
    doc.rect(0, 0, pageWidth, page === 1 ? 6 : 4, 'F');

    // Copper accent line (#C89B7B)
    doc.setFillColor(...COLOR_COPPER);
    doc.rect(0, page === 1 ? 6 : 4, pageWidth, 0.8, 'F');

    if (page > 1) {
      // Compact top running header for subsequent pages
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLOR_WINE);
      doc.text('ALZZA', marginX, 12);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLOR_MUTED);
      doc.text('Gastronomía & Coctelería de Altura | Shopping de Encarnación', marginX + 18, 12);

      // Thin copper accent divider line
      doc.setDrawColor(...COLOR_COPPER);
      doc.setLineWidth(0.3);
      doc.line(marginX, 14.5, pageWidth - marginX, 14.5);
    }
  };

  // Check overflow and create new page if required
  const checkPageOverflow = (neededHeight: number): void => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      const newPageNum = doc.getNumberOfPages();
      drawPageHeader(newPageNum);
      currentY = 22;
    }
  };

  // PAGE 1 SETUP
  drawPageHeader(1);
  currentY = 14;

  // FIRST PAGE BRAND HEADER BOX
  doc.setFillColor(...COLOR_BG_LIGHT);
  doc.roundedRect(marginX, currentY, contentWidth, 38, 2, 2, 'F');

  // Copper border around header box
  doc.setDrawColor(...COLOR_COPPER);
  doc.setLineWidth(0.6);
  doc.roundedRect(marginX, currentY, contentWidth, 38, 2, 2, 'S');

  // Decorative inner wine frame
  doc.setDrawColor(...COLOR_WINE);
  doc.setLineWidth(0.2);
  doc.roundedRect(marginX + 1.5, currentY + 1.5, contentWidth - 3, 35, 1.5, 1.5, 'S');

  // Brand Title: ALZZA in luxury serif typography
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...COLOR_WINE);
  doc.text('A  L  Z  Z  A', pageWidth / 2, currentY + 12, { align: 'center' });

  // Subtitle: "Gastronomía & Coctelería de Altura | Shopping de Encarnación"
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_GOLD);
  doc.text('Gastronomía & Coctelería de Altura', pageWidth / 2, currentY + 18, { align: 'center' });

  // Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(
    'Shopping de Encarnación  •  Rooftop & Salón Experience  •  Encarnación, Paraguay',
    pageWidth / 2,
    currentY + 24,
    { align: 'center' }
  );

  // Ornamental Copper Line with center diamond
  doc.setDrawColor(...COLOR_COPPER);
  doc.setLineWidth(0.4);
  const ornamentWidth = 44;
  doc.line(pageWidth / 2 - ornamentWidth / 2, currentY + 27.5, pageWidth / 2 + ornamentWidth / 2, currentY + 27.5);
  doc.setFillColor(...COLOR_COPPER);
  doc.circle(pageWidth / 2, currentY + 27.5, 0.9, 'F');

  // Tagline
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...COLOR_DARK);
  doc.text(
    'CARTA DE TEMPORADA  •  CREACIONES DE AUTOR & ALTA COCINA',
    pageWidth / 2,
    currentY + 33,
    { align: 'center' }
  );

  currentY += 46;

  // LOOP THROUGH CATEGORIES
  for (const category of categoriesInOrder) {
    const categoryProducts = activeProducts.filter(
      (p) => (p.category || p.categoria) === category
    );

    if (categoryProducts.length === 0) continue;

    // Ensure category header and first item have room (~32mm)
    checkPageOverflow(32);

    // CATEGORY HEADER BAR (Deep Wine #2B0B17 with Copper edge)
    doc.setFillColor(...COLOR_WINE);
    doc.roundedRect(marginX, currentY, contentWidth, 7.5, 1, 1, 'F');

    // Copper accent indicator
    doc.setFillColor(...COLOR_COPPER);
    doc.rect(marginX, currentY, 3, 7.5, 'F');

    // Category Title
    doc.setFont('times', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text(category.toUpperCase(), marginX + 6, currentY + 5.2);

    // Item count indicator
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_COPPER);
    doc.text(
      `${categoryProducts.length} ${categoryProducts.length === 1 ? 'creación' : 'creaciones'}`,
      pageWidth - marginX - 4,
      currentY + 5.2,
      { align: 'right' }
    );

    currentY += 12;

    // RENDER ITEMS IN THIS CATEGORY
    for (const item of categoryProducts) {
      const name = item.name || item.nombre || 'Creación Alzza';
      const rawPrice = item.price || item.precio || '';
      const desc = item.description || item.descripcion || '';
      const badge = item.badge || (item.tag ? item.tag : '');

      // Estimate item height
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const splitDesc = doc.splitTextToSize(desc, contentWidth - 34);
      const descHeight = splitDesc.length * 3.5;
      const totalItemHeight = Math.max(13, 7 + descHeight);

      checkPageOverflow(totalItemHeight + 2);

      // Item Name
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLOR_WINE);
      doc.text(name, marginX, currentY);

      const nameWidth = doc.getTextWidth(name);

      // Distinct Badge Indicator ("Firma Alzza", "Recomendado", etc.)
      let badgeOffset = marginX + nameWidth + 2.5;
      if (badge) {
        doc.setFillColor(245, 237, 230);
        doc.setDrawColor(...COLOR_COPPER);
        doc.setLineWidth(0.2);

        const badgeLabel = badge.toUpperCase();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        const badgeTextWidth = doc.getTextWidth(badgeLabel);

        doc.roundedRect(badgeOffset, currentY - 3.2, badgeTextWidth + 4, 4.2, 0.8, 0.8, 'FD');
        doc.setTextColor(...COLOR_WINE);
        doc.text(badgeLabel, badgeOffset + 2, currentY - 0.2);
        badgeOffset += badgeTextWidth + 6;
      }

      // Price on Right
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...COLOR_GOLD);
      doc.text(rawPrice, pageWidth - marginX, currentY, { align: 'right' });

      const priceWidth = doc.getTextWidth(rawPrice);

      // Subtle dotted leader line
      const dotStartX = badgeOffset + 2;
      const dotEndX = pageWidth - marginX - priceWidth - 2;

      if (dotEndX > dotStartX + 8) {
        doc.setFillColor(210, 195, 185);
        let dx = dotStartX;
        while (dx < dotEndX) {
          doc.circle(dx, currentY - 0.8, 0.25, 'F');
          dx += 2.2;
        }
      }

      // Ingredients / Description
      if (desc) {
        currentY += 4.2;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...COLOR_MUTED);
        doc.text(splitDesc, marginX, currentY);
        currentY += splitDesc.length * 3.6;
      } else {
        currentY += 5;
      }

      // Subtle separator line
      doc.setDrawColor(240, 235, 230);
      doc.setLineWidth(0.2);
      doc.line(marginX, currentY + 0.5, pageWidth - marginX, currentY + 0.5);

      currentY += 4;
    }

    currentY += 3; // Gap between categories
  }

  // DRAW FOOTER ON ALL PAGES WITH ACCURATE PAGE COUNT
  const totalPages = doc.getNumberOfPages();
  const currentDateFormatted = getFormattedCurrentDate();

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const footerY = pageHeight - 12;

    // Copper accent divider line
    doc.setDrawColor(...COLOR_COPPER);
    doc.setLineWidth(0.4);
    doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

    // Left Contact details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(
      'Shopping de Encarnación  •  WhatsApp: +595 985 100 935  •  Instagram: @alzza.py',
      marginX,
      footerY
    );

    // Right Date Stamp and Page Count
    const rightText = `Carta actualizada al ${currentDateFormatted}  |  Pág. ${p} de ${totalPages}`;
    doc.text(rightText, pageWidth - marginX, footerY, { align: 'right' });
  }

  // Trigger browser download
  const filename = 'Carta_Alzza_Gastronomia_Cocteleria.pdf';
  doc.save(filename);
}
