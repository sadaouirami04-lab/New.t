
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Product, Order } from './types.ts';
import { PRODUCTS, WHATSAPP_NUMBER } from './constants.ts';

// --- Components ---

const Header = ({ isAdmin, onLogout }: { isAdmin: boolean; onLogout: () => void }) => (
  <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20 items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-blue-200 shadow-lg">M</div>
          <span className="text-2xl font-black text-gray-900 tracking-tight">متجري</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-bold transition-colors">الرئيسية</Link>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-green-600 font-bold transition-colors">اتصل بنا</a>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <Link to="/admin" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100">لوحة التحكم</Link>
              <button onClick={onLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm border border-red-100">خروج</button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-400 hover:text-gray-600 font-medium text-sm">دخول المسؤول</Link>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const Home = () => {
  const [filter, setFilter] = useState('الكل');
  const categories = ['الكل', ...new Set(PRODUCTS.map(p => p.category))];

  const filteredProducts = useMemo(() => 
    filter === 'الكل' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter)
  , [filter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 mb-2">اكتشف منتجاتنا</h1>
        <p className="text-gray-500 font-medium">أفضل العروض والمنتجات الحصرية بين يديك</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setFilter(c)}
            className={`px-6 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all ${filter === c ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-400'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300">
            <div className="aspect-[4/5] overflow-hidden relative">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 tracking-wider shadow-sm">{product.category}</div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1 mb-4">{product.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-xl font-black text-blue-600">{product.price.toLocaleString()} <small className="text-xs font-bold opacity-70">د.ج</small></span>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ProductDetail = ({ onOrder }: { onOrder: (o: Order) => void }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImg, setSelectedImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', surname: '', phone: '', state: '', city: '' });

  useEffect(() => { if (product) setSelectedImg(product.images[0]); }, [product]);

  if (!product) return <div className="text-center py-20 font-bold text-xl">المنتج غير متوفر حالياً</div>;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: formData.name,
      customerSurname: formData.surname,
      state: formData.state,
      city: formData.city,
      productId: product.id,
      productName: product.name,
      price: product.price,
      timestamp: new Date().toLocaleString('ar-DZ')
    };

    onOrder(newOrder);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    alert('✅ تم تسجيل طلبك بنجاح! سنتصل بك قريباً.');
    navigate('/');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden bg-white shadow-xl aspect-square">
            <img src={selectedImg} className="w-full h-full object-cover animate-in fade-in zoom-in duration-300" alt={product.name} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImg(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${selectedImg === img ? 'border-blue-600 scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info & Form */}
        <div className="flex flex-col gap-8">
          <div>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black mb-4 inline-block">{product.category}</span>
            <h1 className="text-4xl font-black text-gray-900 mb-2">{product.name}</h1>
            <p className="text-3xl font-black text-blue-600 mb-6">{product.price.toLocaleString()} د.ج</p>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 text-gray-600 leading-relaxed shadow-sm">
              {product.description}
            </div>
          </div>

          <form onSubmit={handleOrder} className="bg-white p-8 rounded-3xl shadow-2xl shadow-blue-100 border border-blue-50 space-y-5">
            <h3 className="text-xl font-black text-gray-900 mb-4">نموذج الطلب السريع</h3>
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="الاسم" className="bg-gray-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="اللقب" className="bg-gray-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" onChange={e => setFormData({...formData, surname: e.target.value})} />
            </div>
            <input required type="tel" placeholder="رقم الهاتف" className="w-full bg-gray-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" onChange={e => setFormData({...formData, phone: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="الولاية" className="bg-gray-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" onChange={e => setFormData({...formData, state: e.target.value})} />
              <input required placeholder="البلدية" className="bg-gray-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-blue-600 transition-all" onChange={e => setFormData({...formData, city: e.target.value})} />
            </div>
            <button 
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'تأكيد الطلب الآن'}
            </button>
            <p className="text-center text-xs text-gray-400 font-medium">الدفع عند الاستلام 📦</p>
          </form>
        </div>
      </div>
    </div>
  );
};

const Login = ({ setAuth }: { setAuth: (v: boolean) => void }) => {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(user === 'admin' && pass === 'rami') {
      setAuth(true);
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      alert('خطأ في البيانات!');
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-3xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-black text-center mb-8">دخول الإدارة</h2>
      <form onSubmit={handleLogin} className="space-y-5">
        <input placeholder="اسم المستخدم" className="w-full bg-gray-50 p-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-600" onChange={e => setUser(e.target.value)} />
        <input type="password" placeholder="كلمة المرور" className="w-full bg-gray-50 p-4 rounded-xl border-0 focus:ring-2 focus:ring-blue-600" onChange={e => setPass(e.target.value)} />
        <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-black transition-colors">دخول</button>
      </form>
    </div>
  );
};

const Admin = ({ orders, onDelete }: { orders: Order[]; onDelete: (id: string) => void }) => (
  <div className="max-w-7xl mx-auto px-4 py-12">
    <div className="flex justify-between items-center mb-10">
      <h2 className="text-3xl font-black text-gray-900">إدارة الطلبات <span className="text-blue-600 bg-blue-50 px-3 py-1 rounded-lg text-xl ml-2">{orders.length}</span></h2>
    </div>
    <div className="grid gap-4">
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 font-bold">لا توجد طلبات بعد</div>
      ) : (
        orders.map(o => (
          <div key={o.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition-colors">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">#</div>
              <div>
                <h4 className="font-black text-gray-900">{o.customerName} {o.customerSurname}</h4>
                <p className="text-xs text-gray-500">{o.timestamp} • {o.state}, {o.city}</p>
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end">
              <span className="font-bold text-blue-600">{o.productName}</span>
              <span className="text-lg font-black">{o.price.toLocaleString()} د.ج</span>
            </div>
            <button onClick={() => onDelete(o.id)} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">حذف</button>
          </div>
        ))
      )}
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('store_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if(localStorage.getItem('isAdmin') === 'true') setIsAdmin(true);
  }, []);

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Header isAdmin={isAdmin} onLogout={logout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail onOrder={o => setOrders([o, ...orders])} />} />
            <Route path="/login" element={<Login setAuth={setIsAdmin} />} />
            <Route path="/admin" element={isAdmin ? <Admin orders={orders} onDelete={id => setOrders(orders.filter(ord => ord.id !== id))} /> : <div className="p-20 text-center font-black">🚫 غير مسموح بالدخول</div>} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="text-2xl font-black text-blue-600 mb-4">متجري</div>
            <p className="text-gray-400 font-medium">© 2024 جميع الحقوق محفوظة. صمم بكل حب.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
