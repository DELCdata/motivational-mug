import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://swawokapefwjvonvrwjb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3YXdva2FwZWZ3anZvbnZyd2piIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NzU3ODQsImV4cCI6MjA5ODI1MTc4NH0.ZvL_pCRDg1joM03fPIECgjXnfYKdNTaaBCG9-OnrhLI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ── MENU ────────────────────────────────────────────────────────────────────

export async function loadMenuFromDB() {
  const { data, error } = await supabase
    .from('menu')
    .select('data')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw error
  return data ? data.data : null
}

export async function saveMenuToDB(menuObj) {
  const { error } = await supabase
    .from('menu')
    .upsert({ id: 1, data: menuObj }, { onConflict: 'id' })
  if (error) throw error
}

// ── ORDERS ───────────────────────────────────────────────────────────────────

export async function loadOrdersFromDB({ date, type, name } = {}) {
  let query = supabase
    .from('orders')
    .select('*')
    .order('num', { ascending: false })

  if (date)  query = query.eq('order_date', date)
  if (type)  query = query.eq('type', type)
  if (name)  query = query.ilike('customer', `%${name}%`)

  const { data, error } = await query
  if (error) throw error
  // Normalise to the shape the app already uses
  return (data || []).map(dbRowToOrder)
}

export async function saveOrderToDB(order) {
  const { error } = await supabase.from('orders').insert(orderToDbRow(order))
  if (error) throw error
}

export async function deleteOrderFromDB(num) {
  const { error } = await supabase.from('orders').delete().eq('num', num)
  if (error) throw error
}

// ── SETTINGS ─────────────────────────────────────────────────────────────────

export async function getNextOrderNum() {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'next_order_num')
    .single()
  if (error) throw error
  return Number(data.value)
}

export async function bumpOrderNum(newNum) {
  const { error } = await supabase
    .from('settings')
    .update({ value: String(newNum) })
    .eq('key', 'next_order_num')
  if (error) throw error
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function orderToDbRow(o) {
  return {
    num:         o.num,
    type:        o.type,
    customer:    o.customer || null,
    order_date:  o.date,
    order_time:  o.time,
    items:       o.items,
    drink_count: o.drinkCount,
  }
}

function dbRowToOrder(row) {
  return {
    num:        row.num,
    type:       row.type,
    customer:   row.customer || '',
    date:       row.order_date,
    time:       row.order_time,
    items:      row.items,
    drinkCount: row.drink_count,
  }
}
