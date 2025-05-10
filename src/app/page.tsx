'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import coffee from '../../public/photo_2025-05-11_00-51-00.jpg';

import { ItemService } from '@/api/item.service';
import { CreateOrderRequest, OrderService } from '@/api/order.service';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  size: z.string(),
  extra: z.array(z.string()).optional(),
  sugar: z.string(),
  temperature: z.string(),
});

type CoffeeForm = z.infer<typeof formSchema>;

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const basePrice = 2200;
  const [totalPrice, setTotalPrice] = useState(basePrice);

  const sizePrices: Record<string, number> = {
    '0.5': 0,
    '0.7': 200,
  };

  const extraPrices: Record<string, number> = {
    extraPearl: 300,
    altMilk: 300,
    taroPearl: 300,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await ItemService.getAll();
        if (products.length > 0) {
          const product = products[0];
          setProductId(product.id);
          setProductName(product.name);
          setProductDescription(product.description);
        }
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
      }
    };

    fetchProducts();
  }, []);

  const form = useForm<CoffeeForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: '',
      extra: [],
      sugar: '',
      temperature: '',
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const selectedSize = value.size;
      const selectedExtras = value.extra ?? [];

      const sizePrice = sizePrices[selectedSize ?? ''] || 0;
      const extrasPrice = selectedExtras.reduce(
        (sum, extra) => sum + (extra && extraPrices[extra] ? extraPrices[extra] : 0),
        0
      );

      setTotalPrice(basePrice + sizePrice + extrasPrice);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: CoffeeForm) => {
    const labelMap: Record<string, string> = {
      normal: 'Стандартная порция',
      more: 'Больше сахара',
      less: 'Меньше сахара',
      none: 'Без Сахара',
      noIce: 'Без льда',
      lessIce: 'Меньше льда',
      standardIce: 'Стандартная порция льда',
      taroPearl: 'Жемчуг таро',
      altMilk: 'Альтернативное молоко',
      extraPearl: 'Доп. порция жемчуг',
    };

    const orderData: CreateOrderRequest = {
      phoneNumber: '+77011234567',
      productId: productId || 2,
      quantity: 1,
      price: totalPrice,
      selectedAttributes: {
        'Объем': data.size,
        'Дополнительно': (data.extra ?? []).map((e) => labelMap[e] || e),
        'Сахар': labelMap[data.sugar] || data.sugar,
        'Температура напитка': labelMap[data.temperature] || data.temperature,
      },
    };

    try {
      await OrderService.createOrder(orderData);
      setOpen(false);
      console.log('Заказ успешно отправлен!');
    } catch (error) {
      alert('Ошибка при создании заказа');
      console.log(error);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-[#f7f7f7] p-4">
      <div className="max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <Image
          src={coffee}
          alt="Coffee"
          width={400}
          height={250}
          className="w-full h-64 object-cover rounded-t-xl"
        />
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{productName}</h2>
          <p className="text-gray-600 text-sm mb-4">{productDescription}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-[#D53F8C]">₸ 2200</span>
            <Button onClick={() => setOpen(true)} className="bg-[#D53F8C] text-white hover:bg-[#B83280] transition duration-300">
              Заказать
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-center">Оформление заказа</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium text-gray-700">Объем</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D53F8C]">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0.5">Орео 0.5</SelectItem>
                        <SelectItem value="0.7">Орео 0.7 (+200₸)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="extra"
                render={() => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium text-gray-700">Дополнительно</FormLabel>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: 'Жемчуг таро (+300₸)', value: 'taroPearl' },
                        { label: 'Альтернативное молоко (+300₸)', value: 'altMilk' },
                        { label: 'Доп. порция жемчуг (+300₸)', value: 'extraPearl' },
                      ].map((item) => (
                        <label key={item.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={item.value}
                            {...form.register('extra')}
                            className="rounded-lg"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sugar"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium text-gray-700">Сахар</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D53F8C]">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Стандартная порция</SelectItem>
                        <SelectItem value="more">Больше сахара</SelectItem>
                        <SelectItem value="less">Меньше сахара</SelectItem>
                        <SelectItem value="none">Без сахара</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium text-gray-700">Температура напитка</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D53F8C]">
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="noIce">Без льда</SelectItem>
                        <SelectItem value="lessIce">Меньше льда</SelectItem>
                        <SelectItem value="standardIce">Стандартная порция льда</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <div className="text-right text-lg font-semibold text-[#D53F8C]">
                Общая сумма: ₸ {totalPrice}
              </div>

              <Button type="submit" className="w-full bg-[#D53F8C] hover:bg-[#B83280] text-white transition duration-300">
                Подтвердить заказ
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
