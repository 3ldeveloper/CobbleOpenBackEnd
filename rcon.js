/**
 * Módulo RCON — entrega de itens no servidor Minecraft.
 * Fila com retry automático para pagamentos aprovados com servidor offline.
 */

const { Rcon } = require('rcon-client');
const fs = require('fs');
const path = require('path');

const QUEUE_FILE = path.join(__dirname, 'delivery_queue.json');

/* ── Fila persistente ── */
function loadQueue() {
  try { return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8')); }
  catch { return []; }
}

function saveQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

let deliveryQueue = loadQueue();

/* ── Conexão RCON ── */
async function rconSend(command) {
  const rcon = await Rcon.connect({
    host:     process.env.RCON_HOST     || 'localhost',
    port:     parseInt(process.env.RCON_PORT || '25575'),
    password: process.env.RCON_PASSWORD || '',
    timeout:  5000,
  });
  try {
    const response = await rcon.send(command);
    return response;
  } finally {
    rcon.end();
  }
}

/* ── Entregar lista de comandos ── */
async function deliverCommands(commands, orderId) {
  const failed = [];
  for (const cmd of commands) {
    try {
      await rconSend(cmd);
      console.log(`[RCON] ✓ ${cmd}`);
    } catch (err) {
      console.error(`[RCON] ✗ "${cmd}" — ${err.message}`);
      failed.push(cmd);
    }
  }
  return failed;
}

/* ── Entrega com retry ── */
async function deliver(nick, commands, orderId) {
  console.log(`[Entrega] Iniciando pedido ${orderId} para ${nick}`);
  const failed = await deliverCommands(commands, orderId);

  if (failed.length > 0) {
    // Coloca comandos que falharam na fila para retry
    deliveryQueue.push({ orderId, nick, commands: failed, attempts: 1, createdAt: Date.now() });
    saveQueue(deliveryQueue);
    console.warn(`[Entrega] ${failed.length} comando(s) na fila de retry — pedido ${orderId}`);
  } else {
    console.log(`[Entrega] ✓ Pedido ${orderId} entregue com sucesso`);
  }
}

/* ── Retry automático a cada 5 minutos ── */
async function processQueue() {
  if (deliveryQueue.length === 0) return;

  console.log(`[Fila] Processando ${deliveryQueue.length} item(ns) pendente(s)...`);
  const stillFailed = [];

  for (const item of deliveryQueue) {
    if (item.attempts >= 10) {
      console.error(`[Fila] Pedido ${item.orderId} excedeu 10 tentativas — abandonado`);
      continue;
    }
    const failed = await deliverCommands(item.commands, item.orderId);
    if (failed.length > 0) {
      stillFailed.push({ ...item, commands: failed, attempts: item.attempts + 1 });
    } else {
      console.log(`[Fila] ✓ Pedido ${item.orderId} entregue após ${item.attempts + 1} tentativa(s)`);
    }
  }

  deliveryQueue = stillFailed;
  saveQueue(deliveryQueue);
}

setInterval(processQueue, 5 * 60 * 1000); // a cada 5 minutos

module.exports = { deliver, rconSend };
