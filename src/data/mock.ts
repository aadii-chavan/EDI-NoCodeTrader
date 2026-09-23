/** Sample market + activity data carried over from the design mockup. */

export type Sym = { s: string; n: string; p: number }
export type AuditRow = {
  ts: string; sym: string; signal: string
  decision: 'Executed' | 'Rejected'
  qty: string; tag: string; order: string; rationale: string; day: string
}
export type SentencePart = { t: string; pill: boolean }
export type Strat = {
  name: string
  status: 'Active' | 'Paused' | 'Draft'
  pnl: string; pnlLabel: string; up: boolean
  sentence: SentencePart[]
  /** Monitoring context — what this strategy trades and how its feed reads. */
  sym: string
  qty: number
  avgPrice: number
  trigger: string
  triggerText: string
  orderId: string
}
export type Notif = {
  time: string; tag: string; title: string; body: string
  unread: boolean; action?: string; goTo?: string
}
export type FeedEntry = { tag?: string; kind?: 'reject'; title: string; body: string }
export type FeedContext = {
  sym: string; qty: number; trigger: string; triggerText: string; orderId: string
}

const SYMS: Sym[] = [
  { s: 'RELIANCE', n: 'Reliance Industries Ltd', p: 2850 },
  { s: 'TCS', n: 'Tata Consultancy Services', p: 4120 },
  { s: 'INFY', n: 'Infosys Ltd', p: 1585 },
  { s: 'HDFC BANK', n: 'HDFC Bank Ltd', p: 1690 },
  { s: 'ICICI BANK', n: 'ICICI Bank Ltd', p: 1245 },
  { s: 'WIPRO', n: 'Wipro Ltd', p: 498 }
];
const METRICS: string[] = ['Price', 'Moving Average Crossover', 'RSI', 'MACD', 'Volume', 'Bollinger Band', 'SuperTrend', 'VWAP'];
const CMPS: string[] = ['crosses above', 'crosses below', 'is greater than', 'is less than', 'rises by %', 'falls by %'];
const DAYS: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const COMPARE = 'Compare two stocks';

const AUDIT_RAW = [
  { ts: '17 Sep · 10:04:12', sym: 'RELIANCE', signal: 'Price crossed above ₹2,850', decision: 'Executed', qty: '18', tag: 'Risk OK · IP OK', order: 'NSE-8841207', rationale: 'Price printed ₹2,851.40 on the 1-minute close, clearing the ₹2,850 trigger. Volatility-adjusted size came to 18 shares — ₹51,325 notional, ₹4,780 of risk against your ₹5,000 ceiling. Static IP matched the whitelist and the 2FA session was 6 minutes old, so the order was released to the broker immediately.', day: '17 Sep' },
  { ts: '17 Sep · 10:04:41', sym: 'RELIANCE', signal: 'Duplicate trigger within 30s', decision: 'Rejected', qty: '—', tag: 'Duplicate guard', order: '', rationale: 'A second identical trigger arrived 29 seconds after the first. The duplicate-signal window is 30 seconds, so this signal was rejected before sizing. No order was sent. The rejection is logged here permanently and counts against nothing — your position is unchanged.', day: '17 Sep' },
  { ts: '17 Sep · 13:22:08', sym: 'TCS', signal: 'RSI fell below 32', decision: 'Executed', qty: '11', tag: 'Risk OK · 2FA OK', order: 'NSE-8841944', rationale: '14-period RSI printed 31.6, below your 32 threshold. Sizing produced 11 shares (₹45,320 notional) with ₹4,110 of modelled risk. All four compliance checks passed.', day: '17 Sep' },
  { ts: '17 Sep · 14:58:30', sym: 'INFY', signal: 'Computed size breached ceiling', decision: 'Rejected', qty: '—', tag: 'Risk ceiling', order: '', rationale: 'The trigger was valid, but the volatility-adjusted quantity implied ₹6,240 of risk — above your ₹5,000 per-trade ceiling. The engine does not silently resize. The signal was rejected and no order was placed.', day: '17 Sep' },
  { ts: '16 Sep · 09:47:55', sym: 'HDFC BANK', signal: '20/50 MA crossover (bullish)', decision: 'Executed', qty: '26', tag: 'Risk OK · IP OK', order: 'NSE-8833102', rationale: 'The 20-period moving average crossed above the 50-period on the 5-minute series. Realised volatility was low that session, so sizing allowed 26 shares at ₹1,688.20 — ₹3,910 of risk, comfortably inside the ceiling.', day: '16 Sep' },
  { ts: '16 Sep · 11:15:03', sym: 'WIPRO', signal: 'Volume spiked 2.4× average', decision: 'Executed', qty: '84', tag: 'Risk OK · 2FA OK', order: 'NSE-8833618', rationale: 'Traded volume on the 1-minute bar reached 2.4× the 20-bar average while price held above VWAP. 84 shares at ₹497.80; ₹4,620 of risk.', day: '16 Sep' },
  { ts: '16 Sep · 14:31:19', sym: 'ICICI BANK', signal: 'Price fell below ₹1,240', decision: 'Rejected', qty: '—', tag: 'Outside time window', order: '', rationale: 'The trigger fired at 14:31, outside your 09:20–14:00 run window. Signals outside the window are never acted on, only recorded.', day: '16 Sep' },
  { ts: '15 Sep · 09:52:40', sym: 'RELIANCE', signal: 'SuperTrend flipped to buy', decision: 'Executed', qty: '17', tag: 'Risk OK · IP OK', order: 'NSE-8826455', rationale: 'SuperTrend (10, 3) flipped to the buy side at ₹2,842.10. Sizing gave 17 shares; ₹4,840 of risk. Take-profit at 4% and stop-loss at 2% were attached as broker-side orders in the same request.', day: '15 Sep' },
  { ts: '15 Sep · 12:09:11', sym: 'TCS', signal: 'MACD histogram turned positive', decision: 'Executed', qty: '9', tag: 'Risk OK · 2FA OK', order: 'NSE-8826901', rationale: 'MACD (12, 26, 9) histogram crossed zero from below. 9 shares at ₹4,109.60; ₹3,270 of risk.', day: '15 Sep' },
  { ts: '15 Sep · 15:04:57', sym: 'INFY', signal: 'Price crossed above ₹1,585', decision: 'Rejected', qty: '—', tag: 'Square-off window', order: '', rationale: 'The signal arrived inside the 15:00–15:30 intraday square-off window, when new intraday entries are blocked by policy. Rejected before sizing.', day: '15 Sep' },
  { ts: '14 Sep · 10:26:34', sym: 'ICICI BANK', signal: 'Bollinger lower band touched', decision: 'Executed', qty: '31', tag: 'Risk OK · IP OK', order: 'NSE-8819274', rationale: 'Price tagged the lower Bollinger band (20, 2) at ₹1,243.15 and closed back inside it. 31 shares; ₹4,290 of risk.', day: '14 Sep' },
  { ts: '14 Sep · 13:41:02', sym: 'WIPRO', signal: 'Price crossed below VWAP', decision: 'Executed', qty: '77', tag: 'Risk OK · 2FA OK', order: 'NSE-8819810', rationale: 'Price closed below session VWAP on rising volume, satisfying the exit-and-reverse leg. 77 shares at ₹496.40; ₹4,010 of risk. Broker acknowledged the order in 180 ms.', day: '14 Sep' },
  { ts: '13 Sep · 11:03:48', sym: 'HDFC BANK', signal: 'RSI rose above 68', decision: 'Rejected', qty: '—', tag: 'Duplicate guard', order: '', rationale: 'An identical RSI trigger had been processed 22 seconds earlier. Suppressed by the 30-second duplicate window; logged for the record.', day: '13 Sep' }
];

function sent(arr: (string | [string])[]): SentencePart[] {
  return arr.map(x => (Array.isArray(x) ? { t: x[0], pill: true } : { t: x, pill: false }))
}

const STRATS: Strat[] = [
  { name: 'RELIANCE MA Cross', status: 'Active', pnl: '+₹4,180', pnlLabel: 'P&L today', up: true,
    sym: 'RELIANCE', qty: 18, avgPrice: 2851.4, trigger: '₹2,850',
    triggerText: 'the 20-period average crossed above the 50-period', orderId: 'NSE-8841207',
    sentence: sent(['When ', ['RELIANCE'], ' ', ['price'], ' crosses above its ', ['20-day average'], ', buy up to ', ['₹20,000'], '.']) },
  { name: 'TCS Oversold Bounce', status: 'Active', pnl: '+₹2,614', pnlLabel: 'P&L today', up: true,
    sym: 'TCS', qty: 11, avgPrice: 4109.6, trigger: '32',
    triggerText: '14-period RSI printed 31.6, below the 32 threshold', orderId: 'NSE-8841944',
    sentence: sent(['When ', ['TCS'], ' ', ['RSI'], ' falls below ', ['32'], ', buy a volatility-adjusted quantity, risking ', ['₹5,000'], '.']) },
  { name: 'WIPRO Volume Spike', status: 'Paused', pnl: '−₹382', pnlLabel: 'Last known P&L', up: false,
    sym: 'WIPRO', qty: 84, avgPrice: 497.8, trigger: '2× average',
    triggerText: 'traded volume reached 2.4× the 20-bar average while price held above VWAP',
    orderId: 'NSE-8833618',
    sentence: sent(['When ', ['WIPRO'], ' ', ['volume'], ' rises above ', ['2× average'], ' and price holds above ', ['VWAP'], ', buy ', ['80 shares'], '.']) },
  { name: 'ICICI Band Reversion', status: 'Draft', pnl: '₹0', pnlLabel: 'Never run', up: true,
    sym: 'ICICI BANK', qty: 31, avgPrice: 1243.15, trigger: 'lower band',
    triggerText: 'price tagged the lower Bollinger band and closed back inside it',
    orderId: 'NSE-8819274',
    sentence: sent(['When ', ['ICICI BANK'], ' touches its ', ['lower Bollinger band'], ', buy up to ', ['₹12,000'], '.']) }
];

const NOTIFS: Notif[] = [
  { time: '14:58', tag: 'Session', title: 'Broker session will expire in 15 minutes', body: 'Daily session termination is mandatory. Re-authenticate with Zerodha to keep live monitoring running past 15:15.', unread: true, action: 'Re-authenticate' },
  { time: '14:22', tag: 'Paused', title: 'Strategy paused: RELIANCE MA Cross', body: 'Daily loss limit reached. No further orders will be placed today; the strategy resumes tomorrow only if you restart it.', unread: true, goTo: 'monitor' },
  { time: '13:22', tag: 'Executed', title: 'New trade executed: TCS, +₹412', body: 'Bought 11 shares at ₹4,109.60 on an RSI trigger. Exit legs attached at +4% / −2%.', unread: true, goTo: 'audit' },
  { time: '10:04', tag: 'Rejected', title: 'Duplicate signal rejected on RELIANCE', body: 'A second identical trigger arrived 29 seconds after the first. Nothing was sent to the broker; the rejection is in your audit log.', unread: false, goTo: 'audit' },
  { time: '09:04', tag: 'Connected', title: 'Broker connected for today', body: 'Zerodha session authenticated at 09:04 IST. Static IP matched the whitelist.', unread: false }
];

/**
 * The decision feed reads as a narrative about one specific strategy, so it is
 * built per strategy rather than shared.
 */
function feedFor({ sym, qty, trigger, triggerText, orderId }: FeedContext): FeedEntry[] {
  return [
    { tag: 'Scan', title: `Checked ${sym} against condition 1`, body: `No match on the latest 1-minute close — ${trigger} trigger not reached. No action taken.` },
    { tag: 'Signal', title: `Trigger matched on ${sym}`, body: `${triggerText[0].toUpperCase()}${triggerText.slice(1)}. Passing to validation.` },
    { tag: 'Validation', title: 'Signal validated', body: 'Trigger confirmed on two consecutive ticks and inside the 09:20–15:10 run window.' },
    { tag: 'Sizing', title: `Position size computed — ${qty} shares`, body: '14-day realised volatility 1.8%. Size capped so modelled risk stays inside your per-trade ceiling.' },
    { tag: 'Compliance', title: 'All four compliance checks passed', body: 'Broker account active · static IP matched whitelist · 2FA session valid · Algo-ID attached.' },
    { tag: 'Order', title: `Buy order placed — ${qty} × ${sym}`, body: `Market order acknowledged by broker in 190 ms. Order ID ${orderId}. Exit legs attached at +4% / −2%.` },
    { kind: 'reject', title: 'Duplicate signal rejected', body: 'An identical trigger arrived 29 seconds after the first. Inside the 30-second duplicate window, so no order was sent. Recorded in the audit log.' },
    { tag: 'Scan', title: `Checked ${sym} against exit rules`, body: 'Unrealised gain 1.2% — below the 4% take-profit. Holding.' },
    { tag: 'Scan', title: `Checked ${sym} against exit rules`, body: 'Unrealised gain 1.6% — below the 4% take-profit. Holding.' },
  ]
}

/** Length of the scripted feed; every strategy shares the same cadence. */
export const FEED_LENGTH = 9

export const AUDIT = AUDIT_RAW as AuditRow[]
export { SYMS, METRICS, CMPS, DAYS, COMPARE, STRATS, NOTIFS, feedFor }
