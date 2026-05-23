import { Resend } from 'resend';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement, type ReactElement } from 'react';
import type { DocumentProps } from '@react-pdf/renderer';
import { InvoiceDocument, InvoiceOrder } from './invoice';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'faktury@atlanticave.cz';

export async function sendInvoiceEmail(order: InvoiceOrder): Promise<void> {
  const pdfBuffer = await renderToBuffer(
    createElement(InvoiceDocument, { order }) as unknown as ReactElement<DocumentProps>
  );

  const filename = `faktura-${order.id.slice(0, 8).toUpperCase()}.pdf`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email!,
    subject: `Faktura k objednávce #${order.id.slice(0, 8).toUpperCase()} – Atlantic Ave`,
    html: buildEmailHtml(order),
    attachments: [
      {
        filename,
        content: pdfBuffer,
      },
    ],
  });
}

function buildEmailHtml(order: InvoiceOrder): string {
  const itemsTotal = order.total - order.shipping;

  const itemRows = order.order_items
    .map(
      item => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;">${item.products?.name ?? '—'}</td>
        <td style="padding:8px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">${item.size}</td>
        <td style="padding:8px 8px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#666;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:14px;color:#222;text-align:right;">${fmt(item.price * item.quantity)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding:36px 40px 28px;border-bottom:1px solid #ebebeb;">
            <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:4px;color:#0a0a0a;">ATLANTIC AVE</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 24px;">
            <h1 style="margin:0 0 8px;font-size:22px;color:#0a0a0a;">Vaše objednávka je potvrzena</h1>
            <p style="margin:0;font-size:14px;color:#666;line-height:1.6;">
              Děkujeme za nákup${order.customer_name ? `, ${order.customer_name}` : ''}! V příloze najdete fakturu k objednávce <strong>#${order.id.slice(0, 8).toUpperCase()}</strong>.
            </p>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th style="padding-bottom:8px;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;text-align:left;border-bottom:1px solid #e5e5e5;">Produkt</th>
                  <th style="padding-bottom:8px;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;text-align:center;border-bottom:1px solid #e5e5e5;">Vel.</th>
                  <th style="padding-bottom:8px;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;text-align:center;border-bottom:1px solid #e5e5e5;">Ks</th>
                  <th style="padding-bottom:8px;font-size:11px;font-weight:600;color:#999;text-transform:uppercase;letter-spacing:1px;text-align:right;border-bottom:1px solid #e5e5e5;">Cena</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:240px;margin-left:auto;">
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#666;">Mezisoučet</td>
                <td style="padding:4px 0;font-size:13px;color:#333;text-align:right;">${fmt(itemsTotal)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:13px;color:#666;">Doprava</td>
                <td style="padding:4px 0;font-size:13px;color:#333;text-align:right;">${fmt(order.shipping)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0 4px;font-size:15px;font-weight:700;color:#0a0a0a;border-top:1px solid #e5e5e5;">Celkem</td>
                <td style="padding:10px 0 4px;font-size:15px;font-weight:700;color:#0a0a0a;text-align:right;border-top:1px solid #e5e5e5;">${fmt(order.total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;background:#f9f9f9;border-top:1px solid #ebebeb;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
              Atlantic Ave · faktury@atlanticave.cz<br>
              Tento email byl odeslán automaticky, prosím neodpovídejte na něj.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function fmt(halerek: number): string {
  return (halerek / 100).toLocaleString('cs-CZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Kč';
}
