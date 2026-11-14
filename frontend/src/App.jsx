import { useEffect, useState } from "react";
import { customerApi } from "./services/api";

const emptyForm = { name: "", email: "", phone: "", city: "" };

function CustomerForm({ initialValue, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initialValue || emptyForm);

  useEffect(() => setForm(initialValue || emptyForm), [initialValue]);

  function change(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {[
        ["name", "Full name", "e.g. Asha Rao"],
        ["email", "Email address", "asha@example.com"],
        ["phone", "Phone number", "+91 9876543210"],
        ["city", "City", "Bengaluru"]
      ].map(([name, label, placeholder]) => (
        <label key={name} className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
          <input
            required name={name} value={form[name]} onChange={change}
            placeholder={placeholder} type={name === "email" ? "email" : "text"}
            className="w-full rounded-xl border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </label>
      ))}
      <div className="flex gap-2 pt-2">
        <button disabled={saving} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          {saving ? "Saving..." : "Save customer"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
      </div>
    </form>
  );
}

export default function App() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mode, setMode] = useState("list");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  async function loadCustomers() {
    setLoading(true);
    setError("");
    try {
      setCustomers(await customerApi.list());
    } catch (err) {
      setError(`${err.message} Check that the backend is running and .env is configured.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadCustomers(); }, []);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3500);
  }

  async function saveCustomer(form) {
    setSaving(true);
    try {
      if (mode === "edit") {
        await customerApi.update(selected.id, form);
        showNotice("Customer updated successfully.");
      } else {
        await customerApi.create(form);
        showNotice("Customer created successfully.");
      }
      setMode("list");
      setSelected(null);
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCustomer(customer) {
    if (!window.confirm(`Delete ${customer.name}? This cannot be undone.`)) return;
    try {
      await customerApi.remove(customer.id);
      showNotice("Customer deleted.");
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function viewCustomer(customer) {
    try {
      const details = await customerApi.get(customer.id);
      setSelected(details);
      setMode("detail");
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = customers.filter((customer) =>
    [customer.name, customer.email, customer.city].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white">C</div>
            <div><p className="font-bold tracking-tight">Customer Desk</p><p className="text-xs text-slate-500">Simple customer management</p></div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Demo app</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold text-indigo-600">CUSTOMERS</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Customer management</h1><p className="mt-2 text-sm text-slate-500">Create, view, update and remove customer records.</p></div>
          {mode === "list" && <button onClick={() => { setSelected(null); setError(""); setMode("create"); }} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">+ Add customer</button>}
        </div>

        {notice && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</div>}
        {error && <div className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error">✕</button></div>}

        {mode === "list" && <>
          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-sm text-slate-500">Total customers</p><p className="mt-1 text-2xl font-bold">{customers.length}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2"><label className="text-sm text-slate-500" htmlFor="search">Find a customer</label><input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email or city..." className="mt-1.5 w-full rounded-xl border-slate-200 text-sm focus:border-indigo-500 focus:ring-indigo-500" /></div>
          </div>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-semibold">All customers</h2><span className="text-xs text-slate-500">{filtered.length} records</span></div>
            {loading ? <div className="p-10 text-center text-sm text-slate-500">Loading customers...</div> : filtered.length === 0 ? <div className="p-10 text-center"><p className="font-medium">No customers found</p><p className="mt-1 text-sm text-slate-500">Add a customer or try another search.</p></div> :
              <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Customer</th><th className="px-5 py-3 font-semibold">Phone</th><th className="px-5 py-3 font-semibold">City</th><th className="px-5 py-3 text-right font-semibold">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">{filtered.map((customer) => <tr key={customer.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><p className="font-semibold text-slate-800">{customer.name}</p><p className="mt-0.5 text-xs text-slate-500">{customer.email}</p></td>
                  <td className="px-5 py-4 text-slate-600">{customer.phone}</td><td className="px-5 py-4 text-slate-600">{customer.city}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => viewCustomer(customer)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50">View</button><button onClick={() => { setSelected(customer); setError(""); setMode("edit"); }} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Edit</button><button onClick={() => deleteCustomer(customer)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50">Delete</button></div></td>
                </tr>)}</tbody>
              </table></div>}
          </section>
        </>}

        {(mode === "create" || mode === "edit") && <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-1 text-xl font-bold">{mode === "edit" ? "Edit customer" : "Add a customer"}</h2><p className="mb-6 text-sm text-slate-500">Enter the customer information below.</p>
          <CustomerForm initialValue={mode === "edit" ? selected : emptyForm} onSave={saveCustomer} onCancel={() => { setMode("list"); setSelected(null); setError(""); }} saving={saving} />
        </section>}

        {mode === "detail" && selected && <section className="max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Customer details</p><h2 className="mt-1 text-2xl font-bold">{selected.name}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">ID #{selected.id}</span></div>
          <dl className="divide-y divide-slate-100">{[["Email", selected.email], ["Phone", selected.phone], ["City", selected.city], ["Created", selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "Not available"]].map(([label, value]) => <div key={label} className="grid grid-cols-3 gap-3 py-4 text-sm"><dt className="text-slate-500">{label}</dt><dd className="col-span-2 font-medium text-slate-800">{value}</dd></div>)}</dl>
          <div className="mt-5 flex gap-2"><button onClick={() => setMode("list")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50">Back</button><button onClick={() => setMode("edit")} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Edit customer</button></div>
        </section>}
        <p className="mt-8 text-center text-xs text-slate-400">Express.js · Drizzle ORM · Turso · React · Tailwind CSS</p>
      </main>
    </div>
  );
}
