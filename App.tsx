
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { Product, Order, AuthState } from './types';
import { PRODUCTS, WHATSAPP_NUMBER } from './constants';

// --- Helper Components ---

const Navbar: React.FC<{ isAdmin: boolean; onLogout: () => void }> = ({ isAdmin, onLogout }) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">متجري</Link>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">الرئيسية</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="bg-gray-100 px-3 py-1 rounded text-blue-600 font-medium">لوحة التحكم</Link>
                <button 
                  onClick={onLogout}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  خروج
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">دخول المسؤول</Link>
            )}
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-green-600 transition-colors shadow-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.544.917 3.41 1.401 5.316 1.402 5.813 0 10.54-4.727 10.544-10.54.002-2.814-1.097-5.463-3.091-7.459-1.994-1.996-4.645-3.093-7.461-3.094-5.815 0-10.544 4.73-10.547 10.544-.001 2.02.527 3.991 1.528 5.717l-1.01 3.693 3.721-.976zm10.702-7.342c-.29-.145-1.711-.845-1.976-.941-.266-.096-.459-.145-.653.145-.193.29-.748.941-.917 1.135-.169.194-.338.218-.627.072-.29-.145-1.225-.451-2.333-1.44-.863-.77-1.445-1.72-1.614-2.011-.169-.29-.018-.447.127-.591.131-.13.29-.338.435-.507.145-.169.193-.29.29-.483.097-.193.048-.362-.024-.507-.072-.145-.653-1.571-.894-2.152-.235-.569-.475-.492-.653-.501-.169-.008-.362-.009-.556-.009-.193 0-.507.072-.773.362-.266.29-1.014.991-1.014 2.417 0 1.426 1.039 2.804 1.184 3.003.145.194 2.043 3.12 4.95 4.378.691.299 1.231.478 1.651.611.693.22 1.325.189 1.824.115.557-.083 1.711-.699 1.953-1.374.241-.676.241-1.256.169-1.374-.073-.118-.266-.194-.556-.339z"/></svg>
              تواصل معنا
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- Page Components ---

const HomePage: React.FC = () => {
  return (
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
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-blue-600">{product.price.toLocaleString()} د.ج</span>
                  <span className="text-sm text-blue-500 font-medium hover:underline">عرض التفاصيل ←</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductPage: React.FC<{ onOrderSubmit: (order: Order) => void }> = ({ onOrderSubmit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState("");
  const [form, setForm] = useState({ name: '', surname: '', state: '', city: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (product) setSelectedImage(product.images[0]);
  }, [product]);

  if (!product) return <div className="text-center py-20 text-2xl">المنتج غير موجود</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: form.name,
      customerSurname: form.surname,
      state: form.state,
      city: form.city,
      productId: product.id,
      productName: product.name,
      price: product.price,
      timestamp: new Date().toLocaleString('ar-DZ')
    };
    onOrderSubmit(newOrder);
    setSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">تم استلام طلبك بنجاح!</h2>
        <p className="text-gray-600">سنتصل بك قريباً لتأكيد الطلب. سيتم توجيهك للرئيسية...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg border">
            <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedImage === img ? 'border-blue-500' : 'border-transparent'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info & Order Form */}
        <div className="space-y-8">
          <section>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600 mb-4">{product.price.toLocaleString()} د.ج</p>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-1">وصف المنتج:</h4>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              استمارة الطلب السريع
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اللقب</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={form.surname}
                    onChange={e => setForm({...form, surname: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الولاية</label>
                <input 
                  required 
                  type="text" 
                  placeholder="مثال: الجزائر، وهران..."
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={form.state}
                  onChange={e => setForm({...form, state: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المدينة / البلدية</label>
                <input 
                  required 
                  type="text" 
                  className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
              >
                تأكيد طلب الشراء الآن
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC<{ onLogin: (success: boolean) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'rami') {
      onLogin(true);
      navigate('/admin');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">دخول المسؤول</h2>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم</label>
          <input 
            type="text" 
            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input 
            type="password" 
            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
};

const AdminDashboard: React.FC<{ orders: Order[]; onDeleteOrder: (id: string) => void }> = ({ orders, onDeleteOrder }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">طلبات الزبائن ({orders.length})</h2>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 border-b">الزبون</th>
                <th className="p-4 border-b">العنوان</th>
                <th className="p-4 border-b">المنتج</th>
                <th className="p-4 border-b">السعر</th>
                <th className="p-4 border-b">التاريخ</th>
                <th className="p-4 border-b text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500">لا توجد طلبات حتى الآن</td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{order.customerName} {order.customerSurname}</div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">{order.state}</span>
                      <span className="text-sm mr-2">{order.city}</span>
                    </td>
                    <td className="p-4 font-medium text-blue-600">{order.productName}</td>
                    <td className="p-4 font-bold">{order.price.toLocaleString()} د.ج</td>
                    <td className="p-4 text-xs text-gray-500">{order.timestamp}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onDeleteOrder(order.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Root Component ---

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('store_orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    
    const adminStatus = localStorage.getItem('is_admin');
    if (adminStatus === 'true') setIsAdmin(true);
  }, []);

  // Save orders to localStorage when they change
  useEffect(() => {
    localStorage.setItem('store_orders', JSON.stringify(orders));
  }, [orders]);

  const handleOrderSubmit = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const handleDeleteOrder = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('is_admin');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar 
          isAdmin={isAdmin} 
          onLogout={handleLogout} 
        />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage onOrderSubmit={handleOrderSubmit} />} />
            <Route 
              path="/login" 
              element={
                <LoginPage onLogin={(success) => {
                  setIsAdmin(success);
                  localStorage.setItem('is_admin', 'true');
                }} />
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAdmin ? (
                  <AdminDashboard orders={orders} onDeleteOrder={handleDeleteOrder} />
                ) : (
                  <div className="text-center py-20">عذراً، يجب عليك تسجيل الدخول أولاً</div>
                )
              } 
            />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400">© 2024 متجري لبيع المنتجات - جميع الحقوق محفوظة</p>
            <div className="flex justify-center gap-6 mt-4">
               <a href="#" className="hover:text-blue-400">الرئيسية</a>
               <a href="#" className="hover:text-blue-400">سياسة الخصوصية</a>
               <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-green-400">واتساب المالك</a>
            </div>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
