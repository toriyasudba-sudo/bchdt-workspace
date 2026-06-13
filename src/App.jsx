import { useState, useMemo, useEffect } from "react";

// ── Палитра БЧДТ ──────────────────────────────────────────────────
const C = {
  bg: "#f0ebe3",
  surface: "#f7f3ed",
  card: "#faf7f3",
  border: "#d4b896",
  borderLight: "#e8ddd2",
  gold: "#8b6914",
  goldLight: "#c9a84c",
  text: "#2c1f0e",
  textMid: "#6b4f2a",
  textMuted: "#a08060",
  red: "#b83232",
  orange: "#c26820",
  yellow: "#a08614",
  green: "#3d7a4a",
};

// ── Данные из планировщика ─────────────────────────────────────────
const INIT_TASKS = [
  { id: 1, title: "Доделать сайт", desc: "Структура продажи + первый выпуск", responsible: "Тори", priority: "high", start: "2025-06-05", deadline: "2025-06-07", status: "done", author: "Катя" },
  { id: 2, title: "Письмо автора", desc: "Написать письмо от имени автора, ссылка на скачивание", responsible: "Юля", priority: "high", start: "2025-06-12", deadline: "2025-06-12", status: "progress", author: "Катя" },
  { id: 3, title: "Вопросы для Даши", desc: "Бот в Макс для сбора данных", responsible: "Катя", priority: "medium", start: "2025-06-04", deadline: "2025-06-09", status: "waiting", author: "Катя" },
  { id: 4, title: "База Псков", desc: "Отобрать всех, записать, продумать предложение", responsible: "Тори", priority: "high", start: "2025-06-03", deadline: "2025-06-08", status: "progress", author: "Катя" },
  { id: 5, title: "Потратить лайки", desc: "Сделать рекламную подачу", responsible: "Тори", priority: "medium", start: "2025-06-12", deadline: "2025-06-15", status: "waiting", author: "Катя" },
  { id: 6, title: "Авторы лид-магнит", desc: "Упаковать лид-магниты всех авторов", responsible: "Тори", priority: "high", start: "2025-06-10", deadline: "", status: "progress", author: "Катя" },
  { id: 7, title: "Заказать листовки", desc: "gmprint.ru/spb/calc/leaflets", responsible: "Тори", priority: "medium", start: "2025-06-12", deadline: "2025-06-15", status: "done", author: "Катя" },
  { id: 8, title: "Прописать план прогрева", desc: "2 недели следующего месяца", responsible: "Тори", priority: "high", start: "2025-06-12", deadline: "", status: "waiting", author: "Катя" },
];

const INIT_CONTENT = [
  { id: 1, date: "2025-06-15", platform: "ВКонтакте", rubric: "Автор номера", title: "Мужчина в клинике (Алексей Агалаков)", status: "planned" },
  { id: 2, date: "2025-06-16", platform: "Telegram", rubric: "Послание недели", title: "Старт программы АЛОЭ", status: "planned" },
  { id: 3, date: "2025-06-17", platform: "Instagram", rubric: "Практика недели", title: "Тория Нова: Дыхательная практика №1", status: "planned" },
  { id: 4, date: "2025-06-18", platform: "MAX", rubric: "За кадром журнала", title: "Навигация К4 — онлайн-встреча", status: "done" },
  { id: 5, date: "2025-06-20", platform: "ВКонтакте", rubric: "Партнёрские истории", title: "OFFLINE VALO + REVYOU", status: "planned" },
  { id: 6, date: "2025-06-22", platform: "Instagram", rubric: "Автор номера", title: "Ягодкин: Когда скорость перестаёт быть врагом", status: "planned" },
];

const INIT_AUTHORS = [
  { id: 1, name: "Херт ван Льюэн", lead: "Мастер-класс: войти осознанно в практику", status: "active" },
  { id: 2, name: "Николай Ягодкин", lead: "35 способов сохранять ресурс", status: "active" },
  { id: 3, name: "Людмила Дабахянц", lead: "Где я раздвоен", status: "active" },
  { id: 4, name: "Дарья Харизма", lead: "—", status: "active" },
  { id: 5, name: "Мария Брокк", lead: "—", status: "active" },
  { id: 6, name: "Ревью", lead: "6000 — водородная + капсула", status: "partner" },
  { id: 7, name: "Лемуун", lead: "Скидка 15% + разбор", status: "partner" },
  { id: 8, name: "Макош", lead: "Медитация", status: "partner" },
  { id: 9, name: "Фотограф Ваня", lead: "Скидка 50% на фотосъёмку", status: "partner" },
  { id: 10, name: "Анна Терентьева", lead: "Точка отсчёта новой версии себя", status: "active" },
];

const INIT_STRATEGY = [
  { id: 1, category: "Цель", text: "Продукт к 4 с доходностью 200 000 ₽" },
  { id: 2, category: "Цель", text: "Автоматизация процессов" },
  { id: 3, category: "Цель", text: "Масштабирование" },
  { id: 4, category: "Идея", text: "Мотивация гадать в клане — пока не соберёте ВСЕ подарки от авторов!" },
  { id: 5, category: "Идея", text: "Лид-магнит: бесплатное окно в клан + бот-приветствие с навигацией" },
  { id: 6, category: "Встреча", text: "Лемун: Соня Севкабель + 2 приглашения" },
  { id: 7, category: "Встреча", text: "Бизнес ЛР 12:00–16:00, отель Москва. Ирина Веселова +7 921 957-48-20" },
];

const INIT_LINKS = [
  { id: 1, url: "https://gmprint.ru/spb/calc/leaflets", title: "Листовки и визитки", desc: "Типография GMprint", category: "Подрядчики" },
  { id: 2, url: "https://taplink.cc/gorenko_olga/p/112ba72/", title: "Продажи по переписке", desc: "Четверг 19:00 — обучение", category: "Обучение" },
];

// ── Константы ─────────────────────────────────────────────────────
const PLATFORMS = ["ВКонтакте", "Telegram", "Instagram", "MAX", "Паблик"];
const RUBRICS = ["Автор номера", "Практика недели", "За кадром журнала", "Послание недели", "Внутри клана", "Женщина своей стаи", "Партнёрские истории"];
const CATS_STRATEGY = ["Цель", "Идея", "Встреча", "Задача", "Заметка"];
const CATS_LINKS = ["Подрядчики", "Telegram", "Обучение", "Сайты", "Инструменты", "Разное"];
const PLATFORM_COLORS = { "ВКонтакте": "#4c75a3", "Telegram": "#2aabee", "Instagram": "#8b6914", "MAX": "#c26820", "Паблик": "#3d7a4a" };
const CAT_STRATEGY_COLORS = { "Цель": C.gold, "Идея": C.yellow, "Встреча": C.orange, "Задача": C.red, "Заметка": C.green };
const CAT_LINK_COLORS = { "Подрядчики": C.orange, "Telegram": "#2aabee", "Обучение": C.gold, "Сайты": "#4c75a3", "Инструменты": C.green, "Разное": C.textMuted };

let _nextId = 300;
function uid() { return ++_nextId; }

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

// ── Утилиты ──────────────────────────────────────────────────────
function getDeadlineBadge(deadline, status) {
  if (!deadline || status === "done") return null;
  const d = new Date(deadline);
  d.setHours(0, 0, 0, 0);
  const diff = Math.ceil((d - TODAY) / 86400000);
  if (diff < 0)  return { label: "Просрочено",       color: C.red,    bg: C.red + "22",    days: diff };
  if (diff <= 2) return { label: "Горит · " + diff + "д", color: C.orange, bg: C.orange + "22", days: diff };
  if (diff <= 5) return { label: "Скоро · " + diff + "д", color: C.yellow, bg: C.yellow + "22", days: diff };
  return { label: diff + " дн.", color: C.green, bg: C.green + "22", days: diff };
}

const PRIORITY_MAP = {
  high:   { label: "Высокий", color: C.red },
  medium: { label: "Средний", color: C.orange },
  low:    { label: "Низкий",  color: C.green },
};

const STATUS_MAP = {
  done:     { label: "Готово",   color: C.green },
  progress: { label: "В работе", color: C.gold },
  waiting:  { label: "Ожидает",  color: C.textMuted },
};

// ── UI-примитивы ─────────────────────────────────────────────────
function Ornament() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", color: C.goldLight, fontSize: 12, userSelect: "none", margin: "4px 0" }}>
      ✦ <span style={{ fontSize: 7 }}>◆</span> ✦
    </div>
  );
}

function Badge({ label, color, bg }) {
  return (
    <span style={{
      background: bg || color + "22",
      color,
      borderRadius: 4,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: "nowrap",
      border: "1px solid " + color + "44",
    }}>
      {label}
    </span>
  );
}

const inputStyle = {
  width: "100%",
  background: C.surface,
  border: "1px solid " + C.border,
  borderRadius: 6,
  padding: "8px 10px",
  color: C.text,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "Georgia, serif",
};

function Btn({ onClick, children, variant = "primary", style: s = {} }) {
  const variants = {
    primary: { background: C.gold, color: "#fff", border: "none" },
    ghost:   { background: "transparent", color: C.textMid, border: "1px solid " + C.border },
    danger:  { background: C.red + "15", color: C.red, border: "1px solid " + C.red + "44" },
  };
  return (
    <button onClick={onClick} style={{ padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif", ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 10, color: C.textMuted, marginBottom: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "#2c1f0e88", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: 12, padding: 24, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 40px #2c1f0e30" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 15, fontFamily: "Georgia, serif" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18, padding: 4 }}>✕</button>
        </div>
        <Ornament />
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}

// ── Баннер горящих дедлайнов ─────────────────────────────────────
function DeadlineAlerts({ tasks }) {
  const hot = tasks.filter((t) => {
    const b = getDeadlineBadge(t.deadline, t.status);
    return b && b.days <= 2;
  });
  if (!hot.length) return null;
  return (
    <div style={{ background: "linear-gradient(135deg," + C.red + "18," + C.orange + "18)", border: "1px solid " + C.red + "55", borderRadius: 10, padding: "12px 16px", marginBottom: 20 }}>
      <div style={{ color: C.red, fontWeight: 700, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
        ⚠ Требуют внимания сегодня
      </div>
      {hot.map((t) => {
        const b = getDeadlineBadge(t.deadline, t.status);
        return (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 8 }}>
            <span style={{ color: C.text, fontSize: 13 }}>· {t.title}</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ color: C.textMuted, fontSize: 11 }}>{t.responsible}</span>
              <Badge label={b.label} color={b.color} bg={b.bg} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Форма задачи ─────────────────────────────────────────────────
function TaskForm({ initial, onSave, onClose }) {
  const [f, setF] = useState(initial || { title: "", desc: "", responsible: "Тори", priority: "medium", start: "", deadline: "", status: "waiting", author: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  return (
    <div>
      <Field label="Название *">
        <input style={inputStyle} value={f.title} onChange={set("title")} placeholder="Что нужно сделать?" />
      </Field>
      <Field label="Описание">
        <textarea style={{ ...inputStyle, minHeight: 64, resize: "vertical" }} value={f.desc} onChange={set("desc")} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Ответственный">
          <select style={inputStyle} value={f.responsible} onChange={set("responsible")}>
            {["Тори", "Катя", "Юля", "Другой"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Приоритет">
          <select style={inputStyle} value={f.priority} onChange={set("priority")}>
            <option value="high">🔴 Высокий</option>
            <option value="medium">🟡 Средний</option>
            <option value="low">🟢 Низкий</option>
          </select>
        </Field>
        <Field label="Дата начала">
          <input type="date" style={inputStyle} value={f.start} onChange={set("start")} />
        </Field>
        <Field label="Дедлайн">
          <input type="date" style={inputStyle} value={f.deadline} onChange={set("deadline")} />
        </Field>
        <Field label="Статус">
          <select style={inputStyle} value={f.status} onChange={set("status")}>
            <option value="waiting">Ожидает</option>
            <option value="progress">В работе</option>
            <option value="done">Готово</option>
          </select>
        </Field>
        <Field label="Поставил задачу">
          <input style={inputStyle} value={f.author} onChange={set("author")} placeholder="Имя" />
        </Field>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
        <Btn variant="ghost" onClick={onClose}>Отмена</Btn>
        <Btn onClick={() => f.title.trim() && onSave(f)}>Сохранить</Btn>
      </div>
    </div>
  );
}

// ── Карточка задачи ──────────────────────────────────────────────
function TaskCard({ task, onEdit, onDelete }) {
  const dl = getDeadlineBadge(task.deadline, task.status);
  const pr = PRIORITY_MAP[task.priority];
  const st = STATUS_MAP[task.status];
  const isHot = dl && dl.days <= 2;
  return (
    <div style={{ background: C.card, border: "1px solid " + (isHot ? C.red + "88" : C.borderLight), borderRadius: 10, padding: "12px 16px", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start", boxShadow: isHot ? "0 2px 12px " + C.red + "18" : "none" }}>
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ color: task.status === "done" ? C.textMuted : C.text, fontWeight: 700, fontSize: 14, textDecoration: task.status === "done" ? "line-through" : "none" }}>
            {task.title}
          </span>
          <Badge label={pr.label} color={pr.color} />
          <Badge label={st.label} color={st.color} />
          {dl && <Badge label={dl.label} color={dl.color} bg={dl.bg} />}
        </div>
        {task.desc && <p style={{ margin: 0, color: C.textMuted, fontSize: 12, lineHeight: 1.5 }}>{task.desc}</p>}
        <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 11, color: C.textMuted }}>
          <span>👤 {task.responsible}</span>
          {task.deadline && <span>📅 {task.deadline}</span>}
          {task.author && <span>от {task.author}</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <Btn variant="ghost" onClick={() => onEdit(task)} style={{ padding: "4px 10px", fontSize: 11 }}>✏️</Btn>
        <Btn variant="danger" onClick={() => onDelete(task.id)} style={{ padding: "4px 10px", fontSize: 11 }}>✕</Btn>
      </div>
    </div>
  );
}

// ── Вкладка: Задачи ──────────────────────────────────────────────
function TasksTab() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [modal, setModal] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPerson, setFilterPerson] = useState("all");

  useEffect(() => {
    window.storage?.get("bchdt_tasks", true).then((r) => { if (r?.value) setTasks(JSON.parse(r.value)); }).catch(() => {});
  }, []);
  useEffect(() => {
    window.storage?.set("bchdt_tasks", JSON.stringify(tasks), true).catch(() => {});
  }, [tasks]);

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => filterStatus === "all" || t.status === filterStatus)
      .filter((t) => filterPerson === "all" || t.responsible === filterPerson)
      .sort((a, b) => {
        const da = a.deadline ? new Date(a.deadline) : new Date("2099-01-01");
        const db = b.deadline ? new Date(b.deadline) : new Date("2099-01-01");
        return da - db;
      });
  }, [tasks, filterStatus, filterPerson]);

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    hot: tasks.filter((t) => { const b = getDeadlineBadge(t.deadline, t.status); return b && b.days <= 2; }).length,
  }), [tasks]);

  function handleSave(f) {
    if (modal === "add") {
      setTasks((p) => [...p, { ...f, id: uid() }]);
    } else {
      setTasks((p) => p.map((t) => (t.id === modal.id ? { ...f, id: t.id } : t)));
    }
    setModal(null);
  }

  return (
    <div>
      <DeadlineAlerts tasks={tasks} />

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { label: "Всего", val: stats.total, color: C.text },
          { label: "Готово", val: stats.done, color: C.green },
          { label: "🔥 Горит", val: stats.hot, color: C.red },
        ].map((s) => (
          <div key={s.label} style={{ background: C.card, border: "1px solid " + C.borderLight, borderRadius: 10, padding: "10px 18px", minWidth: 88 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        <select style={{ ...inputStyle, width: "auto" }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">Все статусы</option>
          <option value="waiting">Ожидает</option>
          <option value="progress">В работе</option>
          <option value="done">Готово</option>
        </select>
        <select style={{ ...inputStyle, width: "auto" }} value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)}>
          <option value="all">Все</option>
          {["Тори", "Катя", "Юля"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <Btn onClick={() => setModal("add")}>+ Добавить задачу</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ color: C.textMuted, textAlign: "center", padding: 40, fontStyle: "italic" }}>
            Задач нет — добавьте первую
          </div>
        )}
        {filtered.map((t) => (
          <TaskCard key={t.id} task={t} onEdit={setModal} onDelete={(id) => setTasks((p) => p.filter((t) => t.id !== id))} />
        ))}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Новая задача" : "Редактировать задачу"} onClose={() => setModal(null)}>
          <TaskForm initial={modal !== "add" ? modal : undefined} onSave={handleSave} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}

// ── Вкладка: Контент-план ────────────────────────────────────────
function ContentTab() {
  const [items, setItems] = useState(INIT_CONTENT);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ date: "", platform: "Telegram", rubric: "Автор номера", title: "", status: "planned" });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    window.storage?.get("bchdt_content", true).then((r) => { if (r?.value) setItems(JSON.parse(r.value)); }).catch(() => {});
  }, []);
  useEffect(() => {
    window.storage?.set("bchdt_content", JSON.stringify(items), true).catch(() => {});
  }, [items]);

  const grouped = useMemo(() => {
    const m = {};
    items.forEach((i) => { if (!m[i.date]) m[i.date] = []; m[i.date].push(i); });
    return Object.entries(m).sort(([a], [b]) => a.localeCompare(b));
  }, [items]);

  function handleSave() {
    if (!form.title.trim() || !form.date) return;
    if (modal === "add") {
      setItems((p) => [...p, { ...form, id: uid() }]);
    } else {
      setItems((p) => p.map((i) => (i.id === modal.id ? { ...form, id: i.id } : i)));
    }
    setModal(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={() => { setForm({ date: "", platform: "Telegram", rubric: "Автор номера", title: "", status: "planned" }); setModal("add"); }}>
          + Добавить пост
        </Btn>
      </div>

      {grouped.length === 0 && (
        <div style={{ color: C.textMuted, textAlign: "center", padding: 40, fontStyle: "italic" }}>Контент-план пуст</div>
      )}

      {grouped.map(([date, posts]) => (
        <div key={date} style={{ marginBottom: 22 }}>
          <div style={{ color: C.textMuted, fontSize: 10, marginBottom: 8, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {new Date(date).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {posts.map((p) => {
              const pc = PLATFORM_COLORS[p.platform] || C.gold;
              return (
                <div key={p.id} style={{ background: C.card, border: "1px solid " + C.borderLight, borderRadius: 8, padding: "10px 14px", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ background: pc + "22", color: pc, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, minWidth: 80, textAlign: "center", border: "1px solid " + pc + "44" }}>{p.platform}</span>
                  <span style={{ color: C.textMuted, fontSize: 11, minWidth: 110 }}>{p.rubric}</span>
                  <span style={{ color: p.status === "done" ? C.textMuted : C.text, flex: 1, fontSize: 13, textDecoration: p.status === "done" ? "line-through" : "none" }}>{p.title}</span>
                  {p.status === "done" && <Badge label="✓" color={C.green} />}
                  <div style={{ display: "flex", gap: 4 }}>
                    <Btn variant="ghost" onClick={() => { setForm(p); setModal(p); }} style={{ padding: "3px 8px", fontSize: 11 }}>✏️</Btn>
                    <Btn variant="danger" onClick={() => setItems((prev) => prev.filter((i) => i.id !== p.id))} style={{ padding: "3px 8px", fontSize: 11 }}>✕</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {modal && (
        <Modal title={modal === "add" ? "Новый пост" : "Редактировать"} onClose={() => setModal(null)}>
          <Field label="Дата *"><input type="date" style={inputStyle} value={form.date} onChange={set("date")} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Платформа">
              <select style={inputStyle} value={form.platform} onChange={set("platform")}>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Рубрика">
              <select style={inputStyle} value={form.rubric} onChange={set("rubric")}>
                {RUBRICS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Заголовок *"><input style={inputStyle} value={form.title} onChange={set("title")} placeholder="О чём пост?" /></Field>
          <Field label="Статус">
            <select style={inputStyle} value={form.status} onChange={set("status")}>
              <option value="planned">Запланировано</option>
              <option value="done">Опубликовано</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Отмена</Btn>
            <Btn onClick={handleSave}>Сохранить</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Вкладка: Авторы ──────────────────────────────────────────────
function AuthorsTab() {
  const [authors, setAuthors] = useState(INIT_AUTHORS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", lead: "", status: "active" });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    window.storage?.get("bchdt_authors", true).then((r) => { if (r?.value) setAuthors(JSON.parse(r.value)); }).catch(() => {});
  }, []);
  useEffect(() => {
    window.storage?.set("bchdt_authors", JSON.stringify(authors), true).catch(() => {});
  }, [authors]);

  function handleSave() {
    if (!form.name.trim()) return;
    if (modal === "add") {
      setAuthors((p) => [...p, { ...form, id: uid() }]);
    } else {
      setAuthors((p) => p.map((a) => (a.id === modal.id ? { ...form, id: a.id } : a)));
    }
    setModal(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={() => { setForm({ name: "", lead: "", status: "active" }); setModal("add"); }}>+ Добавить автора</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: 10 }}>
        {authors.map((a) => {
          const sc = a.status === "active" ? C.gold : C.orange;
          const sl = a.status === "active" ? "Автор" : "Партнёр";
          return (
            <div key={a.id} style={{ background: C.card, border: "1px solid " + C.borderLight, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <span style={{ color: C.text, fontWeight: 700, fontSize: 14, lineHeight: 1.3, flex: 1 }}>{a.name}</span>
                <Badge label={sl} color={sc} />
              </div>
              {a.lead && a.lead !== "—" && (
                <div style={{ color: C.textMid, fontSize: 12, marginBottom: 10 }}>🎁 {a.lead}</div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <Btn variant="ghost" onClick={() => { setForm(a); setModal(a); }} style={{ padding: "4px 10px", fontSize: 11 }}>✏️ Изменить</Btn>
                <Btn variant="danger" onClick={() => setAuthors((p) => p.filter((x) => x.id !== a.id))} style={{ padding: "4px 10px", fontSize: 11 }}>✕</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Новый автор" : "Редактировать"} onClose={() => setModal(null)}>
          <Field label="Имя *"><input style={inputStyle} value={form.name} onChange={set("name")} placeholder="Имя автора" /></Field>
          <Field label="Лид-магнит / оффер"><input style={inputStyle} value={form.lead} onChange={set("lead")} placeholder="Что предлагает?" /></Field>
          <Field label="Тип">
            <select style={inputStyle} value={form.status} onChange={set("status")}>
              <option value="active">Автор</option>
              <option value="partner">Партнёр</option>
            </select>
          </Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Отмена</Btn>
            <Btn onClick={handleSave}>Сохранить</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Вкладка: Стратегия ───────────────────────────────────────────
function StrategyTab() {
  const [items, setItems] = useState(INIT_STRATEGY);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ category: "Цель", text: "" });
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    window.storage?.get("bchdt_strategy", true).then((r) => { if (r?.value) setItems(JSON.parse(r.value)); }).catch(() => {});
  }, []);
  useEffect(() => {
    window.storage?.set("bchdt_strategy", JSON.stringify(items), true).catch(() => {});
  }, [items]);

  const grouped = useMemo(() => {
    const m = {};
    items.forEach((i) => { if (!m[i.category]) m[i.category] = []; m[i.category].push(i); });
    return Object.entries(m);
  }, [items]);

  function handleSave() {
    if (!form.text.trim()) return;
    if (modal === "add") {
      setItems((p) => [...p, { ...form, id: uid() }]);
    } else {
      setItems((p) => p.map((i) => (i.id === modal.id ? { ...form, id: i.id } : i)));
    }
    setModal(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <Btn onClick={() => { setForm({ category: "Цель", text: "" }); setModal("add"); }}>+ Добавить запись</Btn>
      </div>
      {grouped.map(([cat, entries]) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: CAT_STRATEGY_COLORS[cat] || C.gold }} />
            <h3 style={{ margin: 0, color: CAT_STRATEGY_COLORS[cat] || C.text, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{cat}</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {entries.map((item) => (
              <div key={item.id} style={{ background: C.card, border: "1px solid " + C.borderLight, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ color: C.text, flex: 1, fontSize: 13, lineHeight: 1.6 }}>{item.text}</span>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <Btn variant="ghost" onClick={() => { setForm(item); setModal(item); }} style={{ padding: "3px 8px", fontSize: 11 }}>✏️</Btn>
                  <Btn variant="danger" onClick={() => setItems((p) => p.filter((i) => i.id !== item.id))} style={{ padding: "3px 8px", fontSize: 11 }}>✕</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {modal && (
        <Modal title={modal === "add" ? "Новая запись" : "Редактировать"} onClose={() => setModal(null)}>
          <Field label="Категория">
            <select style={inputStyle} value={form.category} onChange={set("category")}>
              {CATS_STRATEGY.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Текст *">
            <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.text} onChange={set("text")} placeholder="Запись..." />
          </Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Отмена</Btn>
            <Btn onClick={handleSave}>Сохранить</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Вкладка: Ссылки ──────────────────────────────────────────────
function LinksTab() {
  const [links, setLinks] = useState(INIT_LINKS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ url: "", title: "", desc: "", category: "Разное" });
  const [filterCat, setFilterCat] = useState("all");
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    window.storage?.get("bchdt_links", true).then((r) => { if (r?.value) setLinks(JSON.parse(r.value)); }).catch(() => {});
  }, []);
  useEffect(() => {
    window.storage?.set("bchdt_links", JSON.stringify(links), true).catch(() => {});
  }, [links]);

  const usedCats = [...new Set(links.map((l) => l.category))];
  const filtered = filterCat === "all" ? links : links.filter((l) => l.category === filterCat);

  function handleSave() {
    if (!form.url.trim() || !form.title.trim()) return;
    const url = form.url.startsWith("http") ? form.url : "https://" + form.url;
    if (modal === "add") {
      setLinks((p) => [...p, { ...form, url, id: uid() }]);
    } else {
      setLinks((p) => p.map((l) => (l.id === modal.id ? { ...form, url, id: l.id } : l)));
    }
    setModal(null);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <select style={{ ...inputStyle, width: "auto" }} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">Все категории</option>
          {usedCats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div style={{ flex: 1 }} />
        <Btn onClick={() => { setForm({ url: "", title: "", desc: "", category: "Разное" }); setModal("add"); }}>+ Добавить ссылку</Btn>
      </div>

      {filtered.length === 0 && (
        <div style={{ color: C.textMuted, textAlign: "center", padding: 40, fontStyle: "italic" }}>Ссылок нет — добавьте первую</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((l) => {
          const cc = CAT_LINK_COLORS[l.category] || C.textMuted;
          let domain = l.url;
          try { domain = new URL(l.url).hostname; } catch (_) {}
          return (
            <div key={l.id} style={{ background: C.card, border: "1px solid " + C.borderLight, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    {l.title} ↗
                  </a>
                  <Badge label={l.category} color={cc} />
                </div>
                {l.desc && <p style={{ margin: "0 0 4px", color: C.textMid, fontSize: 12, lineHeight: 1.5 }}>{l.desc}</p>}
                <span style={{ color: C.textMuted, fontSize: 11 }}>{domain}</span>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <Btn variant="ghost" onClick={() => { setForm(l); setModal(l); }} style={{ padding: "4px 10px", fontSize: 11 }}>✏️</Btn>
                <Btn variant="danger" onClick={() => setLinks((p) => p.filter((x) => x.id !== l.id))} style={{ padding: "4px 10px", fontSize: 11 }}>✕</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {modal && (
        <Modal title={modal === "add" ? "Новая ссылка" : "Редактировать"} onClose={() => setModal(null)}>
          <Field label="Ссылка (URL) *"><input style={inputStyle} value={form.url} onChange={set("url")} placeholder="https://..." /></Field>
          <Field label="Название *"><input style={inputStyle} value={form.title} onChange={set("title")} placeholder="Как называть?" /></Field>
          <Field label="Описание"><input style={inputStyle} value={form.desc} onChange={set("desc")} placeholder="Что это, зачем?" /></Field>
          <Field label="Категория">
            <select style={inputStyle} value={form.category} onChange={set("category")}>
              {CATS_LINKS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <Btn variant="ghost" onClick={() => setModal(null)}>Отмена</Btn>
            <Btn onClick={handleSave}>Сохранить</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────
const TABS = [
  { key: "tasks",    label: "◆ Задачи" },
  { key: "content",  label: "◆ Контент" },
  { key: "authors",  label: "◆ Авторы" },
  { key: "strategy", label: "◆ Стратегия" },
  { key: "links",    label: "◆ Ссылки" },
];

export default function App() {
  const [tab, setTab] = useState("tasks");
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "Georgia, serif" }}>
      <div style={{ background: C.card, borderBottom: "1px solid " + C.border, padding: "18px 28px" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: C.goldLight, textTransform: "uppercase", marginBottom: 4 }}>
          Рабочее пространство
        </div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text, letterSpacing: "0.12em" }}>
          Б Ч Д Т
        </h1>
        <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, fontStyle: "italic" }}>
          Больше, чем детокс тела · Журнал
        </div>
      </div>

      <div style={{ background: C.surface, borderBottom: "1px solid " + C.border, padding: "0 20px", display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "13px 16px",
              fontSize: 11,
              fontWeight: 700,
              color: tab === t.key ? C.gold : C.textMuted,
              borderBottom: tab === t.key ? "2px solid " + C.gold : "2px solid transparent",
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
              fontFamily: "Georgia, serif",
              textTransform: "uppercase",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
        {tab === "tasks"    && <TasksTab />}
        {tab === "content"  && <ContentTab />}
        {tab === "authors"  && <AuthorsTab />}
        {tab === "strategy" && <StrategyTab />}
        {tab === "links"    && <LinksTab />}
      </div>

      <div style={{ textAlign: "center", padding: "16px 0 28px" }}>
        <Ornament />
      </div>
    </div>
  );
}
