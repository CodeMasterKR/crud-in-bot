import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Telegraf, Markup } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
    this.bot = new Telegraf('7723187423:AAE0dxx6acXTxLtq79iX_IwRwN_gS7h02YA');
    this.setupBot();
  }

  private async setupBot() {
    this.bot.start(async (ctx) => {
      const userId = BigInt(ctx.from.id);

      let user = await this.prisma.user.findFirst({
        where: { telegamId: userId },
      });

      if (user) {
        ctx.reply(
          `Salom, ${user.userName}! Botga xush kelibsiz.`,
          Markup.inlineKeyboard([
            [Markup.button.callback('Mahsulot qo‘shish', 'add_product')],
            [Markup.button.callback('Mahsulotlarni ko‘rish', 'get_products')],
            [Markup.button.callback('Mahsulotni yangilash', 'update_product')],
            [Markup.button.callback('Mahsulotni o‘chirish', 'delete_product')],
          ]),
        );
      } else {
        try {
          user = await this.prisma.user.create({
            data: {
              userName: ctx.from.username || `User_${userId}`,
              telegamId: userId, 
            },
          });
          ctx.reply(
            `Tabriklaymiz, ${user.userName}! Siz muvaffaqiyatli ro'yxatdan o'tdingiz.`,
            Markup.inlineKeyboard([
              [Markup.button.callback('Mahsulot qo‘shish', 'add_product')],
              [Markup.button.callback('Mahsulotlarni ko‘rish', 'get_products')],
              [Markup.button.callback('Mahsulotni yangilash', 'update_product')],
              [Markup.button.callback('Mahsulotni o‘chirish', 'delete_product')],
            ]),
          );
        } catch (error) {
          ctx.reply('Ro‘yxatdan o‘tishda xatolik yuz berdi.');
          console.error(error);
        }
      }
    });

    this.bot.action('add_product', (ctx) => {
      ctx.reply('Mahsulot qo‘shish uchun ma’lumot kiriting: <nomi> <narxi> <rangi>');
      this.bot.on('text', async (ctx) => {
        const args = ctx.message.text.split(' ');
        if (args.length < 3) {
          return ctx.reply('Iltimos, to‘liq ma’lumot kiriting: <nomi> <narxi> <rangi>');
        }
        const [name, price, color] = args;
        try {
          const product = await this.prisma.product.create({
            data: {
              name,
              price: parseInt(price),
              color,
            },
          });
          ctx.reply(
            `Mahsulot qo‘shildi: ${product.name}, Narxi: ${product.price}, Rangi: ${product.color}`,
            Markup.inlineKeyboard([[Markup.button.callback('Bosh menyuga qaytish', 'main_menu')]]),
          );
        } catch (error) {
          ctx.reply('Mahsulot qo‘shishda xatolik yuz berdi.');
          console.error(error);
        }
      });
    });

    this.bot.action('get_products', async (ctx) => {
      const products = await this.prisma.product.findMany();
      if (products.length === 0) {
        return ctx.reply(
          'Hozircha mahsulotlar yo‘q.',
          Markup.inlineKeyboard([[Markup.button.callback('Bosh menyuga qaytish', 'main_menu')]]),
        );
      }
      const productList = products
        .map((p) => `ID: ${p.id}, Nomi: ${p.name}, Narxi: ${p.price}, Rangi: ${p.color}`)
        .join('\n');
      ctx.reply(
        `Mahsulotlar ro‘yxati:\n${productList}`,
        Markup.inlineKeyboard([[Markup.button.callback('Bosh menyuga qaytish', 'main_menu')]]),
      );
    });

    this.bot.action('main_menu', (ctx) => {
      ctx.reply(
        'Asosiy menyu:',
        Markup.inlineKeyboard([
          [Markup.button.callback('Mahsulot qo‘shish', 'add_product')],
          [Markup.button.callback('Mahsulotlarni ko‘rish', 'get_products')],
          [Markup.button.callback('Mahsulotni yangilash', 'update_product')],
          [Markup.button.callback('Mahsulotni o‘chirish', 'delete_product')],
        ]),
      );
    });

    this.bot.launch().then(() => {
      console.log('Bot ishga tushdi!');
    });
  }
}