'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import coffee from '../../public/photo_2025-05-11_00-51-00.jpg';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const coffeeFormSchema = z.object({
  size: z.string().min(1, 'Выберите размер'),
});

type CoffeeForm = z.infer<typeof coffeeFormSchema>;

export default function HomePage() {
  const [open, setOpen] = useState(false);

  const form = useForm<CoffeeForm>({
    resolver: zodResolver(coffeeFormSchema),
    defaultValues: {
      size: '',
    },
  });

  const onSubmit = (data: CoffeeForm) => {
    console.log('Форма отправлена:', data);
    // axios.post('/api/order', data)
    setOpen(false);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-[#f7f7f7] p-4">
      <div className="max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <Image
          src={coffee}
          alt="Coffee"
          width={400}
          height={250}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">Кофе латте</h2>
          <p className="text-gray-600 mb-4">
            Нежный латте с ванильной пенкой и ароматным эспрессо.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">₸ 1200</span>
            <Button onClick={() => setOpen(true)}>Заказать</Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Оформление заказа</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Размер напитка</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите размер" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">Маленький</SelectItem>
                        <SelectItem value="medium">Средний</SelectItem>
                        <SelectItem value="large">Большой</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Подтвердить заказ
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
