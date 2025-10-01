import { Markup, Telegraf } from "telegraf";

import { prismaClient } from "./prisma";

const bot = new Telegraf(process.env.BOT_TOKEN!);


export const pendingWalletMap = new Map<string, true>();


const WALLET_CONNECTION = Markup.inlineKeyboard([
    Markup.button.callback('Connect Wallet', 'wallet_connection')
]);


const RULE_SELECTION = Markup.inlineKeyboard([
    [Markup.button.callback('Swap SOL → USDC', 'rule_swap')],
    [Markup.button.callback('Transfer 0.1 SOL weekly', 'rule_transfer')],
    [Markup.button.callback('Price Alert', 'rule_alert')]
])

bot.start(async (ctx) => {

    const existingUser = await prismaClient.user.findFirst({
        where: {
            teleUserId: ctx.chat.id.toString()
        }
    })
    if (existingUser) {
        const publicKey = await prismaClient.wallets.findFirst({
            where: {
                userId: existingUser.id
            }
        })

        const rules = await prismaClient.rules.findMany({
            where: {
                userId: existingUser.id
            }
        });


        let message = `Welcome back to Defi Pilot! 🚀\n\n`;
        message += `Your wallet: ${publicKey?.publicAddress}\n\n`;

        if (rules.length > 0) {
            message += `📋 Your Active Rules:\n`;
            rules.forEach((rule, index) => {
                message += `\n${index + 1}. ${rule.action.toUpperCase()}\n`;
                message += `   Status: ${rule.status}\n`;
                message += `   Condition: ${rule.condidtion}\n`;
            });
            message += `\n\nWant to add more rules?`;

            ctx.reply(message, RULE_SELECTION);

        }

        else {
            message += `You don't have any rules yet. Would you like to create one?`;
            ctx.reply(message, RULE_SELECTION);
        }
    }
    else {

        ctx.reply("Please connect your wallet:", WALLET_CONNECTION);


    }

}
)

bot.action('wallet_connection', async (ctx) => {
    let users = await prismaClient.user.findFirst({
        where: {
            teleUserId: ctx.chat?.id.toString()
        }
    })

    if (!users) {
        users = await prismaClient.user.create({
            data: {
                teleUserId: ctx.chat?.id?.toString() ?? "",
                createAt: new Date()
            }
        });

    }

    pendingWalletMap.set(users.id, true);

    ctx.reply("✅ Please paste your wallet public address now.");
})

bot.on('text', async (ctx) => {
    try {

        const message = ctx.message.text;

        const walletExist = await prismaClient.wallets.findFirst({
            where: {
                publicAddress: message
            }
        });


        const user = await prismaClient.user.findFirst({
            where: {
                teleUserId: ctx.chat.id.toString()
            }
        })


        if (!user) {
            return null;
        }

        if (walletExist) {
            ctx.reply("⚠️ This wallet is already connected.");
            pendingWalletMap.delete(user.id);
            return;
        }

        await prismaClient.wallets.create({
            data: {
                publicAddress: message,
                userId: user.id,
                createAt: new Date()
            }
        });


        pendingWalletMap.delete(user.id);

        ctx.reply(`✅ Your wallet connected successfully: ${message}`);

    } catch (error) {
        console.log(error);
        ctx.reply(`Error while pating wallet address}`);

    }

})



bot.launch()