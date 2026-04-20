/**
 * CobbleOpen — Backend de Pagamentos
 * Mercado Pago: PIX + Cartão de Crédito
 * Entrega automática via RCON
 */

const path       = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express    = require('express');
const cors       = require('cors');
const crypto     = require('crypto');
const fs         = require('fs');
const { v4: uuidv4 } = require('uuid');
const { MercadoPagoConfig, Payment } = require('mercadopago');

const { PRODUCTS } = require('./products');
const { deliver }  = require('./rcon');

/* ── Mercado Pago ── */
const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 10000 },
});
const mpPayment = new Payment(mpClient);

/* ── Express ── */
const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
// Webhook precisa do raw body para validar assinatura
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

/* ── Pedidos (persistência em JSON) ── */
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function loadOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8')); }
  catch { return {}; }
}
function saveOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}
const orders = loadOrders();

function saveOrder(order) {
  orders[order.id] = order;
  saveOrders(orders);
}

/* ════════════════════════════════════════════
   GET /api/config  — chave pública para o frontend
════════════════════════════════════════════ */
app.get('/api/config', (req, res) => {
  res.json({ publicKey: process.env.MP_PUBLIC_KEY });
});

/* ════════════════════════════════════════════
   GET /api/products  — catálogo completo
════════════════════════════════════════════ */
app.get('/api/products', (req, res) => {
  const catalog = Object.values(PRODUCTS).map(({ id, name, price, description }) => ({
    id, name, price, description,
  }));
  res.json(catalog);
});

/* ════════════════════════════════════════════
   POST /api/pix  — criar pagamento PIX
════════════════════════════════════════════ */
app.post('/api/pix', async (req, res) => {
  const { productId, nick, email, firstName, lastName, cpf } = req.body;

  if (!productId || !nick || !email || !cpf) {
    return res.status(400).json({ error: 'Campos obrigatórios: productId, nick, email, cpf' });
  }

  const product = PRODUCTS[productId];
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

  const orderId    = uuidv4();
  const idempotKey = uuidv4();

  try {
    const pixResponse = await mpPayment.create({
      body: {
        transaction_amount: product.price,
        description:        `${product.name} — CobbleOpen`,
        payment_method_id:  'pix',
        payer: {
          email,
          first_name:      firstName || nick,
          last_name:        lastName  || '',
          identification:  { type: 'CPF', number: cpf.replace(/\D/g, '') },
        },
        metadata: { orderId, nick, productId },
        notification_url: `${process.env.WEBHOOK_URL || 'https://SEU_BACKEND.onrender.com'}/api/webhook`,
      },
      requestOptions: { idempotencyKey: idempotKey },
    });

    const txData = pixResponse.point_of_interaction?.transaction_data;

    const order = {
      id:          orderId,
      mpId:        pixResponse.id,
      productId,
      productName: product.name,
      price:       product.price,
      nick,
      email,
      status:      'pending',
      method:      'pix',
      createdAt:   Date.now(),
    };
    saveOrder(order);

    console.log(`[PIX] Pedido criado: ${orderId} | ${nick} | ${product.name} | R$ ${product.price}`);

    res.json({
      orderId,
      mpId:         pixResponse.id,
      qrCode:       txData?.qr_code,
      qrCodeBase64: txData?.qr_code_base64,
      expiresAt:    pixResponse.date_of_expiration,
      amount:       product.price,
      productName:  product.name,
    });

  } catch (err) {
    console.error('[PIX] Erro ao criar:', err.message, err.cause);
    res.status(500).json({ error: 'Erro ao gerar PIX. Tente novamente.' });
  }
});

/* ════════════════════════════════════════════
   POST /api/card  — processar pagamento por cartão
════════════════════════════════════════════ */
app.post('/api/card', async (req, res) => {
  const {
    productId, nick, email, firstName, lastName, cpf,
    token, installments, paymentMethodId, issuerId,
  } = req.body;

  if (!productId || !nick || !email || !cpf || !token) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const product = PRODUCTS[productId];
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

  const orderId    = uuidv4();
  const idempotKey = uuidv4();

  try {
    const cardResponse = await mpPayment.create({
      body: {
        transaction_amount: product.price,
        description:        `${product.name} — CobbleOpen`,
        token,
        installments:       installments || 1,
        payment_method_id:  paymentMethodId,
        issuer_id:          issuerId,
        payer: {
          email,
          first_name:      firstName || nick,
          last_name:        lastName  || '',
          identification:  { type: 'CPF', number: cpf.replace(/\D/g, '') },
        },
        metadata: { orderId, nick, productId },
        notification_url: `${process.env.WEBHOOK_URL || 'https://SEU_BACKEND.onrender.com'}/api/webhook`,
      },
      requestOptions: { idempotencyKey: idempotKey },
    });

    const order = {
      id:          orderId,
      mpId:        cardResponse.id,
      productId,
      productName: product.name,
      price:       product.price,
      nick,
      email,
      status:      cardResponse.status,
      method:      'card',
      createdAt:   Date.now(),
    };
    saveOrder(order);

    console.log(`[CARD] Pedido ${orderId} — status: ${cardResponse.status}`);

    if (cardResponse.status === 'approved') {
      await deliver(nick, product.commands(nick), orderId);
      order.status = 'delivered';
      saveOrder(order);
      return res.json({ status: 'approved', orderId, productName: product.name });
    }

    if (cardResponse.status === 'in_process') {
      return res.json({ status: 'in_process', orderId, message: 'Pagamento em análise.' });
    }

    const detail = cardResponse.status_detail;
    const errorMessages = {
      cc_rejected_insufficient_amount: 'Saldo insuficiente no cartão.',
      cc_rejected_bad_filled_card_number: 'Número do cartão inválido.',
      cc_rejected_bad_filled_security_code: 'CVV inválido.',
      cc_rejected_bad_filled_date: 'Data de validade inválida.',
      cc_rejected_call_for_authorize: 'Cartão bloqueado. Ligue para o banco.',
      cc_rejected_blacklist: 'Cartão recusado.',
    };
    return res.status(402).json({
      status: 'rejected',
      message: errorMessages[detail] || 'Pagamento recusado. Tente outro cartão.',
    });

  } catch (err) {
    console.error('[CARD] Erro:', err.message);
    res.status(500).json({ error: 'Erro ao processar pagamento. Tente novamente.' });
  }
});

/* ════════════════════════════════════════════
   GET /api/payment/:id/status  — polling de status
════════════════════════════════════════════ */
app.get('/api/payment/:orderId/status', (req, res) => {
  const order = orders[req.params.orderId];
  if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json({ status: order.status, productName: order.productName });
});

/* ════════════════════════════════════════════
   POST /api/webhook  — notificação do Mercado Pago
════════════════════════════════════════════ */
app.post('/api/webhook', async (req, res) => {
  // Responde 200 imediatamente (requisito do MP)
  res.sendStatus(200);

  try {
    const rawBody = req.body;
    const body    = JSON.parse(rawBody.toString());

    // Validar assinatura (recomendado em produção)
    if (process.env.MP_WEBHOOK_SECRET) {
      const xSignature  = req.headers['x-signature']  || '';
      const xRequestId  = req.headers['x-request-id'] || '';
      const dataId      = body?.data?.id || '';
      const ts          = xSignature.match(/ts=(\d+)/)?.[1] || '';
      const v1          = xSignature.match(/v1=([a-f0-9]+)/)?.[1] || '';
      const manifest    = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const expected    = crypto.createHmac('sha256', process.env.MP_WEBHOOK_SECRET)
                                .update(manifest)
                                .digest('hex');
      if (v1 && v1 !== expected) {
        console.warn('[Webhook] Assinatura inválida — ignorado');
        return;
      }
    }

    if (body.type !== 'payment' || !body.data?.id) return;

    const mpId      = String(body.data.id);
    const mpDetails = await mpPayment.get({ id: mpId });

    if (mpDetails.status !== 'approved') return;

    const meta = mpDetails.metadata || {};
    const orderId   = meta.order_id   || meta.orderId;
    const nick      = meta.nick;
    const productId = meta.product_id || meta.productId;

    if (!orderId || !nick || !productId) {
      console.warn('[Webhook] Metadata incompleta:', meta);
      return;
    }

    const order = orders[orderId];
    if (!order) {
      console.warn('[Webhook] Pedido não encontrado:', orderId);
      return;
    }
    if (order.status === 'delivered') {
      console.log('[Webhook] Pedido já entregue:', orderId);
      return;
    }

    const product = PRODUCTS[productId];
    if (!product) {
      console.error('[Webhook] Produto não encontrado:', productId);
      return;
    }

    console.log(`[Webhook] ✓ Pagamento aprovado — pedido ${orderId} | ${nick} | ${product.name}`);
    await deliver(nick, product.commands(nick), orderId);

    order.status = 'delivered';
    order.approvedAt = Date.now();
    saveOrder(order);

  } catch (err) {
    console.error('[Webhook] Erro:', err.message);
  }
});

/* ── Iniciar ── */
app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════╗`);
  console.log(`║  CobbleOpen Backend  :${PORT}      ║`);
  console.log(`╚══════════════════════════════════╝`);
  console.log(`  MP Access Token: ${process.env.MP_ACCESS_TOKEN ? '✓ configurado' : '✗ FALTANDO'}`);
  console.log(`  RCON Host:       ${process.env.RCON_HOST || 'localhost'}:${process.env.RCON_PORT || 25575}`);
  console.log(`  Frontend URL:    ${process.env.FRONTEND_URL || '*'}\n`);
});
