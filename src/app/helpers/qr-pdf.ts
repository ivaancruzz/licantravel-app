import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { TicketList } from '../services/ticket.service';
import { Tables } from '../lib/database.types';
import fileDownload from 'js-file-download';
import dayjs from 'dayjs';

async function generateTicketPDF(
  ticket: TicketList,
  client: Tables<'clients'>,
  qrImageUrl: string,
  logoUrl: string = '',
) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Cargar logo desde URL
  const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  page.drawImage(logoImage, {
    x: 50,
    y: height - 80,
    width: 176,
    height: 50,
  });

  // Cargar código QR desde URL proporcionada
  const qrBytes = Uint8Array.from(atob(qrImageUrl.split(',')[1]), (c) =>
    c.charCodeAt(0),
  );
  const qrImage = await pdfDoc.embedPng(qrBytes);
  page.drawImage(qrImage, {
    x: width / 2 - 75,
    y: height - 250,
    width: 150,
    height: 150,
  });

  page.drawText(`Ticket Code: ${ticket.code}`, {
    x: 50,
    y: height - 300,
    font,
    size: 12,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Atracción: ${ticket.products.name}`, {
    x: 50,
    y: height - 320,
    font,
    size: 12,
  });
  page.drawText(`Región: ${ticket.products.providers.region}`, {
    x: 50,
    y: height - 340,
    font,
    size: 12,
  });
  page.drawText(`Comuna: ${ticket.products.providers.commune}`, {
    x: 50,
    y: height - 360,
    font,
    size: 12,
  });
  page.drawText(`Dirección: ${ticket.products.providers.address}`, {
    x: 50,
    y: height - 380,
    font,
    size: 12,
  });
  page.drawText(`Cliente: ${client.first_name} ${client.last_name}`, {
    x: 50,
    y: height - 420,
    font,
    size: 12,
  });
  page.drawText(`Identificación: ${client.document}`, {
    x: 50,
    y: height - 440,
    font,
    size: 12,
  });
  page.drawText(`Email: ${client.email}`, {
    x: 50,
    y: height - 460,
    font,
    size: 12,
  });

  const now = dayjs().format('DD/MM/YYYY HH:mm').toLocaleString();
  page.drawText(`Generado el: ${now}`, {
    x: 50,
    y: 50,
    font,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  fileDownload(
    pdfBytes,
    `${ticket.products.name}-TICKET-[${ticket.code}].pdf`,
    'application/pdf',
  );

  return url;
}

export default generateTicketPDF;
