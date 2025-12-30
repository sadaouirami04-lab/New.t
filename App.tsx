
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Product, Order, AuthState } from './types.ts';
import { PRODUCTS, WHATSAPP_NUMBER } from './constants.ts';

// --- Navbar Component ---
const Navbar: React.FC<{ isAdmin: boolean; onLogout: () => void }> = ({ isAdmin, onLogout }) => (
  <nav className="bg-white shadow-md sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">متجري</Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">الرئيسية</Link>
          {isAdmin ? (
            <>
              <Link to="/admin" className="bg-gray-100 px-3 py-1 rounded text-blue-600 font-medium">لوحة التحكم</Link>
              <button onClick={onLogout} className="text-red-500 hover:text-red-700 font-medium">خروج</button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">دخول المسؤول</Link>
          )}
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 transition-colors shadow-sm">
            تواصل معنا
          </a>
        </div>
      </div>
    </div>
  </nav>
);

// --- Home Page ---
const HomePage: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <header className="text-center mb-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">أهلاً بك في متجرنا</h1>
      <p className="text-lg text-gray-600">اكتشف أفضل المنتجات بأفضل الأسعار</p>
    </header>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {PRODUCTS.map(product => (
        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group">
          <Link to={`/product/${product.id}`}>
            <div className="relative h-64 overflow-hidden">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">{product.category}</span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-blue-600">{product.price.toLocaleString()} د.ج</span>
                <span className="text-sm text-blue-500 font-medium">التفاصيل ←</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

// --- Product Page ---
const ProductPage: React.FC<{ onOrderSubmit: (order: Order) => void }> = ({ onOrderSubmit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState("");
  const [form, setForm] = useState({ name: '', surname: '', state: '', city: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { if (product) setSelectedImage(product.images[0]); }, [product]);

  if (!product) return <div className="text-center py-20 text-2xl">المنتج غير موجود</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOrderSubmit({
      id: Math.random().toString(36).substr(2, 9),
      customerName: form.name,
      customerSurname: form.surname,
      state: form.state,
      city: form.city,
      productId: product.id,
      productName: product.name,
      price: product.price,
      timestamp: new Date().toLocaleString('ar-DZ')
    });
    setSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (submitted) return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl text-center">
      <div className="text-green-500 text-6xl mb-4">✓</div>
      <h2 className="text-2xl font-bold mb-2">تم طلبك بنجاح!</h2>
      <p className="text-gray-600">سيتم توجيهك للرئيسية...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button key={idx} onClick={() => setSelectedImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <section>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600 mb-4">{product.price.toLocaleString()} د.ج</p>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border">{product.description}</p>
          </section>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md border space-y-4">
            <h3 className="text-xl font-bold mb-4">أدخل معلوماتك للطلب</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="الاسم" className="border p-2 rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
              <input required placeholder="اللقب" className="border p-2 rounded-lg" onChange={e => setForm({...form, surname: e.target.value})} />
            </div>
            <input required placeholder="الولاية" className="w-full border p-2 rounded-lg" onChange={e => setForm({...form, state: e.target.value})} />
            <input required placeholder="البلدية" className="w-full border p-2 rounded-lg" onChange={e => setForm({...form, city: e.target.value})} />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg">تأكيد الشراء</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Login Page ---
const LoginPage: React.FC<{ onLogin: (s: boolean) => void }> = ({ onLogin }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-bold mb-6 text-center">دخول المسؤول</h2>
      <form onSubmit={(e) => { e.preventDefault(); if(user==='admin'&&pass==='rami'){ onLogin(true); navigate('/admin'); } }} className="space-y-4">
        <input placeholder="اسم المستخدم" className="w-full border p-2 rounded-lg" onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="w-full border p-2 rounded-lg" onChange={e => setPass(e.target.value)} />
        <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-xl">دخول</button>
      </form>
    </div>
  );
};

// --- Admin Dashboard ---
const AdminDashboard: React.FC<{ orders: Order[]; onDelete: (id: string) => void }> = ({ orders, onDelete }) => (
  <div className="max-w-7xl mx-auto px-4 py-8">
    <h2 className="text-3xl font-bold mb-8">طلبات الزبائن ({orders.length})</h2>
    <div className="bg-white rounded-2xl shadow overflow-x-auto">
      <table className="w-full text-right">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-4">الزبون</th>
            <th className="p-4">العنوان</th>
            <th className="p-4">المنتج</th>
            <th className="p-4">السعر</th>
            <th className="p-4">حذف</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-4 font-bold">{o.customerName} {o.customerSurname}</td>
              <td className="p-4">{o.state}, {o.city}</td>
              <td className="p-4 text-blue-600">{o.productName}</td>
              <td className="p-4 font-bold">{o.price.toLocaleString()} د.ج</td>
              <td className="p-4"><button onClick={() => onDelete(o.id)} className="text-red-500">حذف</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main App ---
const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => JSON.parse(localStorage.getItem('store_orders') || '[]'));

  useEffect(() => { localStorage.setItem('store_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { if(localStorage.getItem('is_admin')==='true') setIsAdmin(true); }, []);

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar isAdmin={isAdmin} onLogout={() => { setIsAdmin(false); localStorage.removeItem('is_admin'); }} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage onOrderSubmit={o => setOrders([o, ...orders])} />} />
            <Route path="/login" element={<LoginPage onLogin={s => { setIsAdmin(s); localStorage.setItem('is_admin', 'true'); }} />} />
            <Route path="/admin" element={isAdmin ? <AdminDashboard orders={orders} onDelete={id => setOrders(orders.filter(o => o.id !== id))} /> : <div className="text-center p-20">يجب تسجيل الدخول</div>} />
          </Routes>
        </main>
        <footer className="bg-gray-900 text-white py-8 mt-12 text-center">
          <p>© 2024 متجري - جميع الحقوق محفوظة</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
