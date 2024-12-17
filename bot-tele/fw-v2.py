import logging
import requests
from pyngrok import ngrok
import os
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackContext, CallbackQueryHandler

# Thiết lập logging cho bot
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Thư mục chứa các file
DOC_FOLDER = "public/"

def ips(update: Update, context: CallbackContext) -> None:
    TOKEN_API = '2eocIvtcQSW0FQMznzKeKGgIhTU_6ddApZH1AH7hNmiLLYtDr'
    ngrok.set_auth_token(TOKEN_API)
    public_url = ngrok.connect("443", "http").public_url;
    result = f'{public_url}';
    update.message.reply_text(result);

def localip(update: Update, context: CallbackContext) -> None:
    localip_adr = 'https://192.168.1.4'
    update.message.reply_text(localip_adr);

def list_doc_files():
    """Trả về danh sách tất cả các file trong thư mục DOC_FOLDER"""
    files = [f for f in os.listdir(DOC_FOLDER) if os.path.isfile(os.path.join(DOC_FOLDER, f))]
    return files


def list_docs(update: Update, context: CallbackContext) -> None:
    """Xử lý lệnh /listdoc để gửi menu lựa chọn file"""
    doc_files = list_doc_files()
    if not doc_files:
        update.message.reply_text("Không tìm thấy file nào trong thư mục public.")
        return

    # Tạo menu lựa chọn file
    keyboard = [[InlineKeyboardButton(file, callback_data=file)] for file in doc_files]
    reply_markup = InlineKeyboardMarkup(keyboard)

    update.message.reply_text("Chọn file bạn muốn tải xuống:", reply_markup=reply_markup)


def send_file(update: Update, context: CallbackContext) -> None:
    """Xử lý callback khi người dùng chọn một file từ menu"""
    query = update.callback_query
    query.answer()

    selected_file = query.data
    file_path = os.path.join(DOC_FOLDER, selected_file)

    # Gửi file đến người dùng
    if os.path.exists(file_path):
        context.bot.send_document(chat_id=query.message.chat_id, document=open(file_path, 'rb'))
    else:
        query.message.reply_text("File không tồn tại hoặc đã bị xóa.")


def main() -> None:
    """Khởi chạy bot"""
    # Token của bot Telegram
    YOUR_TELEGRAM_BOT_TOKEN = '7449831964:AAGCSm0QLkqAFBcPG2wu1GMFuDlylc4W71M'

    # Khởi tạo Updater
    updater = Updater(YOUR_TELEGRAM_BOT_TOKEN, use_context=True)

    # Lấy dispatcher để đăng ký handler
    dispatcher = updater.dispatcher

    # Đăng ký các lệnh và callback
    dispatcher.add_handler(CommandHandler("public", list_docs))
    dispatcher.add_handler(CallbackQueryHandler(send_file))

    # Đăng ký handler cho lệnh /hello
    dispatcher.add_handler(CommandHandler("ip", ips))
    dispatcher.add_handler(CommandHandler("localip", localip))

    # Bắt đầu bot
    updater.start_polling()
    logger.info("Bot đã bắt đầu chạy. Nhấn Ctrl + C để dừng.")
    updater.idle()


if __name__ == '__main__':
    main()
