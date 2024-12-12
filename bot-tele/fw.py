# 3. Check Ip để có thể kiểm tra entry và access vào mạng kể cả khi ở xa:
import logging
import requests

from pyngrok import ngrok

from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Thiết lập logging cho bot
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)


def ips(update: Update, context: CallbackContext) -> None:
    TOKEN_API = '2eocIvtcQSW0FQMznzKeKGgIhTU_6ddApZH1AH7hNmiLLYtDr'
    ngrok.set_auth_token(TOKEN_API)
    public_url = ngrok.connect("443", "http").public_url;
    result = f'{public_url}';
    update.message.reply_text(result);


def main() -> None:
    # Khởi tạo Updater với token của bot
    YOUR_TELEGRAM_BOT_TOKEN = '7449831964:AAGCSm0QLkqAFBcPG2wu1GMFuDlylc4W71M';
    updater = Updater(YOUR_TELEGRAM_BOT_TOKEN);

    # Lấy dispatcher để đăng ký các handler
    dispatcher = updater.dispatcher

    # Đăng ký handler cho lệnh /hello
    dispatcher.add_handler(CommandHandler("ip", ips))
    # Bắt đầu bot
    updater.start_polling()

    # Tắt bot khi nhấn Ctrl + C
    updater.idle()

if __name__ == '__main__':
    main()
# Để fix lỗi update_queue hãy cài câu lệnh sau:
# pip install python-telegram-bot==13.13