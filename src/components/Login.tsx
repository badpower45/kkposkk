import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { getUsers } from '../lib/api';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const authenticateUser = async (username: string, password: string): Promise<User | null> => {
    try {
      const users = await getUsers();
      return users.find(u => u.username === username && u.password === password && u.isActive) || null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!username || !password) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور');
      setLoading(false);
      return;
    }

    const user = await authenticateUser(username, password);
    if (user) {
      onLogin(user);
      toast.success(`مرحباً ${user.fullName}`);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
      toast.error('فشل تسجيل الدخول');
    }
    setLoading(false);
  };

  const handleQuickLogin = async (username: string, password: string, role: string) => {
    setLoading(true);
    const user = await authenticateUser(username, password);
    if (user) {
      onLogin(user);
      toast.success(`تم الدخول كـ ${role}`);
    } else {
      toast.error('فشل تسجيل الدخول');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#0B69FF] rounded-full flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle>نظام نقطة البيع</CardTitle>
          <CardDescription>
            <span className="block">النظام جاهز للاستخدام 🎉</span>
            <span className="block text-xs mt-1">قم بتسجيل الدخول للبدء</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                dir="rtl"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full bg-[#007BFF] hover:bg-[#007BFF]/90" disabled={loading}>
                {loading ? 'جاري الدخول...' : 'دخول'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3 text-center">دخول سريع للتجربة:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin('owner', '123456', 'مالك')}
                disabled={loading}
              >
                دخول كمالك
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickLogin('cashier', '123456', 'موظف')}
                disabled={loading}
              >
                دخول كموظف
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              المستخدمون: owner / cashier | كلمة المرور: 123456
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
